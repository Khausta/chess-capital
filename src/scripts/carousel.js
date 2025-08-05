class Slider {
    constructor(wrapperSelector, itemSelector, options = {}) {
        this.animateElements = options.animateElements || null;
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
        this.pagination = (this.countSlidesPerView == 1 && !this.loop && options.pagination) || null; // селектор блока пагинации
        this.counter = options.counter && this.loop && document.querySelector(options.counter) || null;
        
        this.startX = 0; // Начальная позиция касания по оси X
        this.startY = 0; // Начальная позиция касания по оси Y
        this.interval = options.autoplay || false;
        this.isPlaying = false;
        this.isAnimating = false;

        this.init();
    }
    
    init() {

        this.slideContainer.style.width = 
        this.slideWidth * this.countSlidesPerView + 'px';
        this.updateSliderPosition();
        const isEnaughSLides = this.slides.length % this.countSlidesPerSwipe;
        
            if (isEnaughSLides) {
                 const difference = this.countSlidesPerSwipe - isEnaughSLides;
                for (let i = 1; i <= difference; i++) {
                    const emptySlide = this.slides[0].cloneNode(false);
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
            const prevBtn = document.querySelector(this.buttonPrev);
            const nextBtn = document.querySelector(this.buttonNext);
            if (this.loop) {
                prevBtn.addEventListener('click', 
                    () => this.loopSlide(-this.countSlidesPerSwipe));

                nextBtn.addEventListener('click', 
                    () => this.loopSlide(this.countSlidesPerSwipe));
            } else {
                prevBtn.addEventListener('click', 
                    () => this.limitSlide(-this.countSlidesPerSwipe));

                nextBtn.addEventListener('click', 
                    () => this.limitSlide(this.countSlidesPerSwipe));

                this.updateButtons();
            }
        }

        //проверка, поддерживается ли устройством собития касания
        const isTouchDevice = 'ontouchstart' in window || 
                      navigator.maxTouchPoints > 0 || 
                      navigator.msMaxTouchPoints > 0;

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


    touchStartHandler = (event) => {
        console.log('touch')
        this.startX = event.touches[0].clientX; // Сохраняем начальное значение X
        this.startY = event.touches[0].clientY; // Сохраняем начальное значение Y
    };

    touchEndHandler = (event) => {
        const endX = event.changedTouches[0].clientX; // Конечное значение X
        const endY = event.changedTouches[0].clientY; // Конечное значение Y

        const deltaX = this.startX - endX; // Разница по X
        const deltaY = this.startY - endY; // Разница по Y

        // Проверяем, что горизонтальное движение больше вертикального
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 30) {
            if (deltaX > 0) {
                // this.currentIndex += this.countSlidesPerSwipe;
                if (this.loop) {
                    this.loopSlide(this.countSlidesPerSwipe)
                } else {
                    if (this.currentIndex < this.slides.length - 1) {
                        this.limitSlide(this.countSlidesPerSwipe); 
                    }
                }
                
            } else {
                if (this.loop) {
                    this.loopSlide(-this.countSlidesPerSwipe)
                } else {
                    if (this.currentIndex !== 0) {
                        this.limitSlide(-this.countSlidesPerSwipe);
                    }
                }
            
            }
        }
    };

    autoPlaySlides() {
        if (this.isPlaying) return; // Если уже в режиме автопроигрывания, выходим
        this.isPlaying = true; // Устанавливаем статус автопроигрывания в true
        
        if (this.loop) {
            this.timer = setInterval(() => {
            
                this.loopSlide(this.countSlidesPerSwipe);
           
        }, this.interval);
        } else {
            this.timer = setInterval(() => {
            if (this.currentIndex < this.slides.length - this.countSlidesPerSwipe) {
                this.limitSlide(this.countSlidesPerSwipe);
            } else {
                clearInterval(this.timer); // Остановить таймер
                this.isPlaying = false; // Останавливаем автопроигрывание
                this.currentIndex = 0;
                this.limitSlide(0);
                this.autoPlaySlides();
            }
        }, this.interval);
        }
        
    }


    cloneSlides() {
        const cloneCount = Math.min(this.slides.length, this.countSlidesPerSwipe);
        
        // Клонируем первые элементы
        for (let i = 0; i < cloneCount; i++) {
            const cloneEl = this.slides[i].cloneNode(true);
            this.sliderWrapper.appendChild(cloneEl);
        }

        // Клонируем последние элементы
        for (let i = this.slides.length - 1; i >= this.slides.length - this.countSlidesPerSwipe; i--) {
            const cloneEl = this.slides[i].cloneNode(true);
            const currFirstEl = document.querySelector(this.slideClass);
            this.sliderWrapper.insertBefore(cloneEl, currFirstEl);
        }
    }

    createCounter() {
        const watchedSlides = document.createElement('span');
        watchedSlides.classList.add('counter-watched');
        const totalCountSlides = document.createElement('span');
        totalCountSlides.classList.add('counter-total-count');
        this.counter.append(watchedSlides, totalCountSlides);
        totalCountSlides.textContent = ` / ${this.maxCount}`;
    }

    updateCounter() {
        const watchedSlides = document.querySelector('.counter-watched');
        watchedSlides.textContent = this.currentIndex > this.maxCount ? this.maxCount : this.currentIndex;
    }

    loopSlide(direction) {
        if (this.isAnimating) return;
        this.isAnimating = true;

        this.currentIndex += direction;
        this.sliderWrapper.style.transition = "transform 0.5s ease";
        if (this.animateElements) this.animateElements();
        this.updateSliderPosition();

        setTimeout(() => {
            if (this.currentIndex >= this.slides.length + this.countSlidesPerSwipe) {
                this.currentIndex = this.countSlidesPerSwipe;
                this.resetSliderPosition();
            } else if (this.currentIndex === 0) {
                this.currentIndex = this.slides.length;
                this.resetSliderPosition();
            }
            this.isAnimating = false;
            if (this.pagination) this.updatePagination();
            if (this.counter) this.updateCounter();
        }, 500);

        
    }

    limitSlide(direction) {
       
        // document.querySelector(this.buttonPrev).removeAttribute('disabled'); 
        this.currentIndex += direction;
        this.sliderWrapper.style.transition = "transform 0.5s ease";
        if (this.animateElements) this.animateElements();
        this.updateSliderPosition();
        this.updateButtons();
        if (this.pagination) this.updatePagination();
    }

    updateButtons() {
        const prevButton = document.querySelector(this.buttonPrev);
        const nextButton = document.querySelector(this.buttonNext);
        prevButton.disabled = this.currentIndex === 0;
        nextButton.disabled = this.currentIndex === this.slides.length - this.countSlidesPerSwipe;
    }

    updateSliderPosition() {
        this.sliderWrapper.style.transform = `translateX(${-this.currentIndex * this.slideWidth}px)`;
    }

    resetSliderPosition() {
        this.sliderWrapper.style.transition = "none";
        this.updateSliderPosition();
    }

    createPagination() {
        const paginationContainer = document.querySelector(this.pagination);
        this.slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            dot.dataset.index = index;

            dot.addEventListener('click', () => {
                this.sliderWrapper.style.transition = "transform 0.5s ease";
                this.currentIndex = index;
                if (this.animateElements) this.animateElements();
                this.updateSliderPosition();
                this.updatePagination();
                this.updateButtons();
            });

            paginationContainer.appendChild(dot);
        });
    }

    updatePagination() {
        const dots = document.querySelectorAll('.dot');
        dots.forEach(dot => dot.classList.remove('active'));
        dots[this.currentIndex].classList.add('active');
    }
}

