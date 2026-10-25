(function () {
  var DEFAULTS = { enabled: true, size: 32, sensitivity: 100 };
  var $ = function (id) { return document.getElementById(id); };
  var enabled = $("enabled"), size = $("size"), sens = $("sensitivity");

  function render(v) {
    enabled.checked = v.enabled !== false;
    size.value = v.size; sens.value = v.sensitivity;
    $("sizeOut").textContent = v.size + " px";
    $("sensOut").textContent = v.sensitivity + "%";
    $("preview").style.width = $("preview").style.height = v.size + "px";
    $("preview").style.opacity = enabled.checked ? 1 : 0.35;
  }
  function read() {
    return { enabled: enabled.checked, size: Number(size.value), sensitivity: Number(sens.value) };
  }
  function save() { var v = read(); render(v); chrome.storage.sync.set(v); }

  chrome.storage.sync.get(DEFAULTS, render);
  [enabled, size, sens].forEach(function (el) { el.addEventListener("input", save); });
  $("reset").addEventListener("click", function () { render(DEFAULTS); chrome.storage.sync.set(DEFAULTS); });
})();
