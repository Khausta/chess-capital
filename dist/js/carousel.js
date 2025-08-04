"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Slider = /*#__PURE__*/function () {
  function Slider(wrapperSelector, itemSelector) {
    var _this = this;
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    _classCallCheck(this, Slider);
    _defineProperty(this, "touchStartHandler", function (event) {
      console.log('touch');
      _this.startX = event.touches[0].clientX; // Сохраняем начальное значение X
      _this.startY = event.touches[0].clientY; // Сохраняем начальное значение Y
    });
    _defineProperty(this, "touchEndHandler", function (event) {
      var endX = event.changedTouches[0].clientX; // Конечное значение X
      var endY = event.changedTouches[0].clientY; // Конечное значение Y

      var deltaX = _this.startX - endX; // Разница по X
      var deltaY = _this.startY - endY; // Разница по Y

      // Проверяем, что горизонтальное движение больше вертикального
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 30) {
        if (deltaX > 0) {
          // this.currentIndex += this.countSlidesPerSwipe;
          if (_this.loop) {
            _this.loopSlide(_this.countSlidesPerSwipe);
          } else {
            if (_this.currentIndex < _this.slides.length - 1) {
              _this.limitSlide(_this.countSlidesPerSwipe);
            }
          }
        } else {
          if (_this.loop) {
            _this.loopSlide(-_this.countSlidesPerSwipe);
          } else {
            if (_this.currentIndex !== 0) {
              _this.limitSlide(-_this.countSlidesPerSwipe);
            }
          }
        }
      }
    });
    this.gap = options.gap || 0;
    this.sliderWrapper = document.querySelector(wrapperSelector);
    this.slideContainer = this.sliderWrapper.parentNode;
    this.itemSelector = itemSelector;
    this.slides = document.querySelectorAll(itemSelector);
    this.maxCount = this.slides.length;
    this.slideClass = itemSelector;
    this.slideWidth = this.slides[0].offsetWidth;
    this.countSlidesPerView = options.slidesPerView || 1; //количество слайдов которые видно на странице
    this.countSlidesPerSwipe = options.countSlides || 1; // количество слайдов, сдвигаемых за раз
    this.loop = options.loop ? true : false;
    if (this.loop) {
      this.currentIndex = options.startIndex + this.countSlidesPerSwipe; // начальный индекс
    } else {
      this.currentIndex = options.startIndex;
    }
    this.buttonPrev = options.buttons.btnPrev || null; // селектор кнопки переключения на предыдущий слайд
    this.buttonNext = options.buttons.btnNext || null; // селектор кнопки переключения на следующий слайд
    this.pagination = this.countSlidesPerView == 1 && !this.loop && options.pagination || null; // селектор блока пагинации
    this.counter = options.counter && this.loop && document.querySelector(options.counter) || null;
    this.startX = 0; // Начальная позиция касания по оси X
    this.startY = 0; // Начальная позиция касания по оси Y
    this.interval = options.autoplay || false;
    this.isPlaying = false;
    this.isAnimating = false;
    this.init();
  }
  return _createClass(Slider, [{
    key: "init",
    value: function init() {
      var _this2 = this;
      this.slideContainer.style.width = this.slideWidth * this.countSlidesPerView + 'px';
      this.updateSliderPosition();
      var isEnaughSLides = this.slides.length % this.countSlidesPerSwipe;
      if (isEnaughSLides) {
        var difference = this.countSlidesPerSwipe - isEnaughSLides;
        for (var i = 1; i <= difference; i++) {
          var emptySlide = this.slides[0].cloneNode(false);
          this.sliderWrapper.appendChild(emptySlide);
        }
        this.slides = document.querySelectorAll(this.itemSelector);
      }
      if (this.loop) {
        this.cloneSlides();
      }
      if (!this.buttonPrev || !this.buttonNext) {
        throw new Error('Please add to options prev and next button selectors');
      } else {
        var prevBtn = document.querySelector(this.buttonPrev);
        var nextBtn = document.querySelector(this.buttonNext);
        if (this.loop) {
          prevBtn.addEventListener('click', function () {
            return _this2.loopSlide(-_this2.countSlidesPerSwipe);
          });
          nextBtn.addEventListener('click', function () {
            return _this2.loopSlide(_this2.countSlidesPerSwipe);
          });
        } else {
          prevBtn.addEventListener('click', function () {
            return _this2.limitSlide(-_this2.countSlidesPerSwipe);
          });
          nextBtn.addEventListener('click', function () {
            return _this2.limitSlide(_this2.countSlidesPerSwipe);
          });
          this.updateButtons();
        }
      }

      //проверка, поддерживается ли устройством собития касания
      var isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
      if (isTouchDevice) {
        // Обработка свайпов
        this.sliderWrapper.addEventListener('touchstart', this.touchStartHandler);
        this.sliderWrapper.addEventListener('touchend', this.touchEndHandler);
      }
      if (this.counter) {
        this.createCounter();
        this.updateCounter();
      }
      if (this.pagination) {
        this.createPagination();
        this.updatePagination();
      }
      if (this.interval) {
        this.autoPlaySlides();
      }
    }
  }, {
    key: "autoPlaySlides",
    value: function autoPlaySlides() {
      var _this3 = this;
      if (this.isPlaying) return; // Если уже в режиме автопроигрывания, выходим
      this.isPlaying = true; // Устанавливаем статус автопроигрывания в true

      if (this.loop) {
        this.timer = setInterval(function () {
          _this3.loopSlide(_this3.countSlidesPerSwipe);
        }, this.interval);
      } else {
        this.timer = setInterval(function () {
          if (_this3.currentIndex < _this3.slides.length - _this3.countSlidesPerSwipe) {
            _this3.limitSlide(_this3.countSlidesPerSwipe);
          } else {
            clearInterval(_this3.timer); // Остановить таймер
            _this3.isPlaying = false; // Останавливаем автопроигрывание
            _this3.currentIndex = 0;
            _this3.limitSlide(0);
            _this3.autoPlaySlides();
          }
        }, this.interval);
      }
    }
  }, {
    key: "cloneSlides",
    value: function cloneSlides() {
      var cloneCount = Math.min(this.slides.length, this.countSlidesPerSwipe);

      // Клонируем первые элементы
      for (var i = 0; i < cloneCount; i++) {
        var cloneEl = this.slides[i].cloneNode(true);
        this.sliderWrapper.appendChild(cloneEl);
      }

      // Клонируем последние элементы
      for (var _i = this.slides.length - 1; _i >= this.slides.length - this.countSlidesPerSwipe; _i--) {
        var _cloneEl = this.slides[_i].cloneNode(true);
        var currFirstEl = document.querySelector(this.slideClass);
        this.sliderWrapper.insertBefore(_cloneEl, currFirstEl);
      }
    }
  }, {
    key: "createCounter",
    value: function createCounter() {
      var watchedSlides = document.createElement('span');
      watchedSlides.classList.add('counter-watched');
      var totalCountSlides = document.createElement('span');
      totalCountSlides.classList.add('counter-total-count');
      this.counter.append(watchedSlides, totalCountSlides);
      totalCountSlides.textContent = " / ".concat(this.maxCount);
    }
  }, {
    key: "updateCounter",
    value: function updateCounter() {
      var watchedSlides = document.querySelector('.counter-watched');
      watchedSlides.textContent = this.currentIndex > this.maxCount ? this.maxCount : this.currentIndex;
    }
  }, {
    key: "loopSlide",
    value: function loopSlide(direction) {
      var _this4 = this;
      if (this.isAnimating) return;
      this.isAnimating = true;
      this.currentIndex += direction;
      this.sliderWrapper.style.transition = "transform 0.5s ease";
      this.updateSliderPosition();
      setTimeout(function () {
        if (_this4.currentIndex >= _this4.slides.length + _this4.countSlidesPerSwipe) {
          _this4.currentIndex = _this4.countSlidesPerSwipe;
          _this4.resetSliderPosition();
        } else if (_this4.currentIndex === 0) {
          _this4.currentIndex = _this4.slides.length;
          _this4.resetSliderPosition();
        }
        _this4.isAnimating = false;
        if (_this4.pagination) _this4.updatePagination();
        if (_this4.counter) _this4.updateCounter();
      }, 500);
    }
  }, {
    key: "limitSlide",
    value: function limitSlide(direction) {
      // document.querySelector(this.buttonPrev).removeAttribute('disabled'); 
      this.currentIndex += direction;
      this.sliderWrapper.style.transition = "transform 0.5s ease";
      this.updateSliderPosition();
      this.updateButtons();
      if (this.pagination) this.updatePagination();
    }
  }, {
    key: "updateButtons",
    value: function updateButtons() {
      var prevButton = document.querySelector(this.buttonPrev);
      var nextButton = document.querySelector(this.buttonNext);
      prevButton.disabled = this.currentIndex === 0;
      nextButton.disabled = this.currentIndex === this.slides.length - this.countSlidesPerSwipe;
    }
  }, {
    key: "updateSliderPosition",
    value: function updateSliderPosition() {
      this.sliderWrapper.style.transform = "translateX(".concat(-this.currentIndex * this.slideWidth, "px)");
    }
  }, {
    key: "resetSliderPosition",
    value: function resetSliderPosition() {
      this.sliderWrapper.style.transition = "none";
      this.updateSliderPosition();
    }
  }, {
    key: "createPagination",
    value: function createPagination() {
      var _this5 = this;
      var paginationContainer = document.querySelector(this.pagination);
      this.slides.forEach(function (_, index) {
        var dot = document.createElement('div');
        dot.classList.add('dot');
        dot.dataset.index = index;
        dot.addEventListener('click', function () {
          _this5.sliderWrapper.style.transition = "transform 0.5s ease";
          _this5.currentIndex = index;
          _this5.updateSliderPosition();
          _this5.updatePagination();
          _this5.updateButtons();
        });
        paginationContainer.appendChild(dot);
      });
    }
  }, {
    key: "updatePagination",
    value: function updatePagination() {
      var dots = document.querySelectorAll('.dot');
      dots.forEach(function (dot) {
        return dot.classList.remove('active');
      });
      dots[this.currentIndex].classList.add('active');
    }
  }]);
}(); // Инициализация слайдера
var sliderOptions = {
  startIndex: 0,
  // Начальный индекс 
  countSlides: 1,
  // Количество сдвигов за одно движение
  buttons: {
    btnPrev: '.stages__btn-prev',
    btnNext: '.stages__btn-next'
  },
  counter: '#slides-count',
  slidesPerView: 1,
  //количесвто видимых слайдов
  loop: false,
  pagination: '.stages__pagination'
  // autoplay: 2000,
  // gap: 20
};
console.log(window.matchMedia("(max-width: 768px)").matches);
if (window.matchMedia("(max-width: 768px)").matches) {
  var slider = new Slider('.stages__wrapper', '.stages__item-wrapper', sliderOptions);
} else {
  var playersSlider = new Slider('.players__wrapper', '.players__item', {
    startIndex: 0,
    // Начальный индекс 
    countSlides: 3,
    // Количество сдвигов за одно движение
    buttons: {
      btnPrev: '.playes__btn-prev',
      btnNext: '.playes__btn-next'
    },
    counter: '.playes__counter',
    slidesPerView: 3,
    //количесвто видимых слайдов
    loop: true
  });
}
//# sourceMappingURL=carousel.js.map
