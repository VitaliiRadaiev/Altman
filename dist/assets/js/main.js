// HTML data-da="where(uniq class name),when(breakpoint),position(digi)"
// e.x. data-da=".content__column-garden,992,2"
// https://github.com/FreelancerLifeStyle/dynamic_adapt

class DynamicAdapt {
    constructor(type) {
        this.type = type;
    }

    init() {
        this.оbjects = [];
        this.daClassname = '_dynamic_adapt_';
        this.nodes = [...document.querySelectorAll('[data-da]')];

        this.nodes.forEach((node) => {
            const data = node.dataset.da.trim();
            const dataArray = data.split(',');
            const оbject = {};
            оbject.element = node;
            оbject.parent = node.parentNode;
            оbject.destination = document.querySelector(`${dataArray[0].trim()}`);
            оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : '767';
            оbject.place = dataArray[2] ? dataArray[2].trim() : 'last';
            оbject.index = this.indexInParent(оbject.parent, оbject.element);
            this.оbjects.push(оbject);
        });

        this.arraySort(this.оbjects);

        this.mediaQueries = this.оbjects
            .map(({
                breakpoint
            }) => `(${this.type}-width: ${breakpoint}px),${breakpoint}`)
            .filter((item, index, self) => self.indexOf(item) === index);

        this.mediaQueries.forEach((media) => {
            const mediaSplit = media.split(',');
            const matchMedia = window.matchMedia(mediaSplit[0]);
            const mediaBreakpoint = mediaSplit[1];

            const оbjectsFilter = this.оbjects.filter(
                ({
                    breakpoint
                }) => breakpoint === mediaBreakpoint
            );
            matchMedia.addEventListener('change', () => {
                this.mediaHandler(matchMedia, оbjectsFilter);
            });
            this.mediaHandler(matchMedia, оbjectsFilter);
        });
    }

    mediaHandler(matchMedia, оbjects) {
        if (matchMedia.matches) {
            оbjects.forEach((оbject) => {
                оbject.index = this.indexInParent(оbject.parent, оbject.element);
                this.moveTo(оbject.place, оbject.element, оbject.destination);
            });
        } else {
            оbjects.forEach(
                ({ parent, element, index }) => {
                    if (element.classList.contains(this.daClassname)) {
                        this.moveBack(parent, element, index);
                    }
                }
            );
        }
    }

    moveTo(place, element, destination) {
        element.classList.add(this.daClassname);
        if (place === 'last' || place >= destination.children.length) {
            destination.append(element);
            return;
        }
        if (place === 'first') {
            destination.prepend(element);
            return;
        }
        destination.children[place].before(element);
    }

    moveBack(parent, element, index) {
        element.classList.remove(this.daClassname);
        if (parent.children[index] !== undefined) {
            parent.children[index].before(element);
        } else {
            parent.append(element);
        }
    }

    indexInParent(parent, element) {
        return [...parent.children].indexOf(element);
    }

    arraySort(arr) {
        if (this.type === 'min') {
            arr.sort((a, b) => {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) {
                        return 0;
                    }
                    if (a.place === 'first' || b.place === 'last') {
                        return -1;
                    }
                    if (a.place === 'last' || b.place === 'first') {
                        return 1;
                    }
                    return a.place - b.place;
                }
                return a.breakpoint - b.breakpoint;
            });
        } else {
            arr.sort((a, b) => {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) {
                        return 0;
                    }
                    if (a.place === 'first' || b.place === 'last') {
                        return 1;
                    }
                    if (a.place === 'last' || b.place === 'first') {
                        return -1;
                    }
                    return b.place - a.place;
                }
                return b.breakpoint - a.breakpoint;
            });
            return;
        }
    }
}

function slideUp(target, duration = 500) {
    target.style.transitionProperty = 'height, margin, padding';
    target.style.transitionDuration = duration + 'ms';
    target.style.height = target.offsetHeight + 'px';
    target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout(() => {
        target.style.display = 'none';
        target.style.removeProperty('height');
        target.style.removeProperty('padding-top');
        target.style.removeProperty('padding-bottom');
        target.style.removeProperty('margin-top');
        target.style.removeProperty('margin-bottom');
        target.style.removeProperty('overflow');
        target.style.removeProperty('transition-duration');
        target.style.removeProperty('transition-property');
        target?.classList.remove('_slide');
    }, duration);
}
function slideDown(target, duration = 500) {
    target.style.removeProperty('display');
    let display = window.getComputedStyle(target).display;
    if (display === 'none')
        display = 'block';

    target.style.display = display;
    let height = target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + 'ms';
    target.style.height = height + 'px';
    target.style.removeProperty('padding-top');
    target.style.removeProperty('padding-bottom');
    target.style.removeProperty('margin-top');
    target.style.removeProperty('margin-bottom');
    window.setTimeout(() => {
        target.style.removeProperty('height');
        target.style.removeProperty('overflow');
        target.style.removeProperty('transition-duration');
        target.style.removeProperty('transition-property');
        target?.classList.remove('_slide');
    }, duration);
}
function slideToggle(target, duration = 500) {
    if (!target?.classList.contains('_slide')) {
        target?.classList.add('_slide');
        if (window.getComputedStyle(target).display === 'none') {
            return this.slideDown(target, duration);
        } else {
            return this.slideUp(target, duration);
        }
    }
}
function isSafari() {
    let isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    return isSafari;
}
function Android() {
    return navigator.userAgent.match(/Android/i);
}
function BlackBerry() {
    return navigator.userAgent.match(/BlackBerry/i);
}
function iOS() {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
}
function Opera() {
    return navigator.userAgent.match(/Opera Mini/i);
}
function Windows() {
    return navigator.userAgent.match(/IEMobile/i);
}
function isMobile() {
    return (Android() || BlackBerry() || iOS() || Opera() || Windows());
}
function replaceImageToInlineSvg(query) {
    const images = document.querySelectorAll(query);

    if (images.length) {
        images.forEach(img => {
            img?.classList.remove('img-svg');
            let xhr = new XMLHttpRequest();
            const src = img.getAttribute('data-src') || img.src;
            xhr.open('GET', src);
            xhr.onload = () => {
                if (xhr.readyState === xhr.DONE) {
                    if (xhr.status === 200) {
                        let svg = xhr.responseXML.documentElement;
                        svg?.classList.add('_svg', ...Array.from(img.classList));
                        img.parentNode.replaceChild(svg, img);
                    }
                }
            }
            xhr.send(null);
        })
    }
}

function initInputMask(maskPlugin) {
    const initMask = (item) => {
        if (item.classList.contains('_initialized')) return;

        maskPlugin.addObserver(item, () => {
            if (item.classList.contains('_mask-added')) return;

            let maskValue = item.getAttribute('data-mask');
            const input = item.querySelector('input[type="text"]');
    
            if (!input) return;
    
            Inputmask(maskValue, {
                showMaskOnHover: false,
                showMaskOnFocus: true,
                oncomplete: () => {
                    const event = new Event('phonecomplete', { bubbles: true });
                    item.dispatchEvent(event);
                },
                oncleared: () => {
                    const event = new Event('phonecleare', { bubbles: true });
                    item.dispatchEvent(event);
                }
            }).mask(input);

            
            item.classList.add('_mask-added');
        });


        item.classList.add('_initialized');
    }

    const initMaskRegExp = (item) => {
        if (item.classList.contains('_initialized')) return;

        maskPlugin.addObserver(item, () => {
            if (item.classList.contains('_mask-added')) return;

            let maskValue = item.getAttribute('data-mask-reg-exp');

            const input = item.querySelector('input[type="text"]');

            if (!input) return;

            Inputmask({
                regex: maskValue,
                showMaskOnHover: false,
                showMaskOnFocus: true,
                placeholder: '',
                oncomplete: () => {
                    const event = new Event('phonecomplete', { bubbles: true });
                    item.dispatchEvent(event);
                },
                oncleared: () => {
                    const event = new Event('phonecleare', { bubbles: true });
                    item.dispatchEvent(event);
                }
            }).mask(input);

            item.classList.add('_mask-added');
        });

        item.classList.add('_initialized');
    }

    document.addEventListener('pointerdown', (e) => {
        if (e.target.closest('[data-mask]')) {
            const item = e.target.closest('[data-mask]');
            initMask(item);
        }
        if (e.target.closest('[data-mask-reg-exp]')) {
            const item = e.target.closest('[data-mask-reg-exp]');
            initMaskRegExp(item);
        }
    });

    let items = document.querySelectorAll('[data-mask]');
    if (items.length) {
        items.forEach(item => initMask(item));
    }

    {
        let items = document.querySelectorAll('[data-mask-reg-exp]');
        if (items.length) {
            items.forEach(item => initMaskRegExp(item))
        }
    }
}

function toggleDisablePageScroll(state) {
    if (state) {
        const offsetValue = getScrollbarWidth();
        document.documentElement?.classList.add('overflow-hidden');
        document.body?.classList.add('overflow-hidden');
        document.documentElement.style.paddingRight = offsetValue + 'px';
    } else {
        document.documentElement?.classList.remove('overflow-hidden');
        document.body?.classList.remove('overflow-hidden');
        document.documentElement.style.removeProperty('padding-right');
    }
}

function initTooltip(tippyPlugin) {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(el => {
        tippyPlugin.addObserver(el, () => { });
    })

    tippyPlugin.onLoad(() => {
        if (!isMobile()) {
            document.addEventListener('mousemove', (e) => {
                if (e.target.closest('[data-tooltip]')) {
                    const el = e.target.closest('[data-tooltip]');
                    if (el?.classList.contains('tooltip-active')) return;

                    el?.classList.add('tooltip-active');
                    const instance = tippy(el, {
                        placement: el.getAttribute('data-tooltip-placement') || 'top',
                        content: el.getAttribute('data-tooltip')
                    });
                    instance.show();

                    const destroyTippy = () => {
                        el?.classList.remove('tooltip-active');
                        instance.destroy();
                        el.removeEventListener('mouseleave', destroyTippy);
                    }

                    el.addEventListener('mouseleave', destroyTippy)
                }
            })
        } else {
            document.addEventListener('click', (e) => {
                if (e.target.closest('[data-tooltip]')) {
                    const el = e.target.closest('[data-tooltip]');

                    if (!el.hasAttribute('data-tooltip-mobile')) return;

                    if (el?.classList.contains('tooltip-active')) return;

                    el?.classList.add('tooltip-active');
                    const instance = tippy(el, {
                        placement: el.getAttribute('data-tooltip-placement') || 'top',
                        content: el.getAttribute('data-tooltip')
                    });
                    instance.show();
                }
            })
        }
    })
}
function getScrollbarWidth() {
    const lockPaddingValue = window.innerWidth - document.querySelector('body').offsetWidth;

    return lockPaddingValue;
}
function compensateWidthOfScrollbar(isAddPadding) {

    if (isAddPadding) {
        const scrollbarWidth = getScrollbarWidth();
        document.documentElement.style.paddingRight = scrollbarWidth + 'px';
    } else {
        document.documentElement.style.paddingRight = '0px';
    }
}

function initDisablePageScroll() {
    const selectors = new Set();

    return {
        add: (selector) => {
            selectors.add(selector);
        },
        remove: (selector) => {
            selectors.delete(selector);
        },
        contains: (selector) => {
            return selectors.has(selector);
        },
        getAll: () => {
            return selectors.values();
        }
    }
}
const skipEventBySelectors = initDisablePageScroll();

function checkSkipSelectors(e) {
    return Array.from(skipEventBySelectors.getAll()).some(selector => e.target.closest(selector))
}

function initCopyLink() {
    const copyElements = document.querySelectorAll('[data-copy-link]');
    copyElements.forEach(copyEl => {
        copyEl.addEventListener('click', (e) => {
            e.preventDefault();
            if (!copyEl.href) return;
            navigator.clipboard.writeText(copyEl.href);
            copyEl?.classList.add('copied');

            setTimeout(() => {
                copyEl?.classList.remove('copied');
            }, 1000)
        })
    })
}

function createScrollContainer(htmlEl) {
    const wrapper = document.createElement('div');
    const slide = document.createElement('div');
    const scrollbar = document.createElement('div');

    wrapper.className = 'swiper-wrapper';
    slide.className = 'swiper-slide';
    scrollbar.className = 'swiper-scrollbar';

    htmlEl?.classList.add('swiper');

    slide.append(...htmlEl.children);
    wrapper.append(slide);
    htmlEl.append(wrapper, scrollbar);

    const swiper = new Swiper(htmlEl, {
        observe: true,
        observeParents: true,
        direction: "vertical",
        slidesPerView: "auto",
        freeMode: true,
        scrollbar: {
            el: scrollbar,
        },
        mousewheel: true,
    });

    htmlEl.swiper = swiper;

    return swiper;
}

function initScrollContainers() {
    const containers = document.querySelectorAll('[data-scroll-container]');
    containers.forEach(container => {
        const mode = container.getAttribute('data-scroll-container');
        if (window.innerWidth < 1024 && mode === 'desk') return;
        createScrollContainer(container);
    })
}

function initToggleClassesByClick() {
    document.addEventListener('click', (e) => {
        if (e.target.closest('[data-remove-classes-by-click]')) {
            const actionEl = e.target.closest('[data-remove-classes-by-click]');

            let targetSelectors = actionEl.getAttribute('data-remove-classes-target').split(',').map(c => c.trim());
            const classes = actionEl.getAttribute('data-remove-classes-by-click').split(',').map(c => c.trim());

            if (/_self/.test(targetSelectors)) {
                targetSelectors = targetSelectors.filter(c => c !== '_self');
                actionEl?.classList.remove(...classes);
            };

            if (!targetSelectors.length) return;
            const targetElements = document.querySelectorAll(targetSelectors);
            targetElements.forEach(targetEl => {
                targetEl?.classList.remove(...classes);
            })
        }

        if (e.target.closest('[data-add-classes-by-click]')) {
            const actionEl = e.target.closest('[data-add-classes-by-click]');

            let targetSelectors = actionEl.getAttribute('data-add-classes-target').split(',').map(c => c.trim());
            const classes = actionEl.getAttribute('data-add-classes-by-click').split(',').map(c => c.trim());

            if (/_self/.test(targetSelectors)) {
                targetSelectors = targetSelectors.filter(c => c !== '_self');
                actionEl?.classList.add(...classes);
            };

            if (!targetSelectors.length) return;
            const targetElements = document.querySelectorAll(targetSelectors);
            targetElements.forEach(targetEl => {
                targetEl?.classList.add(...classes);
            })
        }
    })
}

function initSmoothScrollByAnchors() {
    let anchors = document.querySelectorAll('a[href^="#"]:not([data-action="open-popup"]):not([data-action="page-reload"])');
    if (anchors.length) {
        let header = document.querySelector('[data-header]');
        anchors.forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href')
                const id = href.length > 1 ? href : null;
                if (!id) return;
                let el = document.querySelector(href);

                if (el) {
                    e.preventDefault();
                    let top = Math.abs(document.body.getBoundingClientRect().top) + el.getBoundingClientRect().top;

                    if (header) {
                        top = top - header.clientHeight;
                    }

                    window.scrollTo({
                        top: top - 20,
                        behavior: 'smooth',
                    })
                }
            })

        })
    }
}

function initAnchorsLinkOffset() {
    let header = document.querySelector('[data-header]');
    const hash = window.location.hash;
    if (hash) {
        const element = document.querySelector(hash);
        if (element) {
            let top = Math.abs(document.body.getBoundingClientRect().top) + element.getBoundingClientRect().top;

            if (header) {
                top = top - header.clientHeight;
            }

            setTimeout(() => {
                window.scrollTo({
                    top: top - 20,
                    behavior: 'smooth',
                })
            }, 0);
        }
    }
}

function buildThresholdList() {
    const array = [];
    for (let i = 1; i <= 100; i++) {
        array.push(i / 100);
    }
    return array;
}

function initHideWhenOverFooter() {
    const footer = document.querySelector('.footer');
    const elements = document.querySelectorAll('[data-hide-when-over-footer]');
    if (!elements.length) return;

    const options = {
        root: null,
        rootMargin: "0px",
        threshold: 0.01,
    };
    const callback = function (entries) {
        if (entries[0].isIntersecting) {
            elements.forEach(el => el?.classList.add('!hidden'));
        } else {
            elements.forEach(el => el?.classList.remove('!hidden'));
        }
    };
    const observer = new IntersectionObserver(callback, options);
    observer.observe(footer);
}

