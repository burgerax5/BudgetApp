import '@astrojs/internal-helpers/path';
import 'cookie';
import 'kleur/colors';
import 'string-width';
import 'html-escaper';
import 'clsx';
import './chunks/astro_-7SYEXcA.mjs';
import 'cssesc';
import { compile } from 'path-to-regexp';

if (typeof process !== "undefined") {
  let proc = process;
  if ("argv" in proc && Array.isArray(proc.argv)) {
    if (proc.argv.includes("--verbose")) ; else if (proc.argv.includes("--silent")) ; else ;
  }
}

function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return "/" + segment.map((part) => {
      if (part.spread) {
        return `:${part.content.slice(3)}(.*)?`;
      } else if (part.dynamic) {
        return `:${part.content}`;
      } else {
        return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
    }).join("");
  }).join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return toPath;
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware(_, next) {
      return next();
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    clientDirectives,
    routes
  };
}

const manifest = deserializeManifest({"adapterName":"@astrojs/netlify","routes":[{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"expenses/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/expenses","isIndex":false,"type":"page","pattern":"^\\/expenses\\/?$","segments":[[{"content":"expenses","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/expenses.astro","pathname":"/expenses","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"forgotPassword/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/forgotpassword","isIndex":false,"type":"page","pattern":"^\\/forgotPassword\\/?$","segments":[[{"content":"forgotPassword","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/forgotPassword.astro","pathname":"/forgotPassword","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"login/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/login","isIndex":false,"type":"page","pattern":"^\\/login\\/?$","segments":[[{"content":"login","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/login.astro","pathname":"/login","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"profile/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/profile","isIndex":false,"type":"page","pattern":"^\\/profile\\/?$","segments":[[{"content":"profile","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/profile.astro","pathname":"/profile","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"profile/stats/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/profile/stats","isIndex":false,"type":"page","pattern":"^\\/profile\\/stats\\/?$","segments":[[{"content":"profile","dynamic":false,"spread":false}],[{"content":"stats","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/profile/stats.astro","pathname":"/profile/stats","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"register/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/register","isIndex":false,"type":"page","pattern":"^\\/register\\/?$","segments":[[{"content":"register","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/register.astro","pathname":"/register","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["C:/Programming/Web Dev/BudgetApp/frontend/src/pages/expenses.astro",{"propagation":"none","containsHead":true}],["C:/Programming/Web Dev/BudgetApp/frontend/src/pages/forgotPassword.astro",{"propagation":"none","containsHead":true}],["C:/Programming/Web Dev/BudgetApp/frontend/src/pages/index.astro",{"propagation":"none","containsHead":true}],["C:/Programming/Web Dev/BudgetApp/frontend/src/pages/login.astro",{"propagation":"none","containsHead":true}],["C:/Programming/Web Dev/BudgetApp/frontend/src/pages/profile.astro",{"propagation":"none","containsHead":true}],["C:/Programming/Web Dev/BudgetApp/frontend/src/pages/profile/stats.astro",{"propagation":"none","containsHead":true}],["C:/Programming/Web Dev/BudgetApp/frontend/src/pages/register.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var i=t=>{let e=async()=>{await(await t())()};\"requestIdleCallback\"in window?window.requestIdleCallback(e):setTimeout(e,200)};(self.Astro||(self.Astro={})).idle=i;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000noop-middleware":"_noop-middleware.mjs","/node_modules/astro/dist/assets/endpoint/generic.js":"chunks/pages/generic_3kSldTXx.mjs","\u0000@astrojs-manifest":"manifest_DGNJHB17.mjs","C:/Programming/Web Dev/BudgetApp/frontend/node_modules/@astrojs/react/vnode-children.js":"chunks/vnode-children_3wEZly-Z.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"chunks/generic_NqJUiRHm.mjs","\u0000@astro-page:src/pages/index@_@astro":"chunks/index_iv7QI6SA.mjs","\u0000@astro-page:src/pages/expenses@_@astro":"chunks/expenses_c6C5ECCI.mjs","\u0000@astro-page:src/pages/forgotPassword@_@astro":"chunks/forgotPassword_5cydB9q6.mjs","\u0000@astro-page:src/pages/login@_@astro":"chunks/login_pEB9iu--.mjs","\u0000@astro-page:src/pages/profile@_@astro":"chunks/profile_FAE81ab1.mjs","\u0000@astro-page:src/pages/profile/stats@_@astro":"chunks/stats_8qaI6-9G.mjs","\u0000@astro-page:src/pages/register@_@astro":"chunks/register_XU9WiSTO.mjs","@astrojs/react/client.js":"_astro/client.U-DFgc5E.js","@/components/LoginForm":"_astro/LoginForm.CUpVigtI.js","@/components/profile/ProfilePage":"_astro/ProfilePage.DAOkC48B.js","@/components/RegisterForm":"_astro/RegisterForm.PyN4iSqu.js","@/components/Navbar":"_astro/Navbar.0KoiUXlC.js","@/components/forgotpassword/ForgotPassword":"_astro/ForgotPassword.IvyJSxWK.js","@/components/profile/ProfileNav":"_astro/ProfileNav.UOLmLaZc.js","@/components/Protect":"_astro/Protect.jH6wYNIJ.js","@/components/ui/toaster":"_astro/toaster.MILB2SZl.js","@/components/expensefilters/ExpensePage":"_astro/ExpensePage.KuajZVMJ.js","/astro/hoisted.js?q=0":"_astro/hoisted.DIC1WmG9.js","@/components/RenderHome":"_astro/RenderHome.9fye_2ji.js","astro:scripts/before-hydration.js":""},"assets":["/_astro/hero.01zkUJGF.png","/_astro/hero-light.M1gp2z_c.png","/_astro/prisma.zFfX5Vm9.png","/_astro/astrojs.cjaNRIFe.png","/_astro/nodejs.zkCIUEOC.png","/_astro/ts.HKfjGC_N.png","/_astro/react.hZOoNug5.png","/_astro/expenses.aOrIang6.css","/favicon.svg","/_astro/axios.i6kGg716.js","/_astro/card.PqytqdVT.js","/_astro/client.U-DFgc5E.js","/_astro/createLucideIcon.r2TsNr8r.js","/_astro/ExpensePage.KuajZVMJ.js","/_astro/ExpensesTable.GahHDUcq.js","/_astro/ForgotPassword.IvyJSxWK.js","/_astro/hoisted.DIC1WmG9.js","/_astro/index.9AF9g4V4.js","/_astro/index.BeB9rkTW.js","/_astro/index.QmwwUVlf.css","/_astro/index.uGIPC8rq.js","/_astro/index.z1Y66d3Q.js","/_astro/input.BOUKRZNc.js","/_astro/jsx-runtime.pwZL9jDf.js","/_astro/label.l3q7WfzL.js","/_astro/LoginForm.CUpVigtI.js","/_astro/Navbar.0KoiUXlC.js","/_astro/popover.Eqb8LGq2.js","/_astro/ProfileNav.UOLmLaZc.js","/_astro/ProfilePage.DAOkC48B.js","/_astro/Protect.jH6wYNIJ.js","/_astro/RegisterForm.PyN4iSqu.js","/_astro/RenderHome.9fye_2ji.js","/_astro/table.olPZ6Jk1.js","/_astro/toaster.MILB2SZl.js","/_astro/use-toast.CJJJFlQq.js","/_astro/username-input.QBe6PUG0.js","/_astro/x.UvmSEvSX.js","/index.html","/expenses/index.html","/forgotPassword/index.html","/login/index.html","/profile/index.html","/profile/stats/index.html","/register/index.html"],"buildFormat":"directory"});

export { manifest };
