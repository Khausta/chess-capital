"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Marquee = /*#__PURE__*/function () {
  function Marquee(parentWrap, options) {
    _classCallCheck(this, Marquee);
    this.marqueeWrap = parentWrap;
    this.marqueeItemsWrap = parentWrap.querySelector('.marquee-items-wrap');
    this.marqueeItems = parentWrap.querySelector('.marquee-items');
    this.marqueeItem = parentWrap.querySelector('.marquee-item');
    this.isReverce = options.reverce || false;
    this.mouseOverPause = options.mouseOverPause || false;
  }
  return _createClass(Marquee, [{
    key: "init",
    value: function init() {
      this.checkItemWidth();
      this.startAnimation();
    }
  }, {
    key: "checkItemWidth",
    value: function checkItemWidth() {
      var itemWidth = this.marqueeItem.clientWidth;
      var marqueeWrapWidth = this.marqueeWrap.clientWidth;
      var multiples = marqueeWrapWidth / itemWidth;
      if (multiples > 1) {
        var missItemsCount = Math.ceil(multiples);
        this.cloneItems(missItemsCount);
      }
      this.cloneMarqueItems();
    }
  }, {
    key: "cloneItems",
    value: function cloneItems(count) {
      for (var i = 1; i <= count; i++) {
        var clone = this.marqueeWrap.querySelector('.marquee-item').cloneNode(true);
        this.marqueeItems.append(clone);
      }
    }
  }, {
    key: "cloneMarqueItems",
    value: function cloneMarqueItems() {
      var hiddenCloneItemsContainer = this.marqueeItems.cloneNode(true);
      hiddenCloneItemsContainer.setAttribute("aria-hidden", true);
      this.marqueeItemsWrap.appendChild(hiddenCloneItemsContainer);
    }
  }, {
    key: "startAnimation",
    value: function startAnimation() {
      if (!this.checkWindowWidth() && this.mouseOverPause) this.marqueeItemsWrap.classList.add('marquee-pause-hover-effect');
      this.marqueeWrap.querySelectorAll('.marquee-items').forEach(function (el) {
        el.classList.add('marquee');
      });
      if (this.isReverce) {
        this.reverceAnimation();
      }
    }
  }, {
    key: "reverceAnimation",
    value: function reverceAnimation() {
      this.marqueeWrap.querySelectorAll('.marquee-items').forEach(function (el) {
        el.classList.add('reverce');
      });
    }
  }, {
    key: "checkWindowWidth",
    value: function checkWindowWidth() {
      return window.matchMedia("(max-width: 768px)").matches;
    }
  }]);
}();
var marqueContainer = document.querySelector('.marquee-wrap');
new Marquee(marqueContainer, {
  mouseOverPause: true
}).init();
var marqueContainerFooter = document.querySelector('.marquee-wrap-footer');
new Marquee(marqueContainerFooter, {
  mouseOverPause: true
}).init();
//# sourceMappingURL=marquee.js.map