function initHideWhenOverElements() {
    const elements = document.querySelectorAll('[data-hide-when-over-elements]');
    if (!elements.length) return;

    elements.forEach(el => {
        const targetSelectors = el.getAttribute('data-hide-when-over-elements').split(',').map(c => c.trim());
        const overStates = [];

        targetSelectors.forEach((selector, i) => {
            const observeEl = document.querySelector(selector);
            if (!observeEl) return;

            const options = {
                root: null,
                rootMargin: "0px",
                threshold: 0.01,
            };
            const callback = function (entries) {
                overStates[i] = entries[0].isIntersecting;

                const isOver = overStates.some(state => state);
                if (isOver) {
                    el?.classList.add('!hidden');
                } else {
                    el?.classList.remove('!hidden');
                }
            };
            const observer = new IntersectionObserver(callback, options);
            observer.observe(observeEl);
        })
        //const observedElements = 
    })
}

function initFancybox(fancyboxPlugin) {
    const fancyboxElements = document.querySelectorAll('[data-fancybox]');
    fancyboxElements.forEach(el => {
        fancyboxPlugin.addObserver(el, () => { })
    })
}

function initToggleClassByMatchReqExp() {
    document.addEventListener('click', (e) => {
        if(e.target.closest('[data-action="toggle-class-by-match-req-exp"]')) {
            const el = e.target.closest('[data-action="toggle-class-by-match-req-exp"]');
            if(el.classList.contains('_initialized')) return;

            const input = el.querySelector('input[type="text"], input[type="email"]');
            if (!input) return;
    
            const classes = el.getAttribute('data-classes').split(',').map(c => c.trim());
    
            let regExp;
            if (el.getAttribute('data-reg-exp') === 'email') {
                regExp = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i
            } else {
                regExp = new RegExp(el.getAttribute('data-reg-exp'), 'i');
            }
    
            let targetSelectors = el.getAttribute('data-target').split(',').map(c => c.trim());
            let targetElements = [];
    
            if (!targetSelectors.length) return;
    
            if (/_self/.test(targetSelectors)) {
                targetSelectors = targetSelectors.filter(c => c !== '_self');
                targetElements.push(el);
            };
    
            targetElements.push(...document.querySelectorAll(targetSelectors));
    
            input.addEventListener('input', (e) => {
                if (regExp.test(e.target.value)) {
                    targetElements.forEach(targetEl => {
                        targetEl?.classList.remove(...classes);
                    })
                } else {
                    targetElements.forEach(targetEl => {
                        targetEl?.classList.add(...classes);
                    })
                }
            })

            el.classList.add('_initialized');
        }
    });
}

function initAddClassByChangeEvent() {
    const elements = document.querySelectorAll('[data-action="add-classes-by-change-event"]');
    elements.forEach(el => {
        const input = el.querySelector('input[type="radio"]', 'input[type="checkbox"]');
        if (!input) return;

        const classes = el.getAttribute('data-classes').split(',').map(c => c.trim());
        let targetSelectors = el.getAttribute('data-target').split(',').map(c => c.trim());

        let targetElements = [];

        if (!targetSelectors.length) return;

        if (/_self/.test(targetSelectors)) {
            targetSelectors = targetSelectors.filter(c => c !== '_self');
            targetElements.push(el);
        };

        targetElements.push(...document.querySelectorAll(targetSelectors));

        input.addEventListener('change', (e) => {
            if (e.target.checked) {
                targetElements.forEach(targetEl => {
                    targetEl?.classList.add(...classes);
                })
            }
        })
    })
}
function initRemoveClassByChangeEvent() {
    const elements = document.querySelectorAll('[data-action="remove-classes-by-change-event"]');
    elements.forEach(el => {
        const input = el.querySelector('input[type="radio"]', 'input[type="checkbox"]');
        if (!input) return;

        const classes = el.getAttribute('data-classes').split(',').map(c => c.trim());
        let targetSelectors = el.getAttribute('data-target').split(',').map(c => c.trim());

        let targetElements = [];

        if (!targetSelectors.length) return;

        if (/_self/.test(targetSelectors)) {
            targetSelectors = targetSelectors.filter(c => c !== '_self');
            targetElements.push(el);
        };

        targetElements.push(...document.querySelectorAll(targetSelectors));

        input.addEventListener('change', (e) => {
            if (e.target.checked) {
                targetElements.forEach(targetEl => {
                    targetEl?.classList.remove(...classes);
                })
            }
        })
    })
}

function initRemoveClassByOption() {
    const elements = document.querySelectorAll('[data-action="remove-class-by-option"]');
    elements.forEach(el => {
        const select = el.tagName === 'SELECT' ? el : null;
        if (!select) return;

        const classes = el.getAttribute('data-classes').split(',').map(c => c.trim());
        let targetSelectors = el.getAttribute('data-target').split(',').map(c => c.trim());

        let targetElements = [];

        if (!targetSelectors.length) return;

        if (/_self/.test(targetSelectors)) {
            targetSelectors = targetSelectors.filter(c => c !== '_self');
            targetElements.push(el);
        };

        targetElements.push(...document.querySelectorAll(targetSelectors));

        select.addEventListener('change', (e) => {
            const optionValue = select.getAttribute('data-option-value') || select.closest('[data-option-value]')?.getAttribute('data-option-value');
            if (!optionValue) return;

            if (e.target.value === optionValue) {
                targetElements.forEach(targetEl => {
                    targetEl?.classList.remove(...classes);
                })
            } else {
                targetElements.forEach(targetEl => {
                    targetEl?.classList.add(...classes);
                })
            }
        })
    })
}

function initSelectTabsTrigger() {
    const elements = document.querySelectorAll('[data-select-tabs-trigger]');
    elements.forEach(element => {
        if (element.tagName === 'SELECT') {
            const options = Array.from(element.options);
            options.map(option => {
                let targetSelector = option.getAttribute('data-target');

                if (!targetSelector) option.targetElement = null;

                const targetEl = document.querySelector(targetSelector);

                if (!targetEl) option.targetElement = null;

                option.targetElement = targetEl;
            });

            element.addEventListener('change', (e) => {
                const selectedIndex = e.target.options.selectedIndex;
                options.forEach((option, index) => {
                    if (index == selectedIndex) {
                        option.targetElement?.classList.add('active');
                    } else {
                        option.targetElement?.classList.remove('active');
                    }
                })
            })
        }
    });
}

function initToggleCollapse() {
    document.addEventListener('click', (e) => {
        if (e.target.closest('[data-toggle-collapse]')) {
            e.preventDefault();
            const el = e.target.closest('[data-toggle-collapse]');

            const selector = el.getAttribute('data-toggle-collapse').trim();
            let targetEl;
            if (/next-element-sibling/.test(selector)) {
                targetEl = el.nextElementSibling;
            } else {
                targetEl = document.querySelector(selector);
            }
            if (!targetEl) return;

            if (el?.classList.contains('active')) {
                el?.classList.remove('active');
                slideUp(targetEl, 300);
            } else {
                el?.classList.add('active');
                slideDown(targetEl, 300);
            }
        }
    })
}

function initTruncateText() {
    const truncateString = (el, stringLength = 0) => {
        let str = el.innerText.trim();
        if (str.length <= stringLength) return;
        el.innerText = str.slice(0, stringLength) + '...';
    }

    const truncateTextBoxes = document.querySelectorAll('[data-truncate-text]');
    truncateTextBoxes.forEach(truncateTextBox => {
        truncateString(truncateTextBox, +truncateTextBox.getAttribute('data-truncate-text'))
    })
}

function initTabs() {
    const tabsContainers = document.querySelectorAll('[data-tabs]');
    if (tabsContainers.length) {
        tabsContainers.forEach(tabsContainer => {
            let triggerItems = Array.from(tabsContainer.querySelectorAll('[data-tab-trigger]'));
            let contentItems = Array.from(tabsContainer.querySelectorAll('[data-tab-content]'));

            if (!(tabsContainer.getAttribute('data-tabs') === 'nested')) {
                triggerItems = triggerItems.filter(item => !item.closest('[data-tabs="nested"]'));
                contentItems = contentItems.filter(item => !item.closest('[data-tabs="nested"]'));
            }

            const getContentItem = (id) => {
                if (!id.trim()) return;
                return contentItems.filter(item => item.dataset.tabContent === id)[0];
            }

            if (triggerItems.length && contentItems.length) {
                // init
                let activeItem = tabsContainer.querySelector('.tab-active[data-tab-trigger]');
                if (activeItem) {
                    activeItem?.classList.add('tab-active');
                    getContentItem(activeItem.dataset.tabTrigger)?.classList.add('tab-active');
                } else {
                    if (!(tabsContainer.getAttribute('data-tabs') === 'no-start-active')) {
                        triggerItems[0]?.classList.add('tab-active');
                        getContentItem(triggerItems[0].dataset.tabTrigger)?.classList.add('tab-active');
                    }
                }

                triggerItems.forEach(item => {
                    item.addEventListener('click', (e) => {
                        e.preventDefault();
                        item?.classList.add('tab-active');
                        getContentItem(item.dataset.tabTrigger)?.classList.add('tab-active');

                        triggerItems.forEach(i => {
                            if (i === item) return;

                            i?.classList.remove('tab-active');
                            getContentItem(i.dataset.tabTrigger)?.classList.remove('tab-active');
                        })
                    })
                })
            }

        })
    }
}

function initMultipleLanguageTabs() {
    const multipleLanguageContainers = document.querySelectorAll('[data-multiple-language]');
    multipleLanguageContainers.forEach(multipleLanguageContainer => {
        const triggers = multipleLanguageContainer.querySelectorAll('[data-language-trigger]');
        const contentContainers = Array.from(multipleLanguageContainer.querySelectorAll('[data-language-content]'));

        const getContentItem = (id) => {
            if (!id.trim()) return;
            return contentContainers.find(item => item.getAttribute('data-language-content') === id);
        }

        if (triggers.length && contentContainers.length) {
            const activeTrigger = multipleLanguageContainer.querySelector('[data-language-trigger].active')

            if (activeTrigger) {
                const content = getContentItem(activeTrigger.getAttribute('data-language-trigger'));
                content && content?.classList.add('active');
            } else {
                triggers[0]?.classList.add('active');
                contentContainers[0]?.classList.add('active');
            }

            triggers.forEach(trigger => {
                const content = getContentItem(trigger.getAttribute('data-language-trigger'));

                trigger.addEventListener('click', (e) => {
                    e.preventDefault();
                    trigger?.classList.add('active');
                    triggers.forEach(t => {
                        if (t === trigger) return;
                        t?.classList.remove('active');
                    })

                    content && content?.classList.add('active');
                    contentContainers.forEach(c => {
                        if (c === content) return;
                        c?.classList.remove('active');
                    })
                })
            })

        }
    })
}

function initScrollTopByClick() {
    const elements = document.querySelectorAll('[data-action="scroll-top-by-click"]');
    elements.forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                // behavior: 'smooth',
            })
        })
    })
}

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function initProgressScrollLine() {
    const el = document.querySelector('[data-progress-scroll-line]');
    if (el) {
        const header = document.querySelector('[data-header]');
        if (!header) return;
        header.insertAdjacentHTML('beforeend', `
            <div class="line h-[3px] bg-purple---super-light-0">
                <div style="transform: scaleX(0); transform-origin: right;" data-progress-line class=" bg-purple---main-0 h-full transition-transform"></div>
            </div>
        `);
        const line = header.querySelector('[data-progress-line]');
        const handler = throttle(() => {
            let scrollTop = (window.scrollY || document.documentElement.scrollTop) + header.clientHeight;
            let elementOffsetTop = el.offsetTop;
            let elementHeight = el.scrollHeight;

            let progress = (scrollTop - elementOffsetTop) / (elementHeight - window.innerHeight);
            progress = Math.min(Math.max(progress, 0), 1);
            line.style.setProperty('transform', `scaleX(${progress})`);
        }, 100);

        window.addEventListener('scroll', () => {
            handler();
        });
    }
}

class LazyLoadScript {
    constructor(src) {
        this.src = src
        this.isScriptLoaded = false;
        this.callbackList = [];
        this.observer = this._createIntersectionObserver();
        this.onLoadSubscription = [];
    }

    async _loadScript() {
        if (this.isScriptLoaded) {
            return true;
        } else {
            return new Promise((res, rej) => {
                const script = document.createElement('script');
                script.src = this.src;
                script.onload = () => {
                    this.isScriptLoaded = true;
                    res(true);
                }
                script.onerror = () => {
                    res(false);
                }
                document.body.append(script);
            })
        }
    }

    _createIntersectionObserver() {
        let options = {
            root: null,
            rootMargin: "0px 0px 50% 0px",
            threshold: [0.01],
        };

        const observer = new IntersectionObserver(async (entries) => {
            for (let index = 0; index < entries.length; index++) {
                const entry = entries[index];
                if (entry.isIntersecting) {
                    const isScriptLoaded = await this._loadScript();

                    if (isScriptLoaded) {
                        this.onLoadSubscription.forEach(fn => fn());
                        this.callbackList.forEach(fn => fn())
                    }

                    observer.disconnect();
                    break;
                }
            }
        }, options);

        return observer;
    }

    async addObserver(htmlEl, callback) {
        this.callbackList.push(callback);
        this.observer.observe(htmlEl);
        return this.observer;
    }

    onLoad(callback) {
        this.onLoadSubscription.push(callback);
    }

    async loadForce() {
        const isScriptLoaded = await this._loadScript();

        if (isScriptLoaded) {
            this.onLoadSubscription.forEach(fn => fn());
        }
    }
}



//form fields validation

if (!window.errorMessages) {
    window.errorMessages = {
        en: {
            required: 'This field is required.',
            phone: 'Please enter a valid phone number.',
            mask: 'Please enter a valid number.',
            email: 'Please enter a valid email address.',
            password: 'Password must be at least 8 characters long.',
            confirmPassword: 'Passwords do not match.'
        },
        he: {
            required: 'שדה זה הינו חובה.',
            phone: 'נא להזין מספר טלפון תקין.',
            mask: 'נא הכנס מספר תקף.',
            email: 'נא להזין כתובת דוא"ל תקינה.',
            password: 'הסיסמה חייבת להיות לפחות 8 תווים.',
            confirmPassword: 'הסיסמאות אינן תואמות.'
        }
    }
}

function isElementVisible(el) {
    while (el) {
        if (window.getComputedStyle(el).display === 'none') {
            return false;
        }
        el = el.parentElement;
    }
    return true;
}

function resetPasswordGroupHandler(container) {

    const resetPasswordGroup = container.querySelector('[data-reset-password-group]');
    if(!resetPasswordGroup) return true;

    const prevPasswordInput = resetPasswordGroup.querySelector('[data-prev-password]');
    const newPasswordInput = resetPasswordGroup.querySelector('[data-new-password]');
    const confirmNewPasswordInput = resetPasswordGroup.querySelector('[data-confirm-new-password]');

    if(!prevPasswordInput && !newPasswordInput && !confirmNewPasswordInput) return true;

    if(!prevPasswordInput.value.length && !newPasswordInput.value.length && !confirmNewPasswordInput.value.length) return true;

    const validateResults = [];

    if(prevPasswordInput.value.length >= 8) {
        validateResults.push(true);
    } else {
        setErrors(
            {
                groupId: null,
                elements: [prevPasswordInput]
            },
            window.errorMessages['he']['password']
        );
        validateResults.push(false);
    }

    if(newPasswordInput.value.length >= 8) {
        validateResults.push(true);
    } else {
        setErrors(
            {
                groupId: null,
                elements: [newPasswordInput]
            },
            window.errorMessages['he']['password']
        );
        validateResults.push(false);
    }

    if(confirmNewPasswordInput.value === newPasswordInput.value) {
        validateResults.push(true);
    } else {
        setErrors(
            {
                groupId: null,
                elements: [confirmNewPasswordInput]
            },
            window.errorMessages['he']['confirmPassword']
        );
        validateResults.push(false);
    }

    return validateResults.every(r => r);
}

const middlewares = [
    resetPasswordGroupHandler
]

function checkValidation(screen) {
    if (!screen) return true;

    const validationElements = Array.from(screen.querySelectorAll('[data-validation]'))
        .filter(el => el.getAttribute('data-validation'))
        .filter(el => isElementVisible(el.parentElement));
    if (!validationElements.length && !middlewares.length) return true;

    const groups = createGroups(validationElements);

    const validateResults = [];

    groups.forEach(group => {

        const result = validate(group);
        if (result) {
            validateResults.push(result);
        } else {
            setErrors(group);
            validateResults.push(result);
        }
    })

    middlewares.forEach(middleware => validateResults.push(middleware(screen)))

    return validateResults.every(r => r);
}

