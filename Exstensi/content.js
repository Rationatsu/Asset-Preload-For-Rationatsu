(function () {
  if (window.__rationatsuCursor) return;
  window.__rationatsuCursor = true;

  var STATES = ["idle", "pointer", "write", "unavailable"];
  var DEFAULTS = { enabled: true, size: 32, sensitivity: 100 };
  var settings = { enabled: DEFAULTS.enabled, size: DEFAULTS.size, sensitivity: DEFAULTS.sensitivity };

  var base = chrome.runtime.getURL("cursors/");
  var wrap = document.createElement("div");
  wrap.style.cssText = "position:fixed;left:0;top:0;pointer-events:none;z-index:2147483647;" +
    "will-change:transform;contain:layout style size;visibility:hidden;margin:0;padding:0;border:0;background:none";
  var imgs = {};
  STATES.forEach(function (s) {
    var im = document.createElement("img");
    im.alt = ""; im.draggable = false; im.decoding = "sync";
    im.src = base + s + ".png";
    im.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;display:none;" +
      "image-rendering:pixelated;margin:0;padding:0;border:0;max-width:none;max-height:none";
    imgs[s] = im;
    wrap.appendChild(im);
  });
  imgs.idle.style.display = "block";

  var style = document.createElement("style");
  style.textContent = "html,html *{cursor:none !important}";

  var attached = false;
  function attach() {
    if (attached || !settings.enabled) return;
    var root = document.documentElement;
    if (!root) return;
    root.appendChild(style);
    root.appendChild(wrap);
    attached = true;
  }
  function detach() {
    if (!attached) return;
    if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
    if (style.parentNode) style.parentNode.removeChild(style);
    attached = false;
  }

  function applySize() {
    var s = settings.size;
    wrap.style.width = s + "px";
    wrap.style.height = s + "px";
  }
  function applySettings() {
    applySize();
    if (settings.enabled) { attach(); } else { detach(); }
  }

  function clamp(v, lo, hi, d) {
    v = Number(v);
    if (!isFinite(v)) return d;
    return Math.min(hi, Math.max(lo, v));
  }
  function load(items) {
    settings.enabled = items.enabled !== false;
    settings.size = clamp(items.size, 16, 128, DEFAULTS.size);
    settings.sensitivity = clamp(items.sensitivity, 10, 100, DEFAULTS.sensitivity);
    applySettings();
  }
  try {
    chrome.storage.sync.get(DEFAULTS, load);
    chrome.storage.onChanged.addListener(function (changes, area) {
      if (area !== "sync") return;
      var next = {
        enabled: settings.enabled, size: settings.size, sensitivity: settings.sensitivity
      };
      for (var k in changes) if (k in next) next[k] = changes[k].newValue;
      load(next);
    });
  } catch (e) { applySettings(); }

  if (document.documentElement) attach();
  else document.addEventListener("DOMContentLoaded", attach);

  var SELECTOR = "a,button,select,summary,label,input,textarea,[role='button'],[role='tab'],[role='link'],[contenteditable='true'],[contenteditable='']";
  var current = "idle", lastTarget = null;
  var x = 0, y = 0, tx = 0, ty = 0, raf = 0, moved = false, lastT = 0;

  function stateFor(el) {
    if (!el || !el.closest) return "idle";
    var node = el.closest(SELECTOR);
    if (!node) return "idle";
    if (node.disabled || node.getAttribute("aria-disabled") === "true") return "unavailable";
    var ce = node.getAttribute("contenteditable");
    if (ce === "true" || ce === "") return "write";
    if (node.tagName === "TEXTAREA") return "write";
    if (node.tagName === "INPUT" && ["checkbox", "radio", "range", "button", "submit", "reset", "image", "file", "color"].indexOf(node.type) === -1) return "write";
    return "pointer";
  }
  function set(state) {
    if (state === current) return;
    imgs[current].style.display = "none";
    imgs[state].style.display = "block";
    current = state;
  }

  function draw() {
    wrap.style.transform = "translate3d(" + Math.round(x) + "px," + Math.round(y) + "px,0)";
  }
  function paint(now) {
    raf = 0;
    var s = settings.sensitivity;
    if (s >= 100) {
      x = tx; y = ty; draw(); return;
    }
   
    var dt = Math.min(0.05, Math.max(0.001, (now - (lastT || now - 16)) / 1000));
    lastT = now;
    var rate = 5 + (s / 100) * 55;          // 5 (floaty) .. 60 (almost instant)
    var a = 1 - Math.exp(-rate * dt);
    x += (tx - x) * a; y += (ty - y) * a;
    draw();
    if (Math.abs(tx - x) > 0.3 || Math.abs(ty - y) > 0.3) raf = requestAnimationFrame(paint);
    else { x = tx; y = ty; draw(); lastT = 0; }
  }

  document.addEventListener("mousemove", function (event) {
    tx = event.clientX; ty = event.clientY;
    if (!moved) { x = tx; y = ty; moved = true; }
    if (settings.enabled) {
      if (!attached) attach();
      wrap.style.visibility = "visible";
      if (event.target !== lastTarget) { lastTarget = event.target; set(stateFor(event.target)); }
    }
    if (!raf) raf = requestAnimationFrame(paint);
  }, { passive: true, capture: true });

  document.addEventListener("mouseleave", function () { wrap.style.visibility = "hidden"; }, { passive: true });
  document.addEventListener("mouseenter", function () { if (moved) wrap.style.visibility = "visible"; }, { passive: true });
})();
