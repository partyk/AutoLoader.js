class AutoLoader {
    constructor(options = {}) {
        this.options = Object.assign({
            attributeName: 'data-load-module', // nazev attributu
            classPreloaderLoading: 'preloader--loading',
            classPreloaderLoaded: 'preloader--loaded',
            wrapper: global.document,
            selector: '.js-auto-loader',
            hasAttribute: false, // false - vypnuto,  {name: 'data-load-module-admin', value: 'local'}
            hasAttributeSkip: false, // true - pokud má modul nastavený hasAttribute a je schoda, tak se modul přeskakuje
            loadModuleName: (moduleName) => {
                // Example promise
                // return import(/* webpackChunkName: "[request]" */ './' + moduleName + '.loader')
            },
            prefixConsole: 'Front',
        }, options);
    }

    load() {
        const nodeList = [...this.options.wrapper.querySelectorAll(this.options.selector)];
        if (!nodeList.length) {
            return;
        }
        nodeList.forEach(element => this.loadElement(element));
    }

    /**
     * @param element {HTMLElement}
     */
    loadElement(element) {
        let timeout = null;
        try {
            // lazyloading
            if (element.dataset.loadType === 'lazy' && 'IntersectionObserver' in window) {
                if (element.dataset.loadDelay) {
                    timeout = setTimeout(() => {
                        this.loadModule(element);
                    }, Number(element.dataset.loadDelay) * 1000);
                }
                const observer = new IntersectionObserver((entries, observer) => {
                    if (entries[0].isIntersecting) {
                        clearTimeout(timeout);
                        this.loadModule(element);
                        observer.unobserve(entries[0].target);
                    }
                });
                observer.observe(element);
            } else {
                if (element.dataset.loadDelay) {
                    timeout = setTimeout(() => {
                        this.loadModule(element);
                    }, Number(element.dataset.loadDelay) * 1000);
                } else {
                    this.loadModule(element);
                }
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * @param element {HTMLElement}
     */
    loadModule(element) {
        const moduleName = element.getAttribute(this.options.attributeName);
        if (element.hasAttribute(`${this.options.attributeName}-skip`)) {
            // console.debug(`${this.options.prefixConsole}: Module is skip`, moduleName);
            return;
        }
        // pokud je nastavené hasAttribute
        if (this.options.hasAttribute) {
            if (element.getAttribute(this.options.hasAttribute.name) === this.options.hasAttribute.value) {
                if (this.options.hasAttributeSkip) {
                    // console.debug(`${this.options.prefixConsole}: Module is skip, has data attribute [${this.options.hasAttribute.name}=${this.options.hasAttribute.value}]`, moduleName);
                    return;
                }
            } else {
                if (!this.options.hasAttributeSkip) {
                    // console.debug(`${this.options.prefixConsole}: Module is skip, hasn't data attribute ${this.options.hasAttribute.name}=${this.options.hasAttribute.value}`, moduleName);
                    return;
                }
            }
        }
        if (element.getAttribute(`${this.options.attributeName}-active`)) {
            // console.debug(`${this.options.prefixConsole}: Module is active`, moduleName);
            return;
        }

        if (!moduleName) {
            throw new Error(`${this.options.prefixConsole}: missing data attribute data-load-module in element`);
        }
        moduleName.split(',').forEach(moduleName => {
            this.loadModuleName(element, moduleName.trim());
        });
    }

    /**
     * @param element {HTMLElement}
     * @param moduleName {string}
     */
    loadModuleName(element, moduleName) {
        element.setAttribute(`${this.options.attributeName}-active`, true);
        this.options.loadModuleName(moduleName)
            .then(module => {
                module.default(element);
            })
            .finally(() => {
                // console.debug(`${this.options.prefixConsole}: Load module`, moduleName);
                element.classList.remove(this.options.classPreloaderLoading);
                if (this.options.classPreloaderLoaded) {
                    element.classList.add(this.options.classPreloaderLoaded);
                }
            });
    }
};

export default AutoLoader;