function createGroups(elements) {
    let arr = [];
    elements.forEach(el => {
        const groupId = el.getAttribute('data-group');

        if (groupId) {
            const group = arr.find(g => g.groupId === groupId);

            if (group) {
                group.elements.push(el);
            } else {
                arr.push({
                    groupId: groupId,
                    elements: [el]
                })
            }

        } else {
            arr.push({
                groupId: null,
                elements: [el]
            })
        }
    });

    return arr;
}

const validationMethods = {
    ['text']: {
        ['required']: (input) => {
            return Boolean(input.value.trim().length);
        },
        ['mask']: (input) => {
            if (input.inputmask) {
                return input.inputmask.isComplete();
            }

            return false;
        },
        ['phone']: (input) => {
            if (input.inputmask) {
                return input.inputmask.isComplete();
            }

            return false;
        },
        ['email']: (input) => {
            const regExp = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i
            return regExp.test(input.value);
        },

        ['password']: (input) => {
            return Boolean(input.value.length >= 8);
        },
        ['confirmPassword']: (input) => {
            const form = input.closest('form');
            if (!form) return true;

            const inputPassword = form.querySelector('input[data-validation="password"]');
            if (!inputPassword) return true;

            return inputPassword.value === input.value;
        },
    },
    ['checkbox-radio']: {
        ['required']: (input) => {
            return input.checked
        }
    },
    ['select']: {
        ['required']: (select) => {
            return Boolean(select.value.trim().length);
        }
    },
    ['file']: {
        ['required']: (input) => {
            return Boolean(input.files.length);
        },
    }
}

function validate(group) {
    const validateResults = [];

    const getElementsType = (el) => {
        const type = el.type;

        switch (type) {
            case 'text':
                return 'text';

            case 'email':
                return 'text';

            case 'hidden':
                return 'text';

            case 'textarea':
                return 'text';

            case 'checkbox':
                return 'checkbox-radio';

            case 'radio':
                return 'checkbox-radio';

            case 'file':
                return 'file';

            case 'password':
                return 'text';
        }

        if (el.nodeName === 'SELECT') {
            return 'select';
        }

        return null;
    }

    group.elements.forEach(el => {
        const elType = getElementsType(el);
        const validateType = el.getAttribute('data-validation');
        elType && validateResults.push(validationMethods[elType][validateType](el));
    })

    return validateResults.some(r => r);
}

function getValidationType(input) {
    switch (input.getAttribute('data-validation')) {
        case 'required':
            return 'required';
        case 'mask':
            return 'mask';
        case 'phone':
            return 'phone';
        case 'email':
            return 'email';
        case 'password':
            return 'password';
        case 'confirmPassword':
            return 'confirmPassword';
        default:
            return 'required';
    }
}

function setErrors({ elements }, errorMessage = null) {
    elements.forEach(el => {
        el.classList.add('error');
        el.closest('[data-use-input-label]')?.classList.add('error');
        el.closest('[data-use-textarea-label]')?.classList.add('error');
        el.closest('[data-use-select-label]')?.classList.add('error');
        el.closest('[data-use-input-file-label]')?.classList.add('error');
        el.closest('[data-input-password]')?.classList.add('error');
        el.closest('.checkbox-wrap')?.classList.add('error');

        el?.errorContainer?.remove();
        let message = errorMessage;
        if(!message) {
            const validationType = getValidationType(el);
            const language = el.closest('[data-language-content="en"]') ? 'en' : 'he';
            message = window.errorMessages[language][validationType];
        }

        const parent = el.closest('[data-use-input-label]')
            || el.closest('[data-use-textarea-label]')
            || el.closest('[data-use-select-label]')
            || el.closest('[data-use-input-file-label]')
            || el.closest('[data-input-password]')
            || el.closest('.checkbox-wrap')
            || el;
        const targetEl = parent ? parent : el;

        const div = document.createElement('div');
        div.className = 'error-text text-[0.75rem] text-design-red-0 px-4';
        div.innerText = message;
        el.errorContainer = div;
        targetEl.after(div);

        const swiperContainer = div.closest('.swiper');
        swiperContainer?.swiper && swiperContainer?.swiper.updateAutoHeight(300);
    })

    const removeError = () => {
        elements.forEach(el => {
            el.classList.remove('error');
            el.closest('[data-use-input-label]')?.classList.remove('error');
            el.closest('[data-use-textarea-label]')?.classList.remove('error');
            el.closest('[data-use-select-label]')?.classList.remove('error');
            el.closest('[data-use-input-file-label]')?.classList.remove('error');
            el.closest('[data-input-password]')?.classList.remove('error');
            el.closest('.checkbox-wrap')?.classList.remove('error');
            el?.errorContainer?.remove();
            el.removeEventListener('click', removeError);
        })
    }

    elements.forEach(el => {
        el.addEventListener('click', removeError);
        el.parentElement.addEventListener('click', removeError);
    })
}

function initFormValidation() {
    const buttons = document.querySelectorAll('[data-validate-form]');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (!checkValidation(btn.closest('form'))) e.preventDefault();
        })
    })
}

function initPageReload() {
    const buttons = document.querySelectorAll('[data-action="page-reload"]');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (btn.href) {
                history.pushState({}, '', btn.href)
            }
            location.reload();
        })
    })
}
// == / form fields validation

function initGlobalInitialMethod() {
    const handlers = [];

    window.pageSliders = {
        init: () => { handlers.forEach(h => h()) },
        addInitHandler: (h) => { handlers.push(h) }
    }
}

function initScrollTrigger() {
    const elements = document.querySelectorAll('[data-scroll-trigger]');
    elements.forEach(el => {
        const callback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    el.classList.add('active');
                }
            });
        };

        const options = {
            root: null,
            rootMargin: el.getAttribute('data-root-margin'),
            threshold: Number(el.getAttribute('data-threshold')),
        };

        const observer = new IntersectionObserver(callback, options);
        observer.observe(el);
    })
}

