import { renderers } from './renderers.mjs';
import { manifest } from './manifest_DGNJHB17.mjs';
import * as serverEntrypointModule from '@astrojs/netlify/ssr-function.js';
import { onRequest } from './_noop-middleware.mjs';

const _page0 = () => import('./chunks/generic_NqJUiRHm.mjs');
const _page1 = () => import('./chunks/index_iv7QI6SA.mjs');
const _page2 = () => import('./chunks/expenses_c6C5ECCI.mjs');
const _page3 = () => import('./chunks/forgotPassword_5cydB9q6.mjs');
const _page4 = () => import('./chunks/login_pEB9iu--.mjs');
const _page5 = () => import('./chunks/profile_FAE81ab1.mjs');
const _page6 = () => import('./chunks/stats_8qaI6-9G.mjs');
const _page7 = () => import('./chunks/register_XU9WiSTO.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/index.astro", _page1],
    ["src/pages/expenses.astro", _page2],
    ["src/pages/forgotPassword.astro", _page3],
    ["src/pages/login.astro", _page4],
    ["src/pages/profile.astro", _page5],
    ["src/pages/profile/stats.astro", _page6],
    ["src/pages/register.astro", _page7]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    renderers,
    middleware: onRequest
});
const _args = {
    "middlewareSecret": "7c0dcc01-0e35-41f9-b5f2-a302a1616398"
};
const _exports = serverEntrypointModule.createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (_start in serverEntrypointModule) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
