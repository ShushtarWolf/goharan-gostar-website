// Opt-in on-page readout for the gooey navbar: add ?gooeydebug=1 to the URL.
// Shows whether WebGL started, the texture format, paint status and any error,
// so a failure on a real phone can be screenshotted. Does nothing otherwise.

const ENABLED =
  typeof window !== "undefined" &&
  /(?:^|[?&])gooeydebug=1(?:&|$)/.test(window.location.search);

const state = {};
let el = null;
let queued = false;

function paint() {
  queued = false;
  if (!el) {
    el = document.createElement("pre");
    el.id = "gooey-debug";
    el.setAttribute("aria-hidden", "true");
    el.style.cssText =
      "position:fixed;top:8px;left:8px;z-index:2147483647;max-width:min(94vw,420px);" +
      "margin:0;padding:8px 10px;border-radius:8px;background:rgba(0,0,0,.82);color:#7fffd4;" +
      "font:11px/1.35 ui-monospace,Menlo,monospace;white-space:pre-wrap;word-break:break-all;" +
      "pointer-events:none;direction:ltr;text-align:left";
    document.body.appendChild(el);
  }
  el.textContent =
    "gooey debug\n" +
    Object.entries(state)
      .map(([k, v]) => `${k}: ${typeof v === "object" ? JSON.stringify(v) : v}`)
      .join("\n");
}

export function gooeyDebug(key, value) {
  if (!ENABLED) return;
  state[key] = value;
  if (!queued && typeof document !== "undefined" && document.body) {
    queued = true;
    requestAnimationFrame(paint);
  }
}

export const gooeyDebugEnabled = ENABLED;