window.addEventListener("DOMContentLoaded", () => {
  if (isMobile()) {
    document.body.classList.add('mobile');
  }

  if (iOS()) {
    document.body.classList.add('mobile-ios');
  }

  if (isSafari()) {
    document.body.classList.add('safari');
  }

  const absolutePath = window?.theme_path || '.';
  
  const fancyboxPlugin = new LazyLoadScript(absolutePath + '/assets/js/plugins/fancybox.min.js');
  const maskPlugin = new LazyLoadScript(absolutePath + '/assets/js/plugins/inputmask.min.js');
  const tippyPlugin = new LazyLoadScript(absolutePath + '/assets/js/plugins/tippy.js');
  const videoPlugin = new LazyLoadScript(absolutePath + '/assets/js/plugins/video.js');
  const datepickerPlugin = new LazyLoadScript(absolutePath + '/assets/js/plugins/air-datepicker.js');

  const da = new DynamicAdapt('max');
  da.init();
  replaceImageToInlineSvg('.img-svg');
  initInputMask(maskPlugin);
  initTooltip(tippyPlugin);
  initCopyLink();
  initAnchorsLinkOffset();
  initScrollContainers();
  initToggleClassesByClick();
  initRemoveClassByOption();
  initSmoothScrollByAnchors();
  initHideWhenOverFooter();
  initHideWhenOverElements();
  initFancybox(fancyboxPlugin);
  initToggleClassByMatchReqExp();
  initToggleCollapse();
  initAddClassByChangeEvent();
  initRemoveClassByChangeEvent();
  initTruncateText();
  initTabs();
  initMultipleLanguageTabs();
  initScrollTopByClick();
  initProgressScrollLine();
  initFormValidation();
  initPageReload();
  initGlobalInitialMethod();
  initScrollTrigger();
  initSelectTabsTrigger();


  // ==== components =====================================================
  {
    const locale = {
        days: ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'],
        daysShort: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'],
        daysMin: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'],
        months: ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'],
        monthsShort: ['ינו', 'פבר', 'מרץ', 'אפר', 'מאי', 'יונ', 'יול', 'אוג', 'ספט', 'אוק', 'נוב', 'דצמ'],
        today: 'היום',
        clear: 'נקה',
        dateFormat: 'yyyy-MM-dd',
        timeFormat: 'HH:mm',
        firstDay: 0
    }

    function initDatepicker(datepickerPlugin) {
        const datepickerElements = document.querySelectorAll('[data-datepicker]');
        const mobile = window.innerWidth < 768;
        datepickerElements.forEach(el => {
            datepickerPlugin.addObserver(el, () => {
                const input = el.querySelector('input');

                let options = {
                    locale,
                    navTitles: {
                        days: 'MMMM yyyy',
                    },
                    isMobile: mobile,
                    autoClose: mobile,
                    position: 'bottom right'
                }

                if(el.getAttribute('data-max-date') === 'today') {
                    options = {
                        ...options,
                        maxDate: Date.now()
                    }
                }

                if(el.getAttribute('data-min-date') === 'today') {
                    options = {
                        ...options,
                        minDate: Date.now()
                    }
                }

                const datepicker = new AirDatepicker(input, options);
            })
        })
    }
    
    function initCalendar(datepickerPlugin) {
        const datepickerElements = document.querySelectorAll('[data-calendar]');
        if(datepickerElements.length) {
            datepickerPlugin.onLoad(() => {
                datepickerElements.forEach(el => {
                    const loader = el.querySelector('.cover-loader');
                    const input = el.querySelector('input');
    
                    let options = {
                        inline: true,
                        locale,
                        navTitles: {
                            days: 'MMMM yyyy',
                        }
                    }
    
                    if(el.getAttribute('data-max-date') === 'today') {
                        options = {
                            ...options,
                            maxDate: Date.now()
                        }
                    }
    
                    const datepicker = new AirDatepicker(input, options)
        
                    loader && loader.classList.remove('active');
        
                    const isParentSwiper = el.closest('.swiper');
                    if(isParentSwiper) {
                        const swiper = isParentSwiper.swiper;
                        swiper && swiper.updateAutoHeight(300);
                    }
                })
            });
            datepickerPlugin.loadForce();
        }
    }

    function initDatepickerFromTo(datepickerPlugin) {
        const datepickerElements = document.querySelectorAll('[data-datepicker-from-to]');
        const mobile = window.innerWidth < 768;
        datepickerElements.forEach(el => {
            datepickerPlugin.addObserver(el, () => {
                const inputFrom = el.querySelector('[data-datepicker-from] input');
                const inputTo = el.querySelector('[data-datepicker-to] input');

                let options = {
                    locale,
                    navTitles: {
                        days: 'MMMM yyyy',
                    },
                    isMobile: mobile,
                    autoClose: mobile,
                    position: 'bottom right'
                }
                let datepickerFrom;
                let datepickerTo;

                datepickerFrom = new AirDatepicker(inputFrom, {
                    ...options,
                    minDate: Date.now(),
                    onSelect: ({date, formattedDate, datepicker}) => {
                        datepickerTo.clear(true);
                        datepickerTo.update(
                            {
                                ...options,
                                minDate: date,
                            },
                            true
                        );
                        inputTo.parentElement.classList.remove('pointer-events-none', 'opacity-50');
                    }
                });
                datepickerTo = new AirDatepicker(inputTo, {
                    ...options,
                    minDate: Date.now()
                });
            })
        })
    }
    
    initCalendar(datepickerPlugin);
    initDatepicker(datepickerPlugin);
    initDatepickerFromTo(datepickerPlugin);
}
  {
    const sliders = document.querySelectorAll('[data-slider="default-slider"]');
    sliders.forEach(slider => {
        initDefaultSlider(slider);
    })
}

function initDefaultSlider(htmlEl, options) {
    const slidesCount = Number(htmlEl.getAttribute('data-slides-count')) || 4;
    const gap = Number(htmlEl.getAttribute('data-gap')) || 8;
    const gapLg = Number(htmlEl.getAttribute('data-gap-lg')) || 24;
    const swiperWrapper = htmlEl.querySelector('.swiper-wrapper');

    // if(swiperWrapper.children.length < 4) {
    //     swiperWrapper.classList.add('slides-center')
    // }

    const swiper = new Swiper(htmlEl.classList.contains('swiper') ? htmlEl : htmlEl.querySelector('.swiper'), {
        observer: true,
        observeParents: true,
        speed: 500,
        watchSlidesProgress: true,
        navigation: {
            nextEl: htmlEl.querySelector('.btn-left'),
            prevEl: htmlEl.querySelector('.btn-right'),
        },
        breakpoints: {
            0: {
                slidesPerView: 'auto',
                spaceBetween: gap,
                freeMode: true,
            },
            1024: {
                slidesPerView: slidesCount,
                spaceBetween: gapLg,
                freeMode: false,
            }
        },
        centerInsufficientSlides: options?.centerInsufficientSlides ?? true
    })
}

window.pageSliders.addInitHandler(() => {
    const sliders = document.querySelectorAll('[data-slider="default-slider"]');
    sliders.forEach(slider => {
        const swiper = slider.classList.contains('swiper') ? slider : slider.querySelector('.swiper');
        if(swiper.classList.contains('swiper-initialized')) return;
        initDefaultSlider(slider);
    })
})

{
    const sliders = document.querySelectorAll('[data-slider="one-slide"]');
    sliders.forEach(slider => {
        let options = {
            observer: true,
            observeParents: true,
            speed: 500,
            watchSlidesProgress: true,
            autoHeight: true,
            breakpoints: {
                0: {
                    slidesPerView: 1,
                    spaceBetween: 40,
                },
                1024: {
                    slidesPerView: 1,
                    spaceBetween: 40,
                }
            }
        }

        const btnLeft = slider.querySelector('.btn-left');
        const btnRight = slider.querySelector('.btn-right');
        const pagination = slider.querySelector('.pagination');

        if (btnLeft && btnRight) {
            options = {
                ...options,
                navigation: {
                    nextEl: btnLeft,
                    prevEl: btnRight,
                },
            }
        }

        if (pagination) {
            options = {
                ...options,
                pagination: {
                    el: pagination,
                    clickable: true
                },
            }
        }

        const swiper = new Swiper(
            slider.classList.contains('swiper') ? slider : slider.querySelector('.swiper'),
            options
        );
    })
}
  const navTabSliders = document.querySelectorAll('[data-slider="nav-tab-slider"]');
navTabSliders.forEach(slider => {
    const swiper = new Swiper(slider.querySelector('.swiper'), {
        observer: true,
        observeParents: true,
        slidesPerView: 1,
        speed: 500,
        spaceBetween: 12,
        autoplay: {
            delay: 2000,
        },
        navigation: {
            nextEl: slider.querySelector('.btn-left'),
            prevEl: slider.querySelector('.btn-right'),
        },
        pagination: {
            el: slider.querySelector(".pagination"),
        },
    })
})

  {
    const btnScrollUp = document.querySelector('[data-scroll-up]');
    if(btnScrollUp) {
        window.addEventListener('scroll', (e) => {
            const windowHeight = document.documentElement.clientHeight;
            btnScrollUp.classList.toggle('active', window.scrollY > (windowHeight / 2))
        })

        btnScrollUp.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
        })
    }
}
  {
    const quantityElements = document.querySelectorAll('[data-set-quantity]');
    quantityElements.forEach(async el => maskPlugin.addObserver(el, () => {}));
    
    maskPlugin.onLoad(() => {
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-set-quantity]')) {
                const input = e.target.closest('[data-set-quantity]').querySelector('input');
        
                if (e.target.closest('[data-action="plus"]')) {
                    const event = new Event('change', { bubbles: true });
                    input.value++;
                    input.dispatchEvent(event);
                }
        
                if (e.target.closest('[data-action="minus"]')) {
                    if (input.value <= 1) return;
                    const event = new Event('change', { bubbles: true });
                    input.value--;
                    input.dispatchEvent(event);
                }
            }
        })
        
        document.addEventListener('mousemove', (e) => {
            if (e.target.closest('[data-set-quantity]')) {
                const parent = e.target.closest('[data-set-quantity]');
                if (parent.classList.contains('quantity-active')) return;
        
                parent.classList.add('quantity-active');
                const input = parent.querySelector('input');
                if (!input) return;
        
                if(Inputmask) {
                    const mask = Inputmask("9{*}", {
                        clearIncomplete: false,
                        clearMaskOnLostFocus: false,
                    }).mask(input);
                }
        
                input.addEventListener('blur', () => {
                    if (input.value < 1) {
                        input.value = 1;
                    }
                })
            }
        
        })
    })
}



  {
    const spoilers = document.querySelectorAll('[data-spoiler]');
    if (spoilers.length) {
        spoilers.forEach(spoiler => {
            const swiper = spoiler.closest('[data-scroll-container]')?.swiper;
            let isOneActiveItem = spoiler.dataset.spoiler.trim() === 'one' ? true : false;
            let triggers = spoiler.querySelectorAll('[data-spoiler-trigger]');
            if (triggers.length) {
                triggers.forEach(trigger => {
                    let parent = trigger.parentElement;
                    let content = trigger.nextElementSibling;

                    // init
                    if (trigger.classList.contains('active')) {
                        content.style.display = 'block';
                        parent.classList.add('active');
                    }

                    trigger.addEventListener('click', (e) => {
                        e.preventDefault();
                        parent.classList.toggle('active');
                        trigger.classList.toggle('active');
                        content && slideToggle(content, 300);
                        swiper && setTimeout(() => swiper.update(), 300);

                        if (isOneActiveItem) {
                            triggers.forEach(i => {
                                if (i === trigger) return;

                                let parent = i.parentElement;
                                let content = i.nextElementSibling;

                                parent.classList.remove('active');
                                i.classList.remove('active');
                                content && slideUp(content, 300);
                                swiper && setTimeout(() => swiper.update(), 300);
                            })
                        }
                    })
                })
            }
        })
    }

    const radioSpoilers = document.querySelectorAll('[data-radio-spoiler]');
    radioSpoilers.forEach(radioSpoiler => {
        let triggers = Array.from(radioSpoiler.querySelectorAll('[data-radio-trigger]'))
            .map(el => {
                return {
                    wrapper: el,
                    input: el.querySelector('input[type="radio"]')
                }
            });
        
        triggers.forEach(trigger => trigger.input?.checked && trigger.wrapper.nextElementSibling.style.setProperty('display', 'block'));

        radioSpoiler.addEventListener('change', (e) => {
            const isEventFromTrigger = triggers.find(t => t.input === e.target);
            if(isEventFromTrigger) {
                triggers.forEach(trigger => {
                    if(trigger.input?.checked) {
                        slideDown(trigger.wrapper.nextElementSibling, 300);
                    } else {
                        slideUp(trigger.wrapper.nextElementSibling, 300);
                    }
                })
            }
        })
    })
}
  {
    const useLabel = (wrapper, formFieldType) => {

        const formField = wrapper.querySelector(formFieldType);
        if (!formField) return;

        wrapper.classList.add('using');
        formField.focus();

        if (formField.classList.contains('_blur-event-added')) return;

        const label = wrapper.querySelector(`.${formFieldType}-label`);
        if (label) {
            const borderWrap = document.createElement('div');
            borderWrap.className = `${formFieldType}-border-wrap`;
            borderWrap.append(label.cloneNode(true));
            wrapper.append(borderWrap);
        }

        formField.addEventListener('blur', (e) => {
            if (formField.value.length === 0) wrapper.classList.remove('using');
        })

        formField.classList.add('_blur-event-added');
    }

    const init = (wrapper, formFieldType) => {

        const formField = wrapper.querySelector(formFieldType);
        if (!formField) return;

        if (formField.value.length) {
            wrapper.classList.add('using', 'no-transition');

            setTimeout(() => {
                wrapper.classList.remove('no-transition');
            }, 150)
        }

        if (formField.classList.contains('_blur-event-added')) return;

        const label = wrapper.querySelector(`.${formFieldType}-label`);
        if (label) {
            const borderWrap = document.createElement('div');
            borderWrap.className = `${formFieldType}-border-wrap`;
            borderWrap.append(label.cloneNode(true));
            wrapper.append(borderWrap);
        }

        formField.addEventListener('blur', (e) => {
            if (formField.value.length === 0) wrapper.classList.remove('using');
        })

        formField.classList.add('_blur-event-added');
    }

    const inputWrapElements = document.querySelectorAll('[data-use-input-label]');
    inputWrapElements.forEach(wrapper => init(wrapper, 'input'));

    const textareaWrapElements = document.querySelectorAll('[data-use-textarea-label]');
    textareaWrapElements.forEach(wrapper => init(wrapper, 'textarea'));

    document.addEventListener('click', (e) => {
        if (e.target.closest('[data-use-input-label]')) {
            const wrapper = e.target.closest('[data-use-input-label]');
            init(wrapper, 'input');
            useLabel(wrapper, 'input');
        }

        if (e.target.closest('[data-use-textarea-label]')) {
            const wrapper = e.target.closest('[data-use-textarea-label]');
            init(wrapper, 'textarea');
            useLabel(wrapper, 'textarea');
        }
    })

    const passwordInputs = document.querySelectorAll('[data-input-password]');
    passwordInputs.forEach(inputWrapper => {
        const input = inputWrapper.querySelector('input');
        const btn = inputWrapper.querySelector('[data-action="toggle-show-password"]');

        btn.addEventListener('click', () => {
            if (inputWrapper.classList.contains('active')) {
                inputWrapper.classList.remove('active');
                input.setAttribute('type', 'password');
            } else {
                inputWrapper.classList.add('active');
                input.setAttribute('type', 'text');
            }
        })
    })


    const inputWrapItems = document.querySelectorAll('.file-input');
    if (inputWrapItems.length) {
        const initSimpleInputFile = (inputWrap) => {
            let files = []
            let input = inputWrap.querySelector('input[type="file"]');
            let fileListContainer = document.createElement('div');
            console.log(input.files);

            fileListContainer.className = 'file-input-result';
            inputWrap.after(fileListContainer);

            const renderFileList = () => {
                fileListContainer.innerHTML = '';

                files.forEach(file => {
                    fileListContainer.insertAdjacentHTML('beforeend', `
                    <div class="grid grid-cols-[auto_1fr] items-center gap-2">
                        <button data-action="remove-file-from-list" data-file-name="${file.name}" class="icon-x-mark rounded-full transition hover:bg-app-gray-100-0 p-1"></button>
                        <div class="truncate">
                            ${file.name}  
                        </div>
                    </div>
                    `)
                })
            }

            const removeFile = (fileName) => {
                const index = files.findIndex(file => file.name === fileName);
                files.splice(index, 1);

                input.files = new DataTransfer().files;
                renderFileList();
            }

            const changeHandler = (event) => {
                if (!event.target.files.length) {
                    return
                }

                files = Array.from(event.target.files);

                renderFileList();
            }

            input.addEventListener('change', changeHandler);
            
            fileListContainer.addEventListener('click', (e) => {
                if (e.target.closest('[data-action="remove-file-from-list"]')) {
                    const btn = e.target.closest('[data-action="remove-file-from-list"]');
                    removeFile(btn.getAttribute('data-file-name'));
                }
            })

            const form = input.closest('form');
            if(form) {
                form.addEventListener('submit', () => {
                    files = [];
                    renderFileList();
                })
            }
        }

        const initStyledInputFile = (inputWrap) => {

            let files = []
            const parent = inputWrap.closest('[data-use-input-file-label]');
            const input = parent.querySelector('input[type="file"]');
            const fileListContainer = parent.querySelector('.file-list');

            const renderFileList = () => {
                fileListContainer.innerHTML = '';

                files.forEach(file => {
                    fileListContainer.insertAdjacentHTML('beforeend', `
                    <div class="grid grid-cols-[auto_1fr] items-center gap-2">
                        <button data-action="remove-file-from-list" data-file-name="${file.name}" class="icon-x-mark rounded-full transition hover:bg-app-gray-100-0 p-1"></button>
                        <div class="truncate">
                            ${file.name}  
                        </div>
                    </div>
                    `)
                })

                if(files.length) {
                    parent.classList.add('using');
                } else {
                    parent.classList.remove('using');
                }
            }

            const removeFile = (fileName) => {
                const index = files.findIndex(file => file.name === fileName);
                files.splice(index, 1);

                updateFileInput();
                renderFileList();
            }

            const updateFileInput = () => {
                const dataTransfer = new DataTransfer();
                files.forEach(file => {
                    dataTransfer.items.add(file);
                });
                input.files = dataTransfer.files;
            }

            const changeHandler = (event) => {
                if (!event.target.files.length) {
                    return
                }

                files = Array.from(event.target.files);

                renderFileList(files, fileListContainer);
            }

            input.addEventListener('change', changeHandler);
            parent.addEventListener('click', (e) => {
                if (e.target.closest('[data-action="remove-file-from-list"]')) {
                    const btn = e.target.closest('[data-action="remove-file-from-list"]');
                    removeFile(btn.getAttribute('data-file-name'));
                }
            })

            const form = input.closest('form');
            if(form) {
                form.addEventListener('submit', () => {
                    files = [];
                    renderFileList();
                })
            }
        }

        inputWrapItems.forEach(inputWrap => {
            const isHasLabel = inputWrap.closest('[data-use-input-file-label]');

            if (isHasLabel) {
                initStyledInputFile(inputWrap);
            } else {
                initSimpleInputFile(inputWrap);
            }
        })
    }
}

  {
    const quizContainers = document.querySelectorAll('[data-quiz]');
    quizContainers.forEach(quiz => {
        if(quiz) {
            const startIndex = quiz.getAttribute('data-start-screen') || 0;
            const progressLine = quiz.querySelector('[data-line]');
            const buttonsNext = quiz.querySelectorAll('[data-action="next-quiz-screen"]');
            const buttonsPrev = quiz.querySelectorAll('[data-action="prev-quiz-screen"]');
            const buttonsTo = quiz.querySelectorAll('[data-action="to-quiz-screen"]');
            const setVisibleScreensElements = quiz.querySelectorAll('[data-set-visible-screens]');
            const buttonsShowQuizBody = quiz.querySelectorAll('[data-action="show-quiz-body"]');
            const buttonsShowPreviewScreen = quiz.querySelectorAll('[data-action="show-preview-screen"]');
            const buttonsSubmit = quiz.querySelectorAll('[data-action="submit"]');
            const loader = quiz.querySelector('.quiz-loader');
            const pagination = quiz.querySelector('.pagination');
            const confirmationScreen = quiz.querySelector('.confirmation-screen');
            const previewScreen = quiz.querySelector('.preview-screen');
            const quizBody = quiz.querySelector('.quiz-body');
            const swiperWrapper = quiz.querySelector('.swiper-wrapper');
            const slides = Array.from(swiperWrapper.children);
            const initialVisibleScreens = quiz.querySelector('[data-initial-visible-screens]')?.getAttribute('data-initial-visible-screens');

            if(initialVisibleScreens) {
                const visibleScreensIndexes = initialVisibleScreens.split(',');
                slides.forEach((slide, index) => {
                    if(visibleScreensIndexes.includes(String(index))) return;
                    slide.remove();
                })
            }
    
            let swiperOptions = {
                observer: true,
                observeParents: true,
                effect: 'fade',
                crossFade: true,
                slidesPerView: 1,
                spaceBetween: 24,
                speed: 500,
                autoHeight:true,
                touchRatio: 0,
                initialSlide: Number(startIndex),
                watchSlidesProgress: true,
            }
    
            if(pagination) {
                swiperOptions = {
                    ...swiperOptions,
                    pagination: {
                        el: pagination,
                        clickable: true
                    }
                }
            }
    
            const swiper = new Swiper(quiz.querySelector('.swiper'), swiperOptions);
    
            swiper.on('progress', (swiper, progress) => {
                progressLine && progressLine.style.setProperty('width', 100 * progress + '%');
            })
            
            function reset() {
                const form = quiz.closest('form');
                if(form) {
                    form.reset();

                    const usingFields = form.querySelectorAll('.using');
                    usingFields.forEach(f => f.classList.remove('using'))
                }

                swiper.slideTo(0);
            }

            function setQuizOnMiddleOfScreen() {
                let header = document.querySelector('[data-header]');
                const rect = quiz.getBoundingClientRect();
                let top = (
                    (Math.abs(document.body.getBoundingClientRect().top) + rect.top + (rect.height / 2)) - (window.innerHeight / 2)
                );

                if (header) {
                    top = top - (header.clientHeight / 2);
                }

                window.scrollTo({
                    top: top,
                    behavior: 'smooth',
                })
            }

    
            function showQuiz() {
                //reset();
                quiz.style.setProperty('overflow', 'hidden');
                previewScreen && previewScreen.classList.add('fadeOut');
                confirmationScreen && confirmationScreen.classList.add('fadeOut');
                quizBody && quizBody.classList.remove('fadeOut');

                setTimeout(() => {
                    previewScreen && previewScreen.classList.add('hidden');
                    confirmationScreen && confirmationScreen.classList.add('hidden');
                    quizBody && quizBody.classList.add('fadeIn');
                    quizBody && quizBody.classList.remove('hidden');
                }, 300)

                setTimeout(() => {
                    quiz.style.removeProperty('overflow');
                }, 600)
            }
    
            function showPreviewScreen() {
                if(!previewScreen) return; 
                quizBody.classList.add('fadeOut');
                previewScreen.classList.remove('fadeOut');
                setTimeout(() => {
                    quizBody.classList.add('hidden');
                    previewScreen.classList.add('fadeIn');
                    previewScreen.classList.remove('hidden');
                }, 300)
            }

            function setVisibleScreens(indexes) {
                const visibleScreens = slides.filter((slide, index) =>  indexes.includes(String(index)) && slide);
                swiper.removeAllSlides();
                swiper.appendSlide(visibleScreens);
            }
            

            buttonsNext.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    if(checkValidation(btn.closest('.quiz-screen'))) {
                        swiper.slideNext();
                        setTimeout(() => {
                            setQuizOnMiddleOfScreen();
                        }, 300)
                    }
                })
            })
            buttonsPrev.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    swiper.slidePrev();
                    setQuizOnMiddleOfScreen();
                })
            })
            buttonsTo.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const index = btn.getAttribute('data-index');
                    if(index) {
                        swiper.slideTo(index);
                        setQuizOnMiddleOfScreen();
                    }
                })
            })
            buttonsShowQuizBody.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    showQuiz();
                    setTimeout(() => {
                        setQuizOnMiddleOfScreen();
                    }, 500)
                })
            })
            buttonsShowPreviewScreen.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    showPreviewScreen();
                })
            })
            
            buttonsSubmit.forEach(buttonSubmit => {
                buttonSubmit.addEventListener('click', (e) => {
                    if(!checkValidation(buttonSubmit.closest('.quiz-screen'))) e.preventDefault();
                })
            })

            setVisibleScreensElements.forEach(el => {
                if(el.tagName === 'INPUT') {
                    el.addEventListener('change', (e) => {
                        if(e.target.checked) {
                            const indexes = el.getAttribute('data-set-visible-screens');
                            if(indexes) {
                                const visibleScreensIndexes = indexes.split(',');
                                setVisibleScreens(visibleScreensIndexes);
                            }
                        }
                    })
                } else { 

                }
            })

    
            quiz.quiz = {
                swiper: swiper,
                toggleLoaderVisibility: (state) => {
                    if(state) {
                        loader.classList.add('active');
                    } else {
                        loader.classList.remove('active');
                    }
                },
                screenNext: () => {
                    swiper.slideNext();
                },
                screenPrev: () => {
                    swiper.slidePrev();
                },
                toScreen: (index) => {
                    swiper.slideTo(index);
                },
                showConfirmationScreen: () => {
                    if(!confirmationScreen) return; 
                    confirmationScreen.classList.remove('fadeOut');
                    quizBody.classList.add('fadeOut');
                    setTimeout(() => {
                        quizBody.classList.add('hidden');
                        confirmationScreen.classList.add('fadeIn');
                        confirmationScreen.classList.remove('hidden');
                    }, 300);
                    setTimeout(() => {
                        setQuizOnMiddleOfScreen();
                    }, 500)
                },
                showQuiz: () => {
                    showQuiz();
                },
                showPreviewScreen: () => {
                    showPreviewScreen();
                },
                toggleButtonDisabledStateOnScreenByIndex: (state, screenIndex) => {
                    const screen = swiperWrapper.children[screenIndex];
                    if(!screen) return;
    
                    const btn = screen.querySelector('[data-action="next-quiz-screen"], [data-action="submit"]');
                    if(!btn) return;
    
                    if(state) {
                        btn.classList.add('disabled');
                    } else {
                        btn.classList.remove('disabled');
                    }
                }
            }
        }
    });
}

  
  {
    const productsObserverContainers = document.querySelectorAll('[data-products-observer]');
    productsObserverContainers.forEach(prodObservContainer => {
        const productHoverContainers = [];

        const getMainImageCordsAndSize = (imagesContainer, mainImage) => {
            const imagesContainerRect = imagesContainer.getBoundingClientRect();
            const mainImageRect = mainImage.getBoundingClientRect();
            return {
                width: mainImageRect.width,
                height: mainImageRect.height,
                left: mainImageRect.left - imagesContainerRect.left,
                bottom: imagesContainerRect.bottom - mainImageRect.bottom,
            }
        }

        const setImageCordsAndSize = (image, { width, height, left, bottom }) => {
            if (!image) return;

            image.style.maxWidth = width + 'px';
            image.style.maxHeight = height + 'px';
            image.style.left = left + 'px';
            image.style.bottom = bottom + 'px';
        }

        const setImagesPositions = ({ wrapper, imagesContainer, mainImage, secondImage, thirdImage }) => {
            if (isMobile()) return;

            const mainImageCords = getMainImageCordsAndSize(imagesContainer, mainImage);

            setImageCordsAndSize(secondImage, mainImageCords);
            setImageCordsAndSize(thirdImage, mainImageCords);

            wrapper.classList.add('_position-had-set');

            if (secondImage) {
                imagesContainer.style.setProperty('--x-translate', (secondImage.clientWidth * 0.38) + 'px');

                secondImage.onload = () => {
                    imagesContainer.style.setProperty('--x-translate', (secondImage.clientWidth * 0.38) + 'px');
                }
            }


            mainImage.onload = () => {
                setImagesPositions({ wrapper, imagesContainer, mainImage, secondImage, thirdImage });
            }
        }

        prodObservContainer.querySelectorAll('[data-product-hover-container]')
            .forEach(productHoverContainer => {
                const object = {
                    wrapper: productHoverContainer,
                    imagesContainer: productHoverContainer.querySelector('.images-container'),
                    mainImage: productHoverContainer.querySelector('.main-image'),
                    secondImage: productHoverContainer.querySelector('.second-image'),
                    thirdImage: productHoverContainer.querySelector('.third-image'),
                }
                setImagesPositions(object);
                productHoverContainers.push(object);
                productHoverContainer.classList.add('_observed');
            })

        let observer = new MutationObserver(mutationRecords => {

            prodObservContainer.querySelectorAll('[data-product-hover-container]:not(._observed)')
                .forEach(productHoverContainer => {
                    const object = {
                        wrapper: productHoverContainer,
                        imagesContainer: productHoverContainer.querySelector('.images-container'),
                        mainImage: productHoverContainer.querySelector('.main-image'),
                        secondImage: productHoverContainer.querySelector('.second-image'),
                        thirdImage: productHoverContainer.querySelector('.third-image'),
                    }
                    setImagesPositions(object);
                    productHoverContainers.push(object);
                    productHoverContainer.classList.add('_observed');
                })
        });

        observer.observe(prodObservContainer, {
            childList: true,
            subtree: true,
        });

        const intersectionObserver = new IntersectionObserver(entries => {
            if(entries[0]?.isIntersecting) {
                productHoverContainers.forEach(i => setImagesPositions(i));
            }
        }, {
            root: null,
            rootMargin: "0px 0px 0% 0px",
            threshold: [0.01],
        })

        intersectionObserver.observe(prodObservContainer);

        window.addEventListener('resize', () => {
            productHoverContainers.forEach(i => setImagesPositions(i));
        })
    })
}
  {
    const anchorsLists = document.querySelectorAll('[data-anchors-list]');
    anchorsLists.forEach(anchorsList => {
        let anchors = anchorsList.querySelectorAll('a[href^="#"]:not([data-action="open-popup"])');
        const items = [];
        anchors.forEach(anchor => {
            const href = anchor.getAttribute('href')
            const id = href.length > 1 ? href : null;
            if (!id) return;
            let el = document.querySelector(href);

            if (el) {
                const thresholdLine = document.createElement('div');
                thresholdLine.className = 'threshold-line';
                document.body.append(thresholdLine);

                items.push({
                    anchor,
                    targetEl: el,
                    thresholdLine
                })
            }
        })

        const setPositionAndSize = (thresholdLine, el, nextEl) => {
            if (!thresholdLine) return;

            if (el) {
                thresholdLine.style.top = getCoords(el).top + 'px';
            }

            if (nextEl) {
                const height = getCoords(nextEl).top - getCoords(el).top;
                thresholdLine.style.height = height < 0 ? '10px' : height - 2 + 'px';
            }
        }

        items.forEach((item, index) => {
            setPositionAndSize(item.thresholdLine, item.targetEl, items[index + 1]?.targetEl);
        })

        const setElAsActive = () => {
            const visibleElements = items.filter(item => {
                const rect = item.thresholdLine.getBoundingClientRect();
                if(
                    rect.top < document.documentElement.clientHeight / 2
                    && rect.bottom > 0
                ) return item;
            })

            if(!visibleElements.length) return;

            const [target] = visibleElements.sort((a, b) => {
                const topA = a.thresholdLine.getBoundingClientRect().top;
                const topB = b.thresholdLine.getBoundingClientRect().top;
                return topB - topA;
            });

            target.anchor.classList.add('active');

            items.forEach(i => {
                if(i === target) return;
                i.anchor.classList.remove('active');
            })
        }

        setElAsActive();

        window.addEventListener('scroll', setElAsActive);

        window.addEventListener('resize', () => {
            items.forEach((item, index) => {
                setPositionAndSize(item.thresholdLine, item.targetEl, items[index + 1]?.targetEl);
            })
        })
    })

    function getCoords(elem) {
        let box = elem.getBoundingClientRect();

        return {
            top: box.top + window.scrollY,
            right: box.right + window.scrollX,
            bottom: box.bottom + window.scrollY,
            left: box.left + window.scrollY
        };
    }
}
  {
    const searchElements = document.querySelectorAll('[data-search]');
    searchElements.forEach(search => {
        const btnClear = search.querySelector('.btn-clear');
        const input = search.querySelector('input');

        if (btnClear && input) {
            input.addEventListener('input', (e) => {
                btnClear.classList.toggle('active', e.target.value.length >= 3);
            })

            btnClear.addEventListener('click', () => {
                input.value = '';
                const event = new Event('input', { bubbles: true });
                input.dispatchEvent(event);
            })
        }
    })
}
  {
    const sortSelectS = document.querySelectorAll('[data-sort-select]');
    sortSelectS.forEach(sortSelectWrap => {
        const select = sortSelectWrap.querySelector('select');

        if(!select) return;

        select.addEventListener('change', () => {
            sortSelectWrap.classList.add('_selected');
        })
    })
}
  {
    const catalogFilter = document.querySelector('[data-catalog-filter]');
    if (catalogFilter) {
        const closeFilter = () => {
            toggleDisablePageScroll(false);
            catalogFilter.classList.remove('show');
        }
        const openFilter = () => {
            toggleDisablePageScroll(true);
            catalogFilter.classList.add('show');
        }

        const initFilterElementsSizes = () => {
            const head = catalogFilter.querySelector('.catalog-filter-head');
            const footer = catalogFilter.querySelector('.catalog-filter-footer');

            const setHeaderFooterSize = () => {
                catalogFilter.style.setProperty('--head-height', head.clientHeight + 'px');
                catalogFilter.style.setProperty('--footer-height', footer.clientHeight + 'px');
            }

            setHeaderFooterSize();

            window.addEventListener('resize', setHeaderFooterSize);
        }

        const initToggleVisible = () => {
            skipEventBySelectors.add('[data-catalog-filter]');
            skipEventBySelectors.add('[data-action="open-catalog-filter"]');
            const openButtons = document.querySelectorAll('[data-action="open-catalog-filter"]');
            const closeButtons = document.querySelectorAll('[data-action="close-catalog-filter"]');

            openButtons.forEach(btn => {
                btn.addEventListener('click', openFilter);
            })

            closeButtons.forEach(btn => {
                btn.addEventListener('click', closeFilter);
            })
        }

        const initToggleVisibleStickyButton = () => {

            const stickyBtn = document.querySelector('[data-sticky-catalog-filter-btn]');
            const triggerStickyBtn = document.querySelector('[data-main-catalog-filter-btn]');
            if (stickyBtn && triggerStickyBtn) {
                const options = {
                    root: null,
                    rootMargin: "0px",
                    threshold: 1.0,
                };
                const callback = function (entries) {
                    stickyBtn.classList.toggle('active', !entries[0].isIntersecting);
                };
                const observer = new IntersectionObserver(callback, options);
                observer.observe(triggerStickyBtn);
            }
        }

        const initScrollHandler = () => {
            if (window.innerWidth < 1024) return;

            const swiper = catalogFilter.querySelector('[data-scroll-container]')?.swiper;
            const spoilerChildren = Array.from(catalogFilter.querySelector('[data-spoiler]')?.children || []);
            const header = document.querySelector('[data-header]');

            const checkFilterFullVisibility = () => {
                const catalogRect = catalogFilter.getBoundingClientRect();

                if( 
                    (catalogRect.top >= header.clientHeight)
                    && (Math.trunc(catalogRect.bottom)  <= Math.trunc(document.documentElement.clientHeight + 5)) 
                ) {
                    return true;
                } else {
                    return false;
                }
            }

            catalogFilter.addEventListener('wheel', (e) => {
                const result = spoilerChildren.some(child => child.classList.contains('active'));

                if(!result) {
                    e.stopImmediatePropagation();
                    return;
                }

                const isFilterFullVisible = checkFilterFullVisibility();

                if(!isFilterFullVisible) {
                    e.stopImmediatePropagation();
                    return;
                }

                if (e.deltaY < 0 && swiper?.progress === 0) {
                    e.stopImmediatePropagation();
                } 

                if (e.deltaY > 0 && swiper?.progress === 1) {
                    e.stopImmediatePropagation();
                } 

            }, { capture: true })
        }

        const initCheckOfSelectedFilters = () => {
            const filterContainer = catalogFilter.querySelector('[data-spoiler]');
            if(!filterContainer) return;

            const inputs = Array.from(filterContainer.querySelectorAll('input[type="checkbox"]'));
            const activeFiltersElements = document.querySelectorAll('[data-action="open-catalog-filter"] .active-filters');

            const setValue = () => {
                const result = inputs.reduce((value, input) => input.checked ? value + 1 : value, 0);
                if(result === 0) {
                    activeFiltersElements.forEach(el => {
                        el.innerHTML = '';
                        el.classList.add('hidden');
                    });
                } else {
                    activeFiltersElements.forEach(el => {
                        el.innerHTML = result;
                        el.classList.remove('hidden');
                    });
                }
            }

            setValue();

            filterContainer.addEventListener('change', setValue);

            const sectionsFn = [];

            Array.from(filterContainer.children).forEach(filterSection => {
                const activeFiltersEl = filterSection.querySelector('[data-active-filters]');
                if(!activeFiltersEl) return;

                const inputs = Array.from(filterSection.querySelectorAll('input[type="checkbox"]'));

                const setValue = () => {
                    const result = inputs.reduce((value, input) => input.checked ? value + 1 : value, 0);
                    if(result === 0) {
                        activeFiltersEl.innerHTML = '';
                        activeFiltersEl.classList.add('hidden');
                    } else {
                        activeFiltersEl.innerHTML = result;
                        activeFiltersEl.classList.remove('hidden');
                    }
                }
                sectionsFn.push(setValue);
                setValue();

                filterSection.addEventListener('change', setValue)
            })

            const form = catalogFilter.closest('form');
            form.addEventListener('reset', () => {
                setTimeout(() => {
                    sectionsFn.forEach(fn => fn());
                    setValue();
                },0)
            })
        }

        initFilterElementsSizes();
        initToggleVisible();
        initToggleVisibleStickyButton();
        initScrollHandler();
        initCheckOfSelectedFilters();
    }
}
  class HtmlVideo {
    constructor(htmlEl) {
        this.container = htmlEl;
        this.videoSrc = htmlEl.getAttribute('data-src');
        this.player = null;
        this.isPosterVisible = true;
        this.loader = this.container.querySelector('.cover-loader');
    }
    play() {
        if (!this.player) return;
        this.player.play();
    }

    pause() {
        if (!this.player) return;

        this.player.pause();
    }

    onProgress(callback) {
        if (!this.player) return;

        this.player.on('timeupdate', (e, i) => {
            callback(this.player.currentTime() / this.player.duration());
        })
    }

    muted() {
        if (!this.player) return;
        this.player.muted(true);
    }

    unmuted() {
        if (!this.player) return;
        this.player.muted(false);
    }

    createVideoElement(callback = () => { }) {
        const videoEl = document.createElement('video');
        videoEl.setAttribute('loop', '');
        videoEl.setAttribute('muted', 'muted');
        videoEl.setAttribute('playsinline', 'playsinline');
        videoEl.setAttribute('disablepictureinpicture', '');
        videoEl.setAttribute('controlslist', 'nodownload noplaybackrate');
        videoEl.setAttribute('type', 'video/mp4');

        this.container.append(videoEl);

        this.player = videojs(videoEl, {

        });
        this.player.volume(1);
        this.player.src({ type: 'video/mp4', src: this.videoSrc });
        this.player.ready(() => {
            callback();
            this.hideLoader();
        });

        this.player.on('waiting', () => {
            this.showLoader();
            //console.log('waiting');
        })
        this.player.on('playing', () => {
            this.hideLoader();
            //console.log('playing');
        })
    }

    hidePoster() {
        Array.from(this.container.children).forEach(el => el.classList.contains('video-card-poster') && el.style.setProperty('display', 'none'));
        this.isPosterVisible = false;
    }

    hideLoader() {
        this.loader && this.loader.classList.remove('active');
    }

    showLoader() {
        this.loader && this.loader.classList.add('active');
    }

}

