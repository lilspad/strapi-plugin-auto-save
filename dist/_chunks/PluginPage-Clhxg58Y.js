"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const designSystem = require("@strapi/design-system");
const icons = require("@strapi/icons");
const FEATURES = [
  {
    Icon: icons.ArrowClockwise,
    title: "Automatic Saving",
    desc: "Your content is saved automatically as you type, with no manual action needed."
  },
  {
    Icon: icons.Clock,
    title: "Smart Debounce",
    desc: "Saves are batched with a 2-second debounce to avoid excessive requests."
  },
  {
    Icon: icons.Shield,
    title: "Safe & Non-Intrusive",
    desc: "Works silently in the background without disruptive dialogs or page reloads."
  },
  {
    Icon: icons.Feather,
    title: "Lightweight",
    desc: "Zero external dependencies. Built entirely on Strapi's own APIs."
  }
];
const HOW_IT_WORKS = [
  "You start editing any content entry.",
  "The plugin detects changes in the form fields.",
  "After a short pause (2 s), it auto-saves via the Strapi Document API.",
  "A subtle status indicator in the sidebar confirms the save."
];
function PluginPage() {
  return /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { padding: 10, background: "neutral100", style: { minHeight: "100vh" }, children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Box, { style: { maxWidth: 760, margin: "0 auto" }, children: [
    /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { direction: "column", alignItems: "center", gap: 3, paddingBottom: 6, children: [
      /* @__PURE__ */ jsxRuntime.jsx(
        designSystem.Box,
        {
          background: "primary100",
          hasRadius: true,
          padding: 3,
          style: { display: "inline-flex", borderRadius: 12 },
          children: /* @__PURE__ */ jsxRuntime.jsx(icons.ArrowClockwise, { width: "32px", height: "32px", fill: "primary600" })
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsx(
        designSystem.Typography,
        {
          variant: "alpha",
          textColor: "neutral800",
          style: { textAlign: "center" },
          children: "Auto Save"
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsx(
        designSystem.Typography,
        {
          variant: "omega",
          textColor: "neutral600",
          style: { textAlign: "center", lineHeight: 1.6, maxWidth: 520 },
          children: "A lightweight Strapi plugin that automatically saves your content as you edit. No more lost work, every change is persisted in the background without interrupting your workflow."
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Divider, {}),
    /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Box, { paddingTop: 6, paddingBottom: 6, children: [
      /* @__PURE__ */ jsxRuntime.jsx(
        designSystem.Typography,
        {
          variant: "delta",
          textColor: "neutral800",
          style: { textAlign: "center", display: "block", marginBottom: 20 },
          children: "Features"
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Root, { gap: 5, children: FEATURES.map(({ Icon, title, desc }) => /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Item, { col: 6, s: 12, children: /* @__PURE__ */ jsxRuntime.jsx(
        designSystem.Box,
        {
          background: "neutral0",
          hasRadius: true,
          padding: 5,
          shadow: "filterShadow",
          style: { height: "100%", width: "100%" },
          children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { direction: "column", alignItems: "center", gap: 3, children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              designSystem.Box,
              {
                background: "primary100",
                hasRadius: true,
                padding: 2,
                style: { display: "inline-flex", borderRadius: 8 },
                children: /* @__PURE__ */ jsxRuntime.jsx(Icon, { width: "20px", height: "20px", fill: "primary600" })
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(
              designSystem.Typography,
              {
                variant: "delta",
                textColor: "neutral800",
                style: { textAlign: "center" },
                children: title
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(
              designSystem.Typography,
              {
                variant: "pi",
                textColor: "neutral600",
                style: { textAlign: "center", lineHeight: 1.55 },
                children: desc
              }
            )
          ] })
        }
      ) }, title)) })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Divider, {}),
    /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Box, { paddingTop: 6, paddingBottom: 6, children: [
      /* @__PURE__ */ jsxRuntime.jsx(
        designSystem.Typography,
        {
          variant: "delta",
          textColor: "neutral800",
          style: { textAlign: "center", display: "block", marginBottom: 20 },
          children: "How It Works"
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { style: { maxWidth: 480, margin: "0 auto" }, children: HOW_IT_WORKS.map((step, i) => /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { gap: 3, alignItems: "flex-start", paddingBottom: 3, children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          designSystem.Box,
          {
            background: "primary600",
            hasRadius: true,
            style: {
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              borderRadius: "50%"
            },
            children: /* @__PURE__ */ jsxRuntime.jsx(
              designSystem.Typography,
              {
                variant: "pi",
                textColor: "neutral0",
                fontWeight: "bold",
                children: i + 1
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(
          designSystem.Typography,
          {
            variant: "omega",
            textColor: "neutral700",
            style: { lineHeight: 1.6, paddingTop: 3 },
            children: step
          }
        )
      ] }, i)) })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Divider, {}),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { paddingTop: 5, children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { justifyContent: "center", gap: 2, alignItems: "center", children: [
      /* @__PURE__ */ jsxRuntime.jsx(icons.CheckCircle, { width: "14px", height: "14px", fill: "success600" }),
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "pi", textColor: "neutral500", children: "Auto Save is active and running on all content types." })
    ] }) })
  ] }) });
}
exports.PluginPage = PluginPage;
exports.default = PluginPage;