// Инициализация слайдера
const sliderOptions = {
    startIndex: 0,     // Начальный индекс 
    countSlides: 1,    // Количество сдвигов за одно движение
    buttons: {
        btnPrev: '.stages__btn-prev',
        btnNext: '.stages__btn-next',
    },
    counter: '#slides-count',
    slidesPerView: 1,  //количесвто видимых слайдов
    loop: false,
    pagination: '.stages__pagination',
    animateElements: () => {
        document.querySelector('.stages__img').classList.toggle('animate');
    }
    // gap: 20
};

if (window.matchMedia("(max-width: 768px)").matches) {
    
  const slider = new Slider('.stages__wrapper', '.stages__item-wrapper', sliderOptions);
   const playersSlider = new Slider('.players__wrapper', '.players__item', {
        startIndex: 0,     // Начальный индекс 
        countSlides: 1,    // Количество сдвигов за одно движение
        buttons: {
            btnPrev: '.playes__btn-prev',
            btnNext: '.playes__btn-next',
        },
        counter: '.playes__counter',
        slidesPerView: 1,  //количесвто видимых слайдов
        loop: true,
        autoplay: 4000,
        });
} else {
    const playersSlider = new Slider('.players__wrapper', '.players__item', {
        startIndex: 0,     // Начальный индекс 
        countSlides: 3,    // Количество сдвигов за одно движение
        buttons: {
            btnPrev: '.playes__btn-prev',
            btnNext: '.playes__btn-next',
        },
        counter: '.playes__counter',
        slidesPerView: 3,  //количесвто видимых слайдов
        loop: true,
        autoplay: 4000,
        });
}