class VideosCard {
    constructor(videoCardContainer) {
        this.videoCardContainer = videoCardContainer;
        this.playState = true;
        this.mutedState = true;
        this.videosElements = [];

        this.init();
    }

    init() {
        const wrapper = this.videoCardContainer.querySelector('.swiper-wrapper');
        const mainSlider = new Swiper(this.videoCardContainer.querySelector('.swiper'), {
            observer: true,
            observeParents: true,
            speed: 500,
            spaceBetween: 16,
            navigation: {
                nextEl: this.videoCardContainer.querySelector('.btn-left'),
                prevEl: this.videoCardContainer.querySelector('.btn-right'),
            }
        })

        this.swiper = mainSlider;


        Array.from(wrapper.children).forEach(mainSlide => {
            const productsLinks = mainSlide.querySelector('.product-links');
            if (!productsLinks) return;

            const wrapper = productsLinks.querySelector('.swiper-wrapper');

            if (wrapper.children.length > 1) {
                productsLinks.classList.add('multiple');
            }

            new Swiper(productsLinks, {
                slidesPerView: 'auto',
                observer: true,
                observeParents: true,
                speed: 500,
                spaceBetween: 6,
                mousewheel: true,
                nested: true,
                grabCursor: true,
            })

            const btn = mainSlide.querySelector('[data-action="toggle-visible-product-links"]');
            if (!btn) return;

            btn.addEventListener('click', () => {
                if (btn.classList.contains('active')) {
                    slideDown(productsLinks, 300);
                    btn.classList.remove('active');
                } else {
                    slideUp(productsLinks, 300);
                    btn.classList.add('active');
                }
            })


            // video 
            const btnPlayPause = mainSlide.querySelector('[data-action="toggle-play-pause"]');
            const btnToggleMuted = mainSlide.querySelector('[data-action="toggle-muted"]');
            const progressLine = mainSlide.querySelector('.progress-line');
            const videoContainer = mainSlide.querySelector('[data-video]');

            this.videosElements.push({
                btnPlayPause,
                btnToggleMuted,
                progressLine,
                player: this._createVideo(videoContainer)
            })

            mainSlider.on('slideChange', (swiper) => {
                this.startVideoByIndex(swiper.activeIndex);
            })
        })
    }

    _createVideo(videoContainer) {
        switch (videoContainer.getAttribute('data-video')) {
            case 'youtube':
                throw new Error('Youtube video don not work yet')
            case 'vimeo':
                throw new Error('Vimeo video don not work yet')
            default:
                return new HtmlVideo(videoContainer);
        }
    }

    play(btn, player) {
        btn.classList.add('pause');
        player.play();
    }

    pause(btn, player) {
        btn.classList.remove('pause');
        player.pause();
    }

    muted(btn, player) {
        btn.classList.remove('unmuted');
        player.muted();
    }
    unmuted(btn, player) {
        btn.classList.add('unmuted');
        player.unmuted();
    }

