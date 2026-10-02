"use strict";
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
const register = ({ strapi }) => {
  strapi.log.info("[auto-save] Plugin registered");
};
const bootstrap = ({ strapi }) => {
  strapi.log.info("[auto-save] Plugin bootstrapped");
};
const destroy = ({ strapi }) => {
  strapi.log.info("[auto-save] Plugin destroyed");
};
var server = {
  register,
  bootstrap,
  destroy,
  config: {
    default: {},
    validator() {
    }
  },
  routes: [],
  controllers: {},
  services: {},
  policies: {},
  middlewares: {},
  contentTypes: {}
};
var strapiServer = server;
const strapiServer_default = /* @__PURE__ */ getDefaultExportFromCjs(strapiServer);
module.exports = strapiServer_default;
