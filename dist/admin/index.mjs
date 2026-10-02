import { useSyncExternalStore, useState, useRef, useEffect, useCallback } from "react";
import { jsxs, jsx } from "react/jsx-runtime";
import { Box, Flex, Typography, Badge } from "@strapi/design-system";
import { CrossCircle, CheckCircle, ArrowClockwise, WarningCircle, Clock } from "@strapi/icons";
import { unstable_useContentManagerContext, unstable_useDocumentActions } from "@strapi/content-manager/strapi-admin";
const initialState = { status: "idle", lastSavedAt: null, saveError: null };
let state = { ...initialState };
const listeners = /* @__PURE__ */ new Set();
function notify() {
  listeners.forEach((fn) => fn());
}
function setAutoSaveState(updates) {
  state = { ...state, ...updates };
  notify();
}
function getAutoSaveState() {
  return state;
}
function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
function useAutoSaveStore() {
  return useSyncExternalStore(subscribe, getAutoSaveState, getAutoSaveState);
}
function fmt$1(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function AutoSaveHeaderAction() {
  const { status, lastSavedAt } = useAutoSaveStore();
  const message = {
    unsaved: "Unsaved changes",
    saving: "Saving...",
    saved: lastSavedAt ? `Saved at ${fmt$1(lastSavedAt)}` : "Saved",
    error: "Save failed",
    idle: null
  }[status] ?? null;
  if (!message) return null;
  return {
    id: "auto-save.header-status",
    _status: { message }
  };
}
const DEBOUNCE_MS = 2e3;
const INTERNAL_FIELDS = [
  "id",
  "documentId",
  "createdAt",
  "updatedAt",
  "publishedAt",
  "createdBy",
  "updatedBy",
  "locale",
  "localizations",
  "__temp_key__",
  "strapi_assignee",
  "strapi_stage"
];
function hasUserContent(vals) {
  if (!vals || typeof vals !== "object") return false;
  const isFilled = (value) => {
    if (value === null || value === void 0) return false;
    if (typeof value === "string") return value.trim().length > 0;
    if (typeof value === "number" || typeof value === "boolean") return true;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "object") return Object.keys(value).length > 0;
    return false;
  };
  return Object.entries(vals).some(
    ([key, value]) => !INTERNAL_FIELDS.includes(key) && isFilled(value)
  );
}
function useAutoSave() {
  const {
    form,
    model,
    id: documentId,
    collectionType,
    isCreatingEntry
  } = unstable_useContentManagerContext();
  const { modified: isModified, values } = form;
  const { update, create } = unstable_useDocumentActions();
  const [status, setStatus] = useState("idle");
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const ctxRef = useRef(null);
  ctxRef.current = {
    isModified,
    isCreatingEntry,
    values,
    model,
    documentId,
    collectionType
  };
  const updateFnRef = useRef(update);
  const createFnRef = useRef(create);
  useEffect(() => {
    updateFnRef.current = update;
  }, [update]);
  useEffect(() => {
    createFnRef.current = create;
  }, [create]);
  const createdDocIdRef = useRef(null);
  useEffect(() => {
    if (documentId) {
      createdDocIdRef.current = documentId;
    } else if (!isCreatingEntry) {
      createdDocIdRef.current = null;
    }
  }, [documentId, isCreatingEntry]);
  const performSave = useCallback(async () => {
    const {
      isCreatingEntry: creating,
      isModified: modified,
      values: v,
      model: m,
      documentId: docId,
      collectionType: ct
    } = ctxRef.current;
    if (!modified) return;
    const effectiveDocId = createdDocIdRef.current || docId;
    const isNewEntry = (creating || !docId) && !createdDocIdRef.current;
    if (isNewEntry && !hasUserContent(v)) return;
    setStatus("saving");
    setAutoSaveState({ status: "saving", saveError: null });
    setSaveError(null);
    try {
      let result;
      if (isNewEntry) {
        result = await createFnRef.current({ collectionType: ct, model: m }, v);
        const newId = result?.data?.documentId ?? result?.documentId ?? result?.id;
        if (newId) {
          createdDocIdRef.current = newId;
          const newPath = `/admin/content-manager/${ct}/${m}/${newId}`;
          window.history.replaceState(null, "", newPath);
        }
      } else {
        result = await updateFnRef.current(
          { collectionType: ct, model: m, documentId: effectiveDocId },
          v
        );
      }
      if (result && "error" in result) {
        const msg = result.error?.message ?? "Auto-save failed";
        setSaveError(msg);
        setStatus("error");
        setAutoSaveState({ status: "error", saveError: msg });
      } else {
        const now = /* @__PURE__ */ new Date();
        setLastSavedAt(now);
        setStatus("saved");
        setAutoSaveState({
          status: "saved",
          lastSavedAt: now,
          saveError: null
        });
      }
    } catch (err) {
      const msg = err?.message ?? "Unexpected error during auto-save";
      setSaveError(msg);
      setStatus("error");
      setAutoSaveState({ status: "error", saveError: msg });
    }
  }, []);
  useEffect(() => {
    if (!isModified) return;
    const {
      isCreatingEntry: creating,
      documentId: docId,
      values: v
    } = ctxRef.current;
    const isNewEntry = (creating || !docId) && !createdDocIdRef.current;
    if (isNewEntry && !hasUserContent(v)) return;
    setStatus("unsaved");
    setAutoSaveState({ status: "unsaved" });
    const timer = setTimeout(() => {
      performSave();
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [values, isModified, performSave]);
  useEffect(() => {
    if (!isModified && status !== "saving") {
      setStatus("idle");
      setAutoSaveState({ status: "idle" });
    }
  }, [isModified, status]);
  const saveNow = useCallback(() => {
    performSave();
  }, [performSave]);
  return { status, lastSavedAt, saveError, saveNow, isModified };
}
const STATUS_CONFIG = {
  idle: { label: "All changes saved", color: "success600", Icon: CheckCircle },
  unsaved: {
    label: "Unsaved changes",
    color: "warning600",
    Icon: WarningCircle
  },
  saving: { label: "Saving...", color: "primary600", Icon: ArrowClockwise },
  saved: { label: "Saved", color: "success600", Icon: CheckCircle },
  error: { label: "Save failed", color: "danger600", Icon: CrossCircle }
};
function fmt(date) {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}
function getChangedFields(values, initialValues) {
  if (!values || !initialValues) return [];
  return Object.keys(values).filter((key) => {
    const current = values[key];
    const initial = initialValues[key];
    if (current === initial) return false;
    return JSON.stringify(current) !== JSON.stringify(initial);
  });
}
function AutoSavePanel() {
  const { form } = unstable_useContentManagerContext();
  const { values, initialValues, modified: isModified } = form;
  const { status, lastSavedAt, saveError } = useAutoSave();
  const changedFields = isModified ? getChangedFields(values, initialValues) : [];
  const changedFieldCount = changedFields.length;
  const { label, color, Icon } = STATUS_CONFIG[status] ?? STATUS_CONFIG.idle;
  return /* @__PURE__ */ jsxs(Box, { padding: 4, background: "neutral0", children: [
    /* @__PURE__ */ jsxs(
      Flex,
      {
        alignItems: "center",
        gap: 2,
        marginBottom: lastSavedAt || isModified && changedFieldCount > 0 ? 3 : 0,
        children: [
          /* @__PURE__ */ jsx(Icon, { width: "16px", height: "16px", fill: color }),
          /* @__PURE__ */ jsx(Typography, { variant: "sigma", textColor: color, children: label }),
          isModified && changedFieldCount > 0 && /* @__PURE__ */ jsx(Badge, { children: changedFieldCount })
        ]
      }
    ),
    lastSavedAt && /* @__PURE__ */ jsxs(Flex, { alignItems: "center", gap: 1, marginBottom: isModified ? 3 : 0, children: [
      /* @__PURE__ */ jsx(Clock, { width: "12px", height: "12px", fill: "neutral500" }),
      /* @__PURE__ */ jsxs(Typography, { variant: "pi", textColor: "neutral500", children: [
        "Last saved at ",
        fmt(lastSavedAt)
      ] })
    ] }),
    status === "error" && saveError && /* @__PURE__ */ jsx(Box, { background: "danger100", hasRadius: true, padding: 2, marginBottom: 3, children: /* @__PURE__ */ jsx(Typography, { variant: "pi", textColor: "danger600", children: saveError }) }),
    isModified && changedFieldCount > 0 && /* @__PURE__ */ jsxs(Box, { marginTop: 3, children: [
      /* @__PURE__ */ jsx(Typography, { variant: "pi", textColor: "neutral600", fontWeight: "semiBold", children: "Modified fields:" }),
      /* @__PURE__ */ jsx(Flex, { gap: 1, wrap: "wrap", marginTop: 2, children: changedFields.map((field) => /* @__PURE__ */ jsx(
        Box,
        {
          background: "warning100",
          hasRadius: true,
          paddingTop: 1,
          paddingBottom: 1,
          paddingLeft: 2,
          paddingRight: 2,
          children: /* @__PURE__ */ jsx(Typography, { variant: "pi", textColor: "warning700", children: field })
        },
        field
      )) })
    ] })
  ] });
}
function createAutoSaveUpdateAction(originalUpdateAction) {
  function AutoSaveUpdateAction(props) {
    const { status } = useAutoSaveStore();
    const base = originalUpdateAction(props);
    if (!base) return null;
    const isSaving = status === "saving";
    const isSaved = status === "saved";
    const shouldDisable = isSaved || base.disabled && status !== "unsaved";
    return {
      ...base,
      label: isSaving ? "Saving…" : base.label ?? "Save",
      loading: isSaving || !!base.loading,
      disabled: shouldDisable
    };
  }
  AutoSaveUpdateAction.type = "update";
  AutoSaveUpdateAction.position = originalUpdateAction.position;
  return AutoSaveUpdateAction;
}
const PLUGIN_ID = "auto-save";
const register = (app) => {
  app.registerPlugin({
    id: PLUGIN_ID,
    name: PLUGIN_ID
  });
  app.addMenuLink({
    to: `plugins/${PLUGIN_ID}`,
    icon: ArrowClockwise,
    intlLabel: {
      id: `${PLUGIN_ID}.plugin.name`,
      defaultMessage: "Auto Save"
    },
    Component: () => import("../_chunks/PluginPage-Vl7hdIfA.mjs"),
    position: 4
  });
};
const bootstrap = (app) => {
  const contentManager = app.getPlugin("content-manager");
  if (!contentManager) return;
  if (typeof document !== "undefined") {
    const style = document.createElement("style");
    style.setAttribute("data-auto-save", "sticky-panel");
    style.textContent = `
      /* Widen the sidebar by overriding the parent grid's column template */
      div:has(> div:has(> aside[aria-labelledby="additional-information"])) {
        grid-template-columns: 1fr 320px !important;
      }

      /* Sticky: sidebar wrapper stays in view while the form scrolls */
      div:has(> aside[aria-labelledby="additional-information"]) {
        position: sticky !important;
        top: 0 !important;
        align-self: start !important;
        max-height: 100vh !important;
        overflow-y: auto !important;
        min-width: 300px !important;
      }

      /* Give the aside itself more internal padding so content breathes */
      aside[aria-labelledby="additional-information"] {
        min-width: 280px !important;
        padding: 16px !important;
        gap: 12px !important;
      }

      /* Make Publish/Save buttons full width and a comfortable height */
      aside[aria-labelledby="additional-information"] button {
        min-height: 40px !important;
        font-size: 14px !important;
      }

      /* Row containing Publish button + 3-dots: let Publish grow, pin 3-dots */
      aside[aria-labelledby="additional-information"] > div > div,
      aside[aria-labelledby="additional-information"] div[class*="Flex"] {
        width: 100% !important;
      }

      /* The Publish button itself should stretch; the 3-dots button stays small */
      aside[aria-labelledby="additional-information"] button[aria-haspopup],
      aside[aria-labelledby="additional-information"] button[aria-expanded] {
        flex: 0 0 auto !important;
        width: auto !important;
        min-width: 36px !important;
        padding-left: 8px !important;
        padding-right: 8px !important;
      }

      /* Primary action button (Publish) takes all remaining space */
      aside[aria-labelledby="additional-information"] button[type="button"]:not([aria-haspopup]):not([aria-expanded]):not([aria-label]) {
        flex: 1 1 auto !important;
        width: auto !important;
      }

      /* Flex row that wraps Publish + 3-dots together */
      aside[aria-labelledby="additional-information"] div:has(> button + button) {
        display: flex !important;
        flex-direction: row !important;
        width: 100% !important;
        gap: 4px !important;
      }
    `;
    document.head.appendChild(style);
  }
  contentManager.apis.addDocumentHeaderAction([AutoSaveHeaderAction]);
  contentManager.apis.addDocumentAction(
    (actions) => actions.map(
      (action) => action.type === "update" ? createAutoSaveUpdateAction(action) : action
    )
  );
  contentManager.apis.addEditViewSidePanel([AutoSavePanel]);
};
const index = { register, bootstrap };
export {
  index as default
};