    startVideoByIndex(index) {
        this.videosElements.forEach((videoElements, i) => {
            if (index == i) {
                if (videoElements.player.player) {
                    if (this.mutedState) {
                        this.muted(videoElements.btnToggleMuted, videoElements.player);
                    } else {
                        this.unmuted(videoElements.btnToggleMuted, videoElements.player);
                    }
                    if (this.playState) {
                        this.play(videoElements.btnPlayPause, videoElements.player.player);
                    }
                } else {
                    videoElements.player.createVideoElement(() => {
                        if (this.mutedState) {
                            this.muted(videoElements.btnToggleMuted, videoElements.player);
                        } else {
                            this.unmuted(videoElements.btnToggleMuted, videoElements.player);
                        }
                        if (this.playState) {
                            this.play(videoElements.btnPlayPause, videoElements.player.player);
                        }

                        videoElements.player.onProgress((progress) => {
                            videoElements.progressLine.style.width = (100 * progress) + '%';
                            if ((100 * progress) > 0 && videoElements.player.isPosterVisible) {
                                videoElements.player.hidePoster();
                            }
                        })

                        this._initButtonsEvents(videoElements);
                    })
                }
            } else {
                if (videoElements.player.player) {
                    this.pause(videoElements.btnPlayPause, videoElements.player.player);
                }
            }
        })
    }

    _initButtonsEvents(videoElements) {
        videoElements.btnPlayPause.addEventListener('click', () => {
            if (videoElements.player.player.paused()) {
                this.play(videoElements.btnPlayPause, videoElements.player);
                this.playState = true;
            } else {
                this.pause(videoElements.btnPlayPause, videoElements.player);
                this.playState = false;
            }
        })

        videoElements.btnToggleMuted.addEventListener('click', () => {
            if (videoElements.player.player.muted()) {
                this.unmuted(videoElements.btnToggleMuted, videoElements.player);
                this.mutedState = false;
            } else {
                this.muted(videoElements.btnToggleMuted, videoElements.player);
                this.mutedState = true;
            }
        })
    }

    pauseAll() {
        this.videosElements.forEach(videoElements => {
            if (videoElements.player.player) {
                this.pause(videoElements.btnPlayPause, videoElements.player.player);
            }
        })
    }
}

  class VideoStickyBox {
    constructor(box) {
        this.box = box;
        this.closeBtn = box.querySelector('[data-action="close-video-sticky-box"]');
        this.videosCard = new VideosCard(box.querySelector('[data-video-cards]'));
        this.isBoxVisible = false;

        skipEventBySelectors.add('[data-video-sticky-box]');

        this._initEvents();
    }

    _initEvents() {
        this.closeBtn.addEventListener('click', () => {
            this.hide();
        })
    }

    show(index) {

        this._setFullScreen();
        this.box.classList.add('show');

        if(this.videosCard.swiper.activeIndex == index) {
            this.videosCard.startVideoByIndex(index);
        } else {
            this.videosCard?.swiper.slideTo(index, 300);
        }

        this.isBoxVisible = true;
    }

    hide() {
        this.box.classList.remove('show');
        this.videosCard.pauseAll();
        this.isBoxVisible = false;

        this._unsetFullScreen();
    }

    _setFullScreen() {
        if(document.documentElement.clientWidth < 512) {
            this.box.classList.add('full-screen');
            toggleDisablePageScroll(true);
        }
    }

    _unsetFullScreen() {
        this.box.classList.remove('full-screen');
        toggleDisablePageScroll(false);
    }
}
  {
    const productVideosElements = document.querySelectorAll('[data-product-videos]');
    productVideosElements.forEach(productVideosEl => {

        videoPlugin.addObserver(productVideosEl, () => {
            skipEventBySelectors.add('[data-product-videos]');
            const loader = productVideosEl.querySelector('.cover-loader');
            const stickyBoxContainer = productVideosEl.querySelector('[data-video-sticky-box]');
            const stickyBox = stickyBoxContainer.stickyBox = new VideoStickyBox(stickyBoxContainer);
            const allStickyBoxContainersOnPage = document.querySelectorAll('[data-video-sticky-box]');

            if(!stickyBoxContainer) return;
            document.body.append(stickyBoxContainer);


            const triggers = productVideosEl.querySelectorAll('[data-action="show-video-by-index"]');
            triggers.forEach(trigger => {
                trigger.addEventListener('click', () => {
                    stickyBox.show(trigger.getAttribute('data-index'));

                    allStickyBoxContainersOnPage.forEach(container => {
                        if(container === stickyBoxContainer) return;
                        container?.stickyBox.hide();
                    })
                })
            })

            loader.classList.remove('active');
        });

    })
}
  {
    const stories = document.querySelectorAll('[data-stories]');
    stories.forEach(story => {
        const swiper = new Swiper(story.querySelector('[data-slider="stories-slider"]'), {
            observer: true,
            observeParents: true,
            speed: 400,
            navigation: {
                nextEl: story.querySelector('.btn-left'),
                prevEl: story.querySelector('.btn-right'),
            },
            breakpoints: {
                0: {
                    slidesPerView: 'auto',
                    freeMode: true,
                    slidesPerGroup: 1,
                },
                1024: {
                    slidesPerView: 'auto',
                    freeMode: false,
                    slidesPerGroup: 3,
                }
            },
        })

        videoPlugin.addObserver(story, () => {
            skipEventBySelectors.add('[data-stories]');
            const loader = story.querySelector('.cover-loader');
            const stickyBoxContainer = story.querySelector('[data-video-sticky-box]');
            const stickyBox = stickyBoxContainer.stickyBox = new VideoStickyBox(stickyBoxContainer);
            const allStickyBoxContainersOnPage = document.querySelectorAll('[data-video-sticky-box]');

            const triggers = story.querySelectorAll('[data-action="show-video-by-index"]');
            triggers.forEach(trigger => {
                trigger.addEventListener('click', () => {
                    stickyBox.show(trigger.getAttribute('data-index'));

                    allStickyBoxContainersOnPage.forEach(container => {
                        if(container === stickyBoxContainer) return;
                        container?.stickyBox.hide();
                    })
                })
            })

            loader.classList.remove('active');
        });

    })
}
  // ==== // components =====================================================



  // ==== sections =====================================================
  const searchContent = `
    <button data-action="close-search-result" class="absolute z-6 top-3 left-2 size-10 rounded-full flex items-center justify-center lg:hidden bg-white">
    <img class="h-6 w-auto" src="assets/images/icons/x-mark.svg" alt="">
</button>
<div class="search-result-scroll-container overflow-y-auto h-full">
    <div class="overflow-hidden">
        <div class="border-b last:border-none border-app-gray-200-0 py-6 px-6 lg:px-[2.8125rem]">
            <h3 class="text-base leading-[1.69em] capitalize font-semibold">מוצרים</h3>
            <div class="swiper !overflow-visible mt-[12px]" data-slider="default-slider" data-slides-count="3" data-gap="8" data-gap-lg="20">
                <div class="swiper-wrapper [&_.swiper-slide]:w-auto">
                    <div class="swiper-slide">
                        <a href="#" class="flex flex-col items-center w-[132px] p-2 gap-1 bg-yellow-01-0 rounded-[5px] lg:w-full lg:gap-[0.5625rem] lg:rounded-[0.375rem] lg:p-3 transition hover:bg-yellow-02-0">
                            <div class="h-[116px] w-full flex items-center justify-center lg:h-[9.3125rem]">
                                <img class="w-auto h-auto max-h-full max-w-full" src="assets/images/searched-product-1.png" alt="">
                            </div>
                            <span class="flex items-center justify-center min-h-5 px-2 border border-purple---main-0 rounded-[6px] text-purple---main-0 text-center text-[14px] leading-none">
                                40% הנחה
                            </span>
                            <h4 class="text-[14px] font-semibold leading-[1.93em] capitalize">
                                Energy Complex    
                            </h4>
                        </a>
                    </div>
                    <div class="swiper-slide">
                        <a href="#" class="flex flex-col items-center w-[132px] p-2 gap-1 bg-yellow-01-0 rounded-[5px] lg:w-full lg:gap-[0.5625rem] lg:rounded-[0.375rem] lg:p-3 transition hover:bg-yellow-02-0">
                            <div class="h-[116px] w-full flex items-center justify-center lg:h-[9.3125rem]">
                                <img class="w-auto h-auto max-h-full max-w-full" src="assets/images/searched-product-1.png" alt="">
                            </div>
                            <span class="flex items-center justify-center min-h-5 px-2 border border-purple---main-0 rounded-[6px] text-purple---main-0 text-center text-[14px] leading-none">
                                40% הנחה
                            </span>
                            <h4 class="text-[14px] font-semibold leading-[1.93em] capitalize">
                                Energy Complex    
                            </h4>
                        </a>
                    </div>
                    <div class="swiper-slide">
                        <a href="#" class="flex flex-col items-center w-[132px] p-2 gap-1 bg-yellow-01-0 rounded-[5px] lg:w-full lg:gap-[0.5625rem] lg:rounded-[0.375rem] lg:p-3 transition hover:bg-yellow-02-0">
                            <div class="h-[116px] w-full flex items-center justify-center lg:h-[9.3125rem]">
                                <img class="w-auto h-auto max-h-full max-w-full" src="assets/images/searched-product-1.png" alt="">
                            </div>
                            <span class="flex items-center justify-center min-h-5 px-2 border border-purple---main-0 rounded-[6px] text-purple---main-0 text-center text-[14px] leading-none">
                                40% הנחה
                            </span>
                            <h4 class="text-[14px] font-semibold leading-[1.93em] capitalize">
                                Energy Complex    
                            </h4>
                        </a>
                    </div>
                </div>
                <button type="button" class="btn-left left-0 -translate-x-1/2 top-[50%] [&.swiper-button-disabled]:hidden -translate-y-1/2 z-4 hidden absolute lg:flex items-center justify-center size-10 rounded-full bg-white shadow-default transition hover:bg-app-gray-100-0">
<img src="assets/images/icons/arrow-left.svg" alt="">
</button>
<button type="button" class="btn-right right-0 translate-x-1/2 top-[50%] [&.swiper-button-disabled]:hidden -translate-y-1/2 z-4 hidden absolute lg:flex items-center justify-center size-10 rounded-full bg-white shadow-default transition hover:bg-app-gray-100-0">
<img src="assets/images/icons/arrow-right.svg" alt="">
</button>
            </div>

            <div class="mt-12"></div>

            <h3 class="text-base leading-[1.69em] capitalize font-semibold">כתבות</h3>
            <div class="swiper !overflow-visible mt-[12px]" data-slider="default-slider" data-slides-count="3" data-gap="8" data-gap-lg="20">
                <div class="swiper-wrapper [&_.swiper-slide]:w-auto">
                    <div class="swiper-slide">
                        <a href="#" class="flex flex-col w-[148px] gap-2 lg:w-full [&_img]:hover:opacity-80">
                            <div class="size-[148px] rounded-[0.375rem] block lg:size-[11.25rem] overflow-hidden bg-[#000]">
                                <img class="h-full w-full object-cover transition-opacity" src="assets/images/searched-post-1.jpg" alt="">
                            </div>
                            <span class="text-[14px] lg:text-base">
                                למי כדאי לקחת פרוביוטיקה ואיך תדעו איזה לבחור?
                            </span>
                        </a>
                    </div>
                    <div class="swiper-slide">
                        <a href="#" class="flex flex-col w-[148px] gap-2 lg:w-full [&_img]:hover:opacity-80">
                            <div class="size-[148px] rounded-[0.375rem] block lg:size-[11.25rem] overflow-hidden bg-[#000]">
                                <img class="h-full w-full object-cover transition-opacity" src="assets/images/searched-post-2.jpg" alt="">
                            </div>
                            <span class="text-[14px] lg:text-base">
                                למי כדאי לקחת פרוביוטיקה ואיך תדעו איזה לבחור?
                            </span>
                        </a>
                    </div>
                    <div class="swiper-slide">
                        <a href="#" class="flex flex-col w-[148px] gap-2 lg:w-full [&_img]:hover:opacity-80">
                            <div class="size-[148px] rounded-[0.375rem] block lg:size-[11.25rem] overflow-hidden bg-[#000]">
                                <img class="h-full w-full object-cover transition-opacity" src="assets/images/searched-post-3.jpg" alt="">
                            </div>
                            <span class="text-[14px] lg:text-base">
                                למי כדאי לקחת פרוביוטיקה ואיך תדעו איזה לבחור?
                            </span>
                        </a>
                    </div>
                    <div class="swiper-slide">
                        <a href="#" class="flex flex-col w-[148px] gap-2 lg:w-full [&_img]:hover:opacity-80">
                            <div class="size-[148px] rounded-[0.375rem] block lg:size-[11.25rem] overflow-hidden bg-[#000]">
                                <img class="h-full w-full object-cover transition-opacity" src="assets/images/searched-post-1.jpg" alt="">
                            </div>
                            <span class="text-[14px] lg:text-base">
                                למי כדאי לקחת פרוביוטיקה ואיך תדעו איזה לבחור?
                            </span>
                        </a>
                    </div>
                    <div class="swiper-slide">
                        <a href="#" class="flex flex-col w-[148px] gap-2 lg:w-full [&_img]:hover:opacity-80">
                            <div class="size-[148px] rounded-[0.375rem] block lg:size-[11.25rem] overflow-hidden bg-[#000]">
                                <img class="h-full w-full object-cover transition-opacity" src="assets/images/searched-post-1.jpg" alt="">
                            </div>
                            <span class="text-[14px] lg:text-base">
                                למי כדאי לקחת פרוביוטיקה ואיך תדעו איזה לבחור?
                            </span>
                        </a>
                    </div>
                </div>
                <button type="button" class="btn-left left-0 -translate-x-1/2 top-[5.625rem] [&.swiper-button-disabled]:hidden -translate-y-1/2 z-4 hidden absolute lg:flex items-center justify-center size-10 rounded-full bg-white shadow-default transition hover:bg-app-gray-100-0">
<img src="assets/images/icons/arrow-left.svg" alt="">
</button>
<button type="button" class="btn-right right-0 translate-x-1/2 top-[5.625rem] [&.swiper-button-disabled]:hidden -translate-y-1/2 z-4 hidden absolute lg:flex items-center justify-center size-10 rounded-full bg-white shadow-default transition hover:bg-app-gray-100-0">
<img src="assets/images/icons/arrow-right.svg" alt="">
</button>
            </div>
        </div>
        <a href="#" class="border-b last:border-none border-app-gray-200-0 px-6 flex items-center justify-between min-h-[60px] lg:px-[2.8125rem] lg:min-h-[4.625rem] transition hover:bg-app-gray-100-0">
            <span class="text-base leading-[1.69em] capitalize font-semibold ml-auto">לכל התוצאות</span>
            <img src="assets/images/icons/chevron-left.svg" alt="">
        </a>
        <div class="border-b last:border-none border-app-gray-200-0 px-6 py-6 lg:px-[2.8125rem]">
            <h3 class="text-base leading-[1.69em] capitalize font-semibold">חיפושים פופולריים</h3>
            <div class="flex flex-wrap gap-2 mt-[12px]">
                <a href="#" class="flex items-center justify-center rounded-full min-h-10 py-2 px-[12px] text-[1.125rem] leading-none tracking-[0.01em] bg-app-gray-100-0 transition hover:bg-app-gray-200-0"> צמחים </a>
                <a href="#" class="flex items-center justify-center rounded-full min-h-10 py-2 px-[12px] text-[1.125rem] leading-none tracking-[0.01em] bg-app-gray-100-0 transition hover:bg-app-gray-200-0"> ברזל </a>
                <a href="#" class="flex items-center justify-center rounded-full min-h-10 py-2 px-[12px] text-[1.125rem] leading-none tracking-[0.01em] bg-app-gray-100-0 transition hover:bg-app-gray-200-0"> עייפות </a>
                <a href="#" class="flex items-center justify-center rounded-full min-h-10 py-2 px-[12px] text-[1.125rem] leading-none tracking-[0.01em] bg-app-gray-100-0 transition hover:bg-app-gray-200-0"> פרוביוטיקה </a>
                <a href="#" class="flex items-center justify-center rounded-full min-h-10 py-2 px-[12px] text-[1.125rem] leading-none tracking-[0.01em] bg-app-gray-100-0 transition hover:bg-app-gray-200-0"> נשירת שיער </a>
            </div>
        </div>
    </div>
</div>
`;

