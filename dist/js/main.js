"use strict";

function clearHoverEffects() {
  document.querySelectorAll('.hover').forEach(function (_) {
    _.classList.remove('hover');
  });
}
if (window.matchMedia("(max-width: 768px)").matches) {
  clearHoverEffects();
}
//# sourceMappingURL=main.js.map
