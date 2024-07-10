(function($) {
    class Apps {
        constructor(options) {
            this.settings = $.extend({
                title: '',
                description: '',
                version: '',
                author: '',
                url: '',
                license: '',
                icon: '', // Adicionado o parâmetro icon
                content: '', // Adicionado o parâmetro content
                metas: [],
                style: [],
                filesScript: [],
                modules: {},
                filesStylesheets: [],
                onLoad: () => {}
            }, options);
            this.resourcesLoaded = 0;
            this.totalResources = this.settings.filesScript.length + this.settings.filesStylesheets.length;
            this.urlParams = {}; // Armazenar os parâmetros da URL
        }

        init() {
            $(document).ready(() => {
                this.applySettings();
                this.loadResources(() => {
                    this.settings.onLoad();
                    this.checkUrlForModule(); // Verificar a URL para o módulo após carregar os recursos
                    this.monitorHashChange(); // Monitorar mudanças na hash da URL
                });
            });
        }

        applySettings() {
            this.setTitle(this.settings.title);
            this.addMetaTags();
            this.addInlineStyles();
            this.setIcon(this.settings.icon); // Adicionado para definir o ícone
            this.setContent(this.settings.content); // Adicionado para definir o conteúdo
        }

        setTitle(title) {
            if (title) {
                document.title = title;
            }
        }

        setIcon(icon) {
            if (icon) {
                this.addTagToHead(`<link rel="icon" href="${icon}" type="image/x-icon">`);
            }
        }

        setContent(content, parent) {
            let parentElement;

            if (parent) {
                if (typeof parent === 'string') {
                    parentElement = $(parent);
                } else if (parent instanceof jQuery) {
                    parentElement = parent;
                }
            } else {
                parentElement = $('body');
            }

            if (parentElement && parentElement.length) {
                parentElement.html(content);
            } else {
                $('body').html(content);
            }
        }

        addContent(content, parent) {
            let component = $(content);
            let parentElement;

            if (parent) {
                if (typeof parent === 'string') {
                    parentElement = $(parent);
                } else if (parent instanceof jQuery) {
                    parentElement = parent;
                }
            } else {
                parentElement = $('body');
            }

            if (parentElement && parentElement.length) {
                parentElement.append(component);
            } else {
                $('body').append(component);
            }

            return component;
        }

        addModulo(url, parent) {
            if (url) {
                $.get(url, (data) => {
                    const tempDiv = $('<div>').html(data);
                    const scripts = tempDiv.find('script').remove();
                    const content = tempDiv.html();

                    this.addContent(content, parent);

                    scripts.each((index, script) => {
                        const scriptTag = document.createElement('script');
                        scriptTag.type = 'text/javascript';
                        if (script.src) {
                            scriptTag.src = script.src;
                        } else {
                            scriptTag.textContent = $(script).text();
                        }
                        document.body.appendChild(scriptTag);
                    });
                });
            }
        }

        checkUrlForModule() {
            const urlParams = new URLSearchParams(window.location.hash.slice(1));
            const moduloUrl = urlParams.get('modulo');

            if (moduloUrl) {
                this.addModulo(moduloUrl);
            }
        }

        monitorHashChange() {
            window.addEventListener('hashchange', () => {
                this.checkUrlForModule();
            });
        }

        addMetaTags() {
            this.settings.metas.forEach(({ name, content }) => {
                this.addTagToHead(`<meta name="${name}" content="${content}">`);
            });
        }

        addInlineStyles() {
            this.settings.style.forEach(style => {
                this.addTagToHead(`<style>${style}</style>`);
            });
        }

        addStyle(style) {
            if (style) {
                this.addTagToHead(`<style>${style}</style>`);
                this.settings.style.push(style);
            }
        }

        addTagToHead(tag) {
            $('head').append(tag);
        }

        loadResources(callback) {
            const { filesStylesheets, filesScript } = this.settings;

            filesStylesheets.forEach(url => this.loadStylesheet(url));
            filesScript.forEach(script => {
                if (typeof script === 'string') {
                    this.loadScript(script);
                } else {
                    this.loadScript(script.url, script);
                }
            });

            if (this.totalResources === 0) {
                callback();
            }
        }

        resourceLoaded() {
            this.resourcesLoaded++;
            if (this.resourcesLoaded === this.totalResources) {
                this.settings.onLoad();
            }
        }

        loadStylesheet(url) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;
            link.onload = () => this.resourceLoaded();
            document.head.appendChild(link);
            this.settings.filesStylesheets.push(url);
        }

        loadScript(url, options = {}) {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;
            script.onload = () => this.resourceLoaded();

            if (options.defer) {
                script.defer = true;
            }

            if (options.async) {
                script.async = true;
            }

            if (options.callback && options.callbackFunction) {
                window[options.callback] = options.callbackFunction;
            }

            document.head.appendChild(script);
            this.settings.filesScript.push(url);
        }

        addStylesheet(url) {
            this.loadStylesheet(url);
        }

        addScript(url, options = {}) {
            this.loadScript(url, options);
        }

        // Novo método para obter os parâmetros da URL
        getUrlParams() {
            return this.urlParams;
        }
    }

    $.apps = function(methodOrOptions, ...params) {
        let app = $(document).data('appInstance');

        if (!app) {
            const options = typeof methodOrOptions === 'object' ? methodOrOptions : {};
            app = new Apps(options);
            $(document).data('appInstance', app);
            app.init();
        }

        if (typeof methodOrOptions === 'string' && typeof app[methodOrOptions] === 'function') {
            return app[methodOrOptions](...params);
        }
    };

    // Adicionar a função loadDialogFromHash
    function loadDialogFromHash() {
        const hash = window.location.hash;
        const href = decodeURIComponent(hash.substring(1).replace('modulo=', '')); // Remove # do início e 'modulo='

        const params = getQueryParams(href.split('>')[0]); // Obter os parâmetros antes de separar o componente pai
        const [url, parent] = href.split('>'); // Separar URL e seletor do componente pai

        if (url) {
            const app = $(document).data('appInstance');
            if (app) {
                app.urlParams = params; // Armazenar os parâmetros da URL
                app.addModulo(url.split('?')[0], parent ? `#${decodeURIComponent(parent)}` : undefined); // Decodificar e passar o seletor do componente pai

                // Remover o hash da URL
                history.replaceState(null, null, ' ');
            }
        }
    }

    function getQueryParams(url) {
        const params = {};

        const queryString = url.split('?')[1];
        if (queryString) {
            queryString.split('&').forEach(param => {
                const [key, value] = param.split('=');
                params[key] = decodeURIComponent(value);
            });
        }
        return params;
    }

    // Adicionar listeners para load e hashchange
    window.addEventListener('load', loadDialogFromHash);
    window.addEventListener('hashchange', loadDialogFromHash);

})(jQuery);