const mainSearch = document.querySelector('[data-main-search]');
if (mainSearch) {
    skipEventBySelectors.add('[data-main-search]');
    const btnClear = mainSearch.querySelector('.btn-clear');
    const input = mainSearch.querySelector('input');
    const searchResultScrollContainer = mainSearch.querySelector('.search-result-scroll-container');
    const header = document.querySelector('[data-header]');
    const deskNav = document.querySelector('[data-desk-nav]');
    const overlay = document.querySelector('[data-overlay]');
    const searchResult = mainSearch.querySelector('.search-result');


    if (btnClear && input) {
        input.addEventListener('input', (e) => {
            btnClear.classList.toggle('active', e.target.value.length >= 3);
        })

        btnClear.addEventListener('click', () => {
            input.value = '';
            const event = new Event('input', { bubbles: true });
            input.dispatchEvent(event);
        })
    }

    const setHeaderAsFixed = () => {
        if (!header) return;
        header.style.setProperty('position', 'fixed');
        document.body.style.setProperty('padding-top', `${header.clientHeight}px`);
    }

    const unsetHeaderAsFixed = () => {
        if (!header) return;
        header.style.removeProperty('position');
        document.body.style.removeProperty('padding-top');
    }

    const closeSearchResult = (e) => {
        const searchResultScrollContainer = mainSearch.querySelector('.search-result-scroll-container');
        const header = document.querySelector('[data-header]');
        const overlay = document.querySelector('[data-overlay]');

        mainSearch.classList.remove('active');
        searchResult.classList.remove('active');

        if (e) {
            if (!checkSkipSelectors(e)) {
                toggleDisablePageScroll(false);
            }
        } else {
            toggleDisablePageScroll(false);
        }


        if (!searchResultScrollContainer) return;
        searchResultScrollContainer.removeAttribute('style');
        header.style.removeProperty('padding-right');
        unsetHeaderAsFixed();
        overlay?.classList.remove('active');
    }

    const showSearchResult = () => {
        const searchResultScrollContainer = mainSearch.querySelector('.search-result-scroll-container');
        const header = document.querySelector('[data-header]');
        const overlay = document.querySelector('[data-overlay]');
        const sliders = mainSearch.querySelectorAll('[data-slider="default-slider"]');

        sliders.forEach(slider => {
            if(slider.classList.contains('swiper-initialized')) return;
            initDefaultSlider(slider, { centerInsufficientSlides: false });
        })

        searchResult.classList.add('active');

        if (!searchResultScrollContainer || !header) return;
        searchResultScrollContainer.setAttribute('style', `max-height: calc(100dvh - ${header.clientHeight + 8 - (deskNav?.clientHeight || 0)}px)`)

        const offsetValue = getScrollbarWidth();
        header.style.paddingRight = offsetValue + 'px';
        toggleDisablePageScroll(true);
        setHeaderAsFixed();
        overlay?.classList.add('active');
    }

    mainSearch.addEventListener('click', (e) => {
        if (!mainSearch.classList.contains('active')) {
            mainSearch.classList.add('active');
            input && input.focus();

            showSearchResult();
        }

        if (e.target.closest('[data-action="close-search-result"]')) {
            closeSearchResult();
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('[data-main-search]')) {
            closeSearchResult(e);
        }
    })

    let observer = new MutationObserver(mutationRecords => {
        console.log(mutationRecords);
    });

    observer.observe(searchResult, {
        childList: true,
        subtree: true,
    });

    window.mainSearch = {
        showResult: () => {
            showSearchResult();
        },
        hideResult: () => {
            closeSearchResult();
        }
    }
}

const mobileMenu = document.querySelector('[data-mobile-menu]');
if (mobileMenu) {
    skipEventBySelectors.add('[data-mobile-menu]');
    skipEventBySelectors.add('[data-action="open-mobile-menu"]');
    const openMobileMenuButtons = document.querySelectorAll('[data-action="open-mobile-menu"]');
    const mainLayer = mobileMenu.querySelector('.main-layer');
    const sublayers = Array.from(mobileMenu.querySelectorAll('.sublayer'));
    const showSublayersTriggers = mobileMenu.querySelectorAll('[data-show-sublayer-by-id]');

    openMobileMenuButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleDisablePageScroll(true);
            mobileMenu.classList.add('show');
        })
    })

    showSublayersTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const sublayerId = trigger.getAttribute('data-show-sublayer-by-id');
            const targetSublayer = sublayers.find(sublayer => sublayer.getAttribute('data-sublayer') == sublayerId);

            if (!targetSublayer) return;

            targetSublayer.classList.add('active');
            setTimeout(() => {
                mainLayer.classList.add('hidden');
            }, 150);
        })
    })

    mobileMenu.addEventListener('click', (e) => {
        if (e.target.closest('[data-action="close-mobile-menu"]')) {
            mobileMenu.classList.remove('show');
            toggleDisablePageScroll(false);
        }

        if (e.target.closest('[data-action="close-sublayer"]')) {
            const sublayer = e.target.closest('.sublayer');
            sublayer.classList.remove('active');
            setTimeout(() => {
                mainLayer.classList.remove('hidden');
            }, 150);
        }
    })
}

const desktopNavigation = document.querySelector('[data-desk-nav]');
if (desktopNavigation) {
    const navItems = Array.from(desktopNavigation.querySelectorAll('[data-show-nav-tab-by-id]'));
    const navTabs = Array.from(desktopNavigation.querySelectorAll('[data-nav-tab-id]'));

    navItems.forEach(navItem => {
        navItem.addEventListener('mouseenter', () => {
            navItem.classList.add('active');

            navItems.forEach(navItem2 => {
                if (navItem === navItem2) return;
                navItem2.classList.remove('active');
            })

            const tabId = navItem.getAttribute('data-show-nav-tab-by-id');

            navTabs.forEach(navTab => {
                const id = navTab.getAttribute('data-nav-tab-id');
                if (id === tabId) {
                    navTab.classList.add('active');
                } else {
                    navTab.classList.remove('active');
                }
            })
        })
    });

    desktopNavigation.addEventListener('mouseleave', () => {
        navItems.forEach(navItem => navItem.classList.remove('active'));
        navTabs.forEach(navTab => navTab.classList.remove('active'));
    })
}

const header = document.querySelector('[data-header]');
if (header) {
    const setHeaderSize = () => {
        document.body.style.setProperty('--header-height', header.clientHeight + 'px');
    }

    setHeaderSize();

    window.addEventListener('resize', setHeaderSize);
}
  const firstBannerSlider = document.querySelector('[data-slider="first-banner"]');
if (firstBannerSlider) {

    const swiperSlider = new Swiper(firstBannerSlider, {
        slidesPerView: 1,
        speed: 500,
        effect: "creative",
        creativeEffect: {
            next: {
                translate: ["-20%", 0, -1],
            },
            prev: {
                translate: ["100%", 0, 0],
            },
        },
        //touchRatio: 0,
        autoplay: {
            delay: 3000
        },
        controller: {
            inverse: true
        },
        loop: true,
        pagination: {
            el: firstBannerSlider.querySelector('.pagination'),
            clickable: true
        },
        breakpoints: {
            0: {
                touchRatio: 1,
            },
            1024: {
                touchRatio: 0,
            },
        }
    })
}
  {
    const gallerySlider = document.querySelector('[data-slider="instagram-posts"]');
    if(gallerySlider) {
        const swiper = new Swiper(gallerySlider, {
            observer: true,
            observeParents: true,
            speed: 500,
            slidesPerView: 'auto',
            spaceBetween: 17.5
        })
    }

    const popup = document.querySelector('[data-popup="instagram-posts"]');
    if(popup) {
        skipEventBySelectors.add('[data-popup="instagram-posts"]');
        skipEventBySelectors.add('[data-action="open-instagram-posts-popup"]');
        const openPopupButtons = document.querySelectorAll('[data-action="open-instagram-posts-popup"]');
        const closePopupButtons = document.querySelectorAll('[data-action="close-instagram-posts-popup"]');
        const swiperWrapper = popup.querySelector('.swiper-wrapper');
        //const videos = initVideos(swiperWrapper);

        const postsFullSlider = popup.querySelector('[data-slider="instagram-posts-full"]');
        if(!postsFullSlider) return;

        const swiper = new Swiper(postsFullSlider, {
            observer: true,
            observeParents: true,
            speed: 500,
            slidesPerView: 1,
            spaceBetween: 16,
            navigation: {
                nextEl: popup.querySelector('.btn-left'),
                prevEl: popup.querySelector('.btn-right'),
            }
        })
        
        openPopupButtons.forEach((btn, index) => {

            btn.addEventListener('click', (e) => {
                e.preventDefault();
                toggleDisablePageScroll(true);
                compensateWidthOfScrollbar(true);
                popup.classList.add('open');
                swiper.slideTo(index,0);
            })
        })

        closePopupButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                toggleDisablePageScroll(false);
                compensateWidthOfScrollbar(false);
                popup.classList.remove('open');
            })
        })

        popup.addEventListener('click', (e) => {
            if(e.target.closest('.popup-content') || e.target.closest('.popup-nav')) return;
            toggleDisablePageScroll(false);
            compensateWidthOfScrollbar(false);
            popup.classList.remove('open');
        })

        function initVideos(swiperWrapper) {
            const videos =  Array.from(swiperWrapper.children).map((slide, index) => {
                const videoContainer = slide.querySelector('[data-video]');
                if(!videoContainer) return;

                return {
                    slideIndex: index,
                    video: initVideo(videoContainer)
                }
            })

            return {
                videos,
                getVideo: (index) => {
                    return videos.find(v => v.slideIndex == index);
                }
            }
        }

        function initVideo(videoContainer) {
            const btnTogglePlayPause = videoContainer.querySelector('[data-action="toggle-play-pause"]');
            const btnToggleMuted = videoContainer.querySelector('[data-action="toggle-muted"]');
            const video = new HtmlVideo(videoContainer);

            return {
                play: () => {},
                pause: () => {},
                mute: () => {},
                isCanPlay: new Promise((res) => {
                    video.createVideoElement(() => {
                        res(true);
                    });
                })
            }
            console.log(video);
        }
    }
}
  const footerNav = document.querySelector('[data-footer-nav]');
if(footerNav) {
    const navItems = footerNav.querySelectorAll('.footer-nav-item');
    navItems.forEach(navItem => {
        const head = navItem.querySelector('.footer-nav-head');
        const list = navItem.querySelector('.footer-nav-list');

        if(!head || !list) return;

        head.addEventListener('click', (e) => {
            if(document.documentElement.clientWidth > 1023.98) return;

            e.preventDefault();
            head.classList.toggle('active');
            slideToggle(list, 300);
        })
    })
}
  const productImages = document.querySelector('[data-product-images]');
if (productImages) {
    const thumb = productImages.querySelector('.thumb-product-slider');
    const main = productImages.querySelector('.main-product-slider');

    let thumbsSlider;
    let mainOptions = {
        speed: 400,
        slidesPerView: 1,
        spaceBetween: 16,
        observer: true,
        observeParents: true,
        navigation: {
            nextEl: productImages.querySelector('.btn-left'),
            prevEl: productImages.querySelector('.btn-right'),
        },
        pagination: {
            el: productImages.querySelector('.pagination'),
            clickable: true
        },
    }

    if (thumb.firstElementChild.children.length > 1) {
        thumbsSlider = new Swiper(thumb, {
            speed: 400,
            freeMode: true,
            observer: true,
            observeParents: true,
            slideToClickedSlide: true,
            breakpoints: {
                0: {
                    slidesPerView: 4,
                    spaceBetween: 8,
                },
                640: {
                    slidesPerView: 5,
                    spaceBetween: 8,
                },
                768: {
                    slidesPerView: 6,
                    spaceBetween: 8,
                },
                1024: {
                    slidesPerView: 4,
                    spaceBetween: 8,
                },
            }
        })

        mainOptions = {
            ...mainOptions,
            thumbs: {
                swiper: thumbsSlider,
            },
        }
    } else {
        thumb.style.setProperty('display', 'none');
    }

    const mainSlider = new Swiper(main, mainOptions);
}

