class Marquee  {
    constructor (parentWrap, options) {
        this.marqueeWrap = parentWrap;
        this.marqueeItemsWrap = parentWrap.querySelector('.marquee-items-wrap');
        this.marqueeItems = parentWrap.querySelector('.marquee-items');
        this.marqueeItem = parentWrap.querySelector('.marquee-item');
        this.isReverce = options.reverce || false;
        this.mouseOverPause = options.mouseOverPause || false;
    } 


    init () {
        this.checkItemWidth();
        this.startAnimation();
    }  

    checkItemWidth () {
        const itemWidth = this.marqueeItem.clientWidth;
        const marqueeWrapWidth = this.marqueeWrap.clientWidth;
        const multiples = marqueeWrapWidth / itemWidth;

        if (multiples > 1) {
            const missItemsCount = Math.ceil(multiples);
            this.cloneItems(missItemsCount);
        } 

        this.cloneMarqueItems();
    }

    cloneItems(count) {

        for (let i = 1; i <= count; i++) {
            const clone = this.marqueeWrap.querySelector('.marquee-item').cloneNode(true);
            this.marqueeItems.append(clone);
        }

        

    }

    cloneMarqueItems() {
        const hiddenCloneItemsContainer = this.marqueeItems.cloneNode(true);
        hiddenCloneItemsContainer.setAttribute("aria-hidden", true);
        this.marqueeItemsWrap.appendChild(hiddenCloneItemsContainer);
    }

    startAnimation () {
        if (!this.checkWindowWidth() && this.mouseOverPause) this.marqueeItemsWrap.classList.add('marquee-pause-hover-effect');

        this.marqueeWrap.querySelectorAll('.marquee-items').forEach(el=> {
            el.classList.add('marquee');
        })

        if (this.isReverce) {
            this.reverceAnimation ();
        }
    }

    reverceAnimation () {
        this.marqueeWrap.querySelectorAll('.marquee-items').forEach(el=> {
            el.classList.add('reverce');
        })
    }

    checkWindowWidth () {
        return window.matchMedia("(max-width: 768px)").matches;
    }
}

const marqueContainer = document.querySelector('.marquee-wrap');
new Marquee(marqueContainer, {
    mouseOverPause:true
}).init();

const marqueContainerFooter = document.querySelector('.marquee-wrap-footer');
new Marquee(marqueContainerFooter, {
    mouseOverPause:true
}).init();