const stickyProductPanel = document.querySelector('[data-sticky-product-panel]');
const triggerStickyProductPanel = document.querySelector('[data-trigger-sticky-product-panel]');
if (stickyProductPanel && triggerStickyProductPanel) {
    const options = {
        root: null,
        rootMargin: "0px 0px 0px 0px",
        threshold: 1.0,
    };
    const callback = function (entries, observer) {
        stickyProductPanel.classList.toggle('active', !entries[0].isIntersecting);
    };
    const observer = new IntersectionObserver(callback, options);
    observer.observe(triggerStickyProductPanel);

    setInterval(() => {
        document.body.style.paddingBottom = stickyProductPanel.clientHeight + 'px';
    }, 500);
}
  {
    const productComponents = document.querySelector('[data-product-components]');
    if (productComponents) {
        const coverElements = productComponents.querySelectorAll('.cover');
        coverElements.forEach(cover => {
            cover.style.height = productComponents.clientHeight + 'px';
        })

        const MobileSliders = () => {
            const main = productComponents.querySelector('.main-slider');
            const thumb = productComponents.querySelector('.thumb-slider');
            let mainSlider, thumbsSlider;



            return {
                init() {
                    if (
                        (document.documentElement.clientWidth < 1024)
                        && main.classList.contains('swiper-initialized')
                    ) {
                        return
                    }
                    thumb?.setAttribute('dir', 'rtl');

                    thumbsSlider = new Swiper(thumb, {
                        slidesPerView: 'auto',
                        speed: 400,
                        spaceBetween: 12,
                        observer: true,
                        observeParents: true,
                        slideToClickedSlide: true,
                        watchSlidesProgress: true,
                    })
                    mainSlider = new Swiper(main, {
                        effect: "fade",
                        speed: 400,
                        slidesPerView: 1,
                        spaceBetween: 16,
                        observer: true,
                        observeParents: true,
                        autoHeight: true,
                        thumbs: {
                            swiper: thumbsSlider,
                        },
                    })
                },
                destroy() {
                    mainSlider?.destroy();
                    thumbsSlider?.destroy();
                }
            }

        }

        const DesktopSliders = () => {
            const main = productComponents.querySelector('.main-slider');
            const thumb = productComponents.querySelector('.thumb-slider');
            const thumbWrapper = thumb.querySelector('.swiper-wrapper');
            let mainSlider, thumbsSlider;

            return {
                init() {
                    if (
                        !(document.documentElement.clientWidth < 1024)
                        && main.classList.contains('swiper-initialized')
                    ) {
                        return
                    }
                    thumb?.setAttribute('dir', 'ltr');

                    if(thumbWrapper.children.length < 10) {
                        const iterationsCount = Math.ceil(10 / thumbWrapper.children.length);
                        const clonedItems = [];

                        for (let index = 1; index < iterationsCount; index++) {
                            Array.from(thumbWrapper.children).forEach((slide, index) => {
                                slide.setAttribute('data-index', index)
                                const clonedSlide = slide.cloneNode(true);
                                clonedSlide.classList.add('cloned-slide');
                                clonedItems.push(clonedSlide);
                            })
                        }

                        thumbWrapper.append(...clonedItems)
                    }

                    mainSlider = new Swiper(main, {
                        effect: "fade",
                        speed: 400,
                        slidesPerView: 1,
                        spaceBetween: 16,
                        observer: true,
                        observeParents: true,
                        autoHeight: true,
                        touchRatio: 0,
                    })

                    thumbsSlider = new Swiper(thumb, {
                        slidesPerView: 'auto',
                        spaceBetween: 24,
                        speed: 400,
                        observer: true,
                        observeParents: true,
                        watchSlidesProgress: true,
                        loop: true,
                        loopAdditionalSlides: 2,
                        on: {
                            slideChange: (e) => {
                                mainSlider.slideTo(e.slides[e.activeIndex].getAttribute('data-index'))
                            }
                        },
                        navigation: {
                            nextEl: productComponents.querySelector('.btn-right'),
                            prevEl: productComponents.querySelector('.btn-left'),
                        },
                    })
                },
                destroy() {
                    Array.from(thumbWrapper.children).forEach(slide => {
                        if(slide.classList.contains('cloned-slide')) {
                            slide.remove();
                        }
                    })
                    thumbsSlider?.destroy();
                    mainSlider?.destroy();
                }
            }
        }

        const desktopSliders = DesktopSliders();
        const mobileSliders = MobileSliders();

        if (document.documentElement.clientWidth < 1024) {
            mobileSliders.init();
        } else {
            desktopSliders.init();
        }

        window.addEventListener('resize', () => {
            coverElements.forEach(cover => {
                cover.style.height = productComponents.clientHeight + 'px';
            })
            if (document.documentElement.clientWidth < 1024) {
                desktopSliders.destroy();
                mobileSliders.init();
            } else {
                mobileSliders.destroy();
                desktopSliders.init();
            }
        })
    }
}
  {
    const navLinksContainer = document.querySelector('[data-nav-links]');
    if (navLinksContainer) {
        const activeNavLink = navLinksContainer.querySelector('.nav-link.active');
        const descriptions = navLinksContainer.querySelectorAll('.active-category-description');

        descriptions.forEach(descEl => {
            if (descEl.getAttribute('data-active-nav-item-id') == activeNavLink.getAttribute('data-nav-id')) {
                const svgTriangle = descEl.querySelector('.svg-triangle');
                descEl.classList.add('active');

                const setSvgTrianglePosition = () => {
                    const activeNavLinkRect = activeNavLink.getBoundingClientRect();
                    const descElRect = descEl.getBoundingClientRect();
                    const value = (activeNavLinkRect.left + (activeNavLinkRect.width / 2)) - descElRect.left;

                    svgTriangle.style.left = value + 'px';
                }

                svgTriangle?.classList.add('active');
                setSvgTrianglePosition();

                window.addEventListener('resize', setSvgTrianglePosition);
            }
        })
    }

    const navLinksSliderWrapper = document.querySelector('[data-slider="nav-links"]');
    if (navLinksSliderWrapper) {
        const navLinksSlider = navLinksSliderWrapper.querySelector('.swiper');
        const navLinksWrapper = navLinksSlider.querySelector('[data-nav-links-wrap]');
        const activeLink = navLinksSlider.querySelector('[data-nav-id].active');
        const shadowLeft = navLinksSliderWrapper.querySelector('.shadow-left');
        const shadowRight = navLinksSliderWrapper.querySelector('.shadow-right');
        const btnLeft = navLinksSliderWrapper.querySelector('.btn-left');
        const btnRight = navLinksSliderWrapper.querySelector('.btn-right');

        if(navLinksWrapper.clientWidth > (navLinksSlider.clientWidth * 2)) {
            const navLinks = Array.from(navLinksWrapper.children);
            const navLinksRevers = navLinks.reverse();
            let initWidth = navLinksWrapper.clientWidth;
            let value = 0;

            for (let index = 0; index < navLinksRevers.length; index++) {
                const el = navLinksRevers[index];
    
                const clientWidth = el.clientWidth + 4;
    
                const x = navLinksWrapper.clientWidth - value;

                if(x < value) {
                    break;
                }
                initWidth = x;
                value += clientWidth;
            }
            
            navLinksWrapper.style.width = initWidth + 'px';
        }

        const swiper = new Swiper(navLinksSlider, {
            slidesPerView: 'auto',
            freeMode: true,
            speed: 500,
            watchSlidesProgress: true,
            centerInsufficientSlides: true
        })

        if(activeLink) {
            const activeLinkRect = activeLink.getBoundingClientRect();
    
            if (activeLinkRect.left < 0) {
                const navLinksWrapperRect = navLinksWrapper.getBoundingClientRect();
                const maxValue = navLinksWrapperRect.width - navLinksSlider.clientWidth;
                const initValue = activeLinkRect.left - (document.documentElement.clientWidth / 2) + (activeLinkRect.width / 2);
    
                swiper.setTranslate((initValue * -1) > maxValue ? (maxValue * -1) : initValue);
            }
        }

        const toggleElementsVisible = (value, leftElms = [], rightElms = []) => {
            // rightElms.forEach(el => el.classList.remove('hidden'));
            // leftElms.forEach(el => el.classList.remove('hidden'));

            // if(value >= 1) {
            //     leftElms.forEach(el => el.classList.add('hidden'));
            // } else if(value <= 0) {
            //     rightElms.forEach(el => el.classList.add('hidden'));
            // }

            swiper.isBeginning 
                ? rightElms.forEach(el => el.classList.add('hidden'))
                : rightElms.forEach(el => el.classList.remove('hidden'));

            swiper.isEnd
                ? leftElms.forEach(el => el.classList.add('hidden'))
                : leftElms.forEach(el => el.classList.remove('hidden'));
        }
        toggleElementsVisible(swiper.progress, [btnLeft, shadowLeft], [btnRight, shadowRight]);

        swiper.on('progress', (swiper, progress) => {
            toggleElementsVisible(progress, [btnLeft, shadowLeft], [btnRight, shadowRight]);
        })

        const slideStep = isMobile() ? navLinksSlider.clientWidth / 2 : navLinksSlider.clientWidth / 3;

        btnLeft.addEventListener('click', () => {
            swiper.translateTo(swiper.getTranslate() + (slideStep * -1), 500);
            toggleElementsVisible(swiper.progress, [btnLeft, shadowLeft], [btnRight, shadowRight]);
        })
        btnRight.addEventListener('click', () => {
            swiper.translateTo(swiper.getTranslate() + slideStep, 500);
            toggleElementsVisible(swiper.progress, [btnLeft, shadowLeft], [btnRight, shadowRight]);
        })
    }
}

{
	const sliders = document.querySelectorAll('[data-slider="nav-links-one-row"]');
    sliders.forEach(slider => {
        if(slider) {
            let mySwiper;
            const wrapper = slider.querySelector('.swiper-wrapper');
    
            function mobileSlider() {
                if(document.documentElement.clientWidth <= 767 && slider.dataset.mobile == 'false') {
                    const startIndex = Array.from(wrapper.children).findIndex(slide => slide.classList.contains('tab-active')) || 0;

                    mySwiper = new Swiper(slider, {
                        initialSlide: Array.from(wrapper.children).findIndex(slide => slide.classList.contains('tab-active')),
                        slidesPerView: 'auto',
                        spaceBetween: 4,
                        freeMode: true,
                        speed: 500,
                        observer: true,
                        observeParents: true,
                        //slideToClickedSlide: true,
                        navigation: {
                            nextEl: slider.querySelector('.btn-left'),
                            prevEl: slider.querySelector('.btn-right'),
                        },
                    });
    
                    slider.dataset.mobile = 'true';
    
                    //mySwiper.slideNext(0);
                }
    
                if(document.documentElement.clientWidth > 767) {
                    slider.dataset.mobile = 'false';
    
                    if(slider.classList.contains('swiper-initialized')) {
                        mySwiper.destroy();
                    }
                }
            }
    
            mobileSlider();
    
            window.addEventListener('resize', () => {
                mobileSlider();
            })
        }
    })

}
  {
	const slider = document.querySelector('[data-slider="products-list"]');
	if(slider) {
		let mySwiper;
		function mobileSlider() {
			if(document.documentElement.clientWidth <= 1023 && slider.dataset.mobile == 'false') {
				mySwiper = new Swiper(slider, {
                    observer: true,
                    observeParents: true,
                    speed: 500,
                    watchSlidesProgress: true,
                    slidesPerView: 'auto',
                    spaceBetween: 8,
                    freeMode: true,
				});

				slider.dataset.mobile = 'true';
			}

			if(document.documentElement.clientWidth > 1023) {
				slider.dataset.mobile = 'false';

				if(slider.classList.contains('swiper-initialized')) {
					mySwiper.destroy();
				}
			}
		}

		mobileSlider();

		window.addEventListener('resize', () => {
			mobileSlider();
		})
	}

}
  {
    const postsSlidersOneSlide = document.querySelectorAll('[data-slider="posts-slider-one-slide"]');
    postsSlidersOneSlide.forEach(slider => {
        initSlider(slider);
    })

    window.pageSliders.addInitHandler(() => {
        const sliders = document.querySelectorAll('[data-slider="posts-slider-one-slide"]');
        sliders.forEach(slider => {
            const swiper = slider.classList.contains('swiper') ? slider : slider.querySelector('.swiper');
            if(swiper.classList.contains('swiper-initialized')) return;
            initSlider(slider);
        })
    })

    function initSlider(slider) {
        const swiper = new Swiper(slider.querySelector('.swiper'), {
            observer: true,
            observeParents: true,
            slidesPerView: 1,
            spaceBetween: 16,
            speed: 500,
            watchSlidesProgress: true,
            autoHeight:true,
            navigation: {
                nextEl: slider.querySelector('.btn-left'),
                prevEl: slider.querySelector('.btn-right'),
            },
            pagination: {
                el: slider.querySelector('.pagination'),
                clickable: true
            }
        })
    }
}
  {
    const sliders = document.querySelectorAll('[data-slider="catalog-banner"]');
    sliders.forEach(slider => {
        let options = {
            observer: true,
            observeParents: true,
            speed: 500,
            watchSlidesProgress: true,
            autoHeight: true,
            autoplay: {
                delay: 3000
            },
            breakpoints: {
                0: {
                    slidesPerView: 1,
                    spaceBetween: 16,
                },
                1024: {
                    slidesPerView: 1,
                    spaceBetween: 40,
                }
            }
        }

        const btnLeft =  slider.querySelector('.btn-left');
        const btnRight = slider.querySelector('.btn-right');
        const pagination = slider.querySelector('.pagination');

        if(btnLeft && btnRight) {
            options = {
                ...options,
                navigation: {
                    nextEl: btnLeft,
                    prevEl: btnRight,
                },
            }
        }

        if(pagination) {
            options = {
                ...options,
                pagination: {
                    el: pagination,
                    clickable: true
                },
            }
        }

        const swiper = new Swiper(
            slider.classList.contains('swiper') ? slider : slider.querySelector('.swiper'), 
            options
        );
    })
}
  {
    const checkoutSteps = document.querySelector('[data-checkout-steps]');
    if(checkoutSteps) {
        const buttonsNext = checkoutSteps.querySelectorAll('[data-action="next-screen"]');
        const buttonsPrev = checkoutSteps.querySelectorAll('[data-action="prev-screen"]');

        const screens = Array.from(checkoutSteps.children);

        const nextScreen = () => {
            const activeScreen = screens.find(s => s.classList.contains('active'));
            const nextScreen = activeScreen.nextElementSibling;
            if(!nextScreen) return;
            screens.forEach(s => {
                if(s === nextScreen) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            })
        }
        const prevScreen = () => {
            const activeScreen = screens.find(s => s.classList.contains('active'));
            const prevScreen = activeScreen.previousElementSibling;
            if(!prevScreen) return;
            screens.forEach(s => {
                if(s === prevScreen) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            })
        }
        const toScreen = (index) => {
            screens.forEach((s, i) => {
                if(i == index) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            })
        }

        checkoutSteps.steps = {
            next: () => {
                nextScreen();
            },
            prev: () => {
                prevScreen();
            },
            to: (index) => {
                toScreen(index);
            }
        }

        const stepsNav = document.querySelector('[data-steps-nav]');
        if(stepsNav) {
            const navItems = Array.from(stepsNav.children).filter(st => st.classList.contains('step-van-item'));
            navItems.forEach((navItem, index) => {

                navItem.addEventListener('click', () => {

                    navItem.classList.add('active');
                    navItems.forEach(ni => {
                        if(ni === navItem) return;
                        ni.classList.remove('active');
                    })
                    toScreen(index);
                })
            })

            const setNavAsActive = (index) => {
                navItems.forEach((ni, i) => {
                    if(i == index) {
                        ni.classList.add('active');
                    } else {
                        ni.classList.remove('active');
                    }
                })
            }

            checkoutSteps.steps = {
                next: () => {
                    nextScreen();
                    const index = screens.findIndex(s => s.classList.contains('active'));
                    setNavAsActive(index);
                },
                prev: () => {
                    prevScreen();
                    const index = screens.findIndex(s => s.classList.contains('active'));
                    setNavAsActive(index);
                },
                to: (index) => {
                    toScreen(index);
                    setNavAsActive(index);
                }
            }
        }

        checkoutSteps.addEventListener('click', (e) => {
            if(e.target.closest('[data-action="submit"]')) {
                if(!checkValidation(e.target.closest('.checkout-step'))) e.preventDefault();
            }

            if(e.target.closest('[data-action="to-screen"]')) {
                e.preventDefault();
                checkoutSteps.steps.to(e.target.getAttribute('data-index'));
            }
            if(e.target.closest('[data-action="next-screen"]')) {
                e.preventDefault();
                
                if(checkValidation(e.target.closest('.checkout-step'))) {
                    checkoutSteps.steps.next();
                }
            }
            if(e.target.closest('[data-action="prev-screen"]')) {
                e.preventDefault();
                checkoutSteps.steps.prev();
            }
        })
    }
}
  {
    const influencerHeadSection = document.querySelector('[data-influencer]');
    if(influencerHeadSection) {
        videoPlugin.addObserver(influencerHeadSection, () => {
            const loaders = influencerHeadSection.querySelectorAll('[data-video-cards]~.cover-loader, [data-video-triggers]>.cover-loader');
            const storiesButtons = influencerHeadSection.querySelectorAll('[data-action="to-video-by-index"]');
            const videosCardContainer = influencerHeadSection.querySelector('[data-video-cards]');
            const videosCard = new VideosCard(videosCardContainer);
            videosCard.startVideoByIndex(0);
    
            storiesButtons.forEach(storiesButton => {
                storiesButton.addEventListener('click', () => {
                    videosCard?.swiper.slideTo(storiesButton.getAttribute('data-index'), 300);
                })
            })

            loaders.forEach(l => l.classList.remove('active'));
        });
    }
}
  {
    const videoSlider = document.querySelector('[data-slider="video-slider"]');
    if(videoSlider) {
        const swiper = new Swiper(videoSlider, {
            observer: true,
            observeParents: true,
            speed: 500,
            watchSlidesProgress: true,
            navigation: {
                nextEl: videoSlider.querySelector('.btn-left'),
                prevEl: videoSlider.querySelector('.btn-right'),
            },
            breakpoints: {
                0: {
                    slidesPerView: 'auto',
                    spaceBetween: 12,
                    freeMode: true,
                    centeredSlides: true,
                    loop: true,
                },
                768: {
                    slidesPerView: 'auto',
                    spaceBetween: 12,
                    freeMode: true,
                    centeredSlides: false,
                    loop: false,
                },
                1024: {
                    slidesPerView: 4,
                    spaceBetween: 17.5,
                    freeMode: false,
                    centeredSlides: false,
                    loop: false,
                },
                1280: {
                    slidesPerView: 5,
                    spaceBetween: 17.5,
                    freeMode: false,
                    centeredSlides: false,
                    loop: false,
                }
            },
        })
    }

    const videoSliderContainer = document.querySelector('[data-video-slider]');
    if(videoSliderContainer) {
        
        videoPlugin.addObserver(videoSliderContainer, () => {
            skipEventBySelectors.add('[data-video-slider]');
            const loader = videoSliderContainer.querySelector('.cover-loader');
            const stickyBoxContainer = videoSliderContainer.querySelector('[data-video-sticky-box]');
            const stickyBox = stickyBoxContainer.stickyBox = new VideoStickyBox(stickyBoxContainer);
            const allStickyBoxContainersOnPage = document.querySelectorAll('[data-video-sticky-box]');

            const triggers = videoSliderContainer.querySelectorAll('[data-action="show-video-by-index"]');
            triggers.forEach(trigger => {
                trigger.addEventListener('click', () => {
                    stickyBox.show(trigger.getAttribute('data-index'));

                    allStickyBoxContainersOnPage.forEach(container => {
                        if(container === stickyBoxContainer) return;
                        container?.stickyBox.hide();
                    })
                })
            })

            loader.classList.remove('active');
        });
    }
}
  {
    const formQuizContainers = document.querySelectorAll('[data-quiz="form-quiz"]');
    formQuizContainers.forEach(formQuiz => {
        const quiz = formQuiz.quiz;
        const formNav = formQuiz.querySelector('[data-form-nav]');
    
        if(quiz && formNav) {
            const swiper = quiz.swiper;
            const navItems = Array.from(formNav.children).filter(i => !i.classList.contains('line'));
    
            swiper.on('realIndexChange', (swiper) => {
                setActiveNavItem(swiper.activeIndex);
            })
    
            function setActiveNavItem(activeIndex) {
                navItems.forEach((item, index) => {
                    if(index == activeIndex) {
                        item.classList.add('active');
                    } else if(index < activeIndex) {
                        item.classList.add('passed');
                        item.classList.remove('active');
                    } else {
                        item.classList.remove('active');
                        item.classList.remove('passed');
                    }
                })
            }
        }

    });
}
  
  // ==== // sections =====================================================

  document.body.classList.add('page-loaded');
}); 
