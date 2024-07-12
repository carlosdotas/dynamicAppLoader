(function($) {
    class Apps {
        constructor(options) {
            this.settings = $.extend({
                title: '',
                description: '',
                version: '',
                author: '',
                url: '',
                homePage:'#modulos/home/index.html',
                license: '',
                icon: '', // Adicionado o parâmetro icon
                content: '', // Adicionado o parâmetro content
                metas: [],
                style: [],
                filesScript: [],
                modules: {},
                filesStylesheets: [],
                onLoad: () => {},
                loadingShow: () => {},
                loadingHidden: () => {},
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

                // Garantir que o namespace easyui existe
                const homePage = this.settings.homePage; 

                this.waitForFunction('dialog',function() {
                     window.location.href = homePage; 
                })

            });
        }

        getApp() {
            return this.settings;
        }

        options(options) {

            this.settings.modules[options.id] = {...this.settings.modules[options.id],...options};

            const $component = this.settings.modules[options.id].component;

            if (typeof options.onLoad === 'function') {
                options.onLoad(this.settings.modules[options.id]);
            }

            const addEventListeners = (actions, selectorModifier = '', preventDefault = false) => {
                if (Array.isArray(actions)) {
                    actions.forEach(action => {
                        Object.keys(action).forEach(key => {
                            const match = key.match(/\[(.*?)\]/);
                            if (match && typeof action[key] === 'function') {
                                const eventType = match[1];
                                const selector = key.replace(match[0], '');
                                // Adicionando o evento ao componente com event delegation
                                $($component).on(eventType, selector + selectorModifier, function(event) {
                                    if (preventDefault) event.preventDefault();
                                    action[key].call(this, event);
                                });
                            }
                        });
                    });
                }
            };

            // Lista de todos os eventos possíveis
            const allEvents = [
                // Eventos do mouse
                'click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mousemove', 'mouseout',
                'mouseenter', 'mouseleave', 'contextmenu',

                // Eventos de teclado
                'keydown', 'keypress', 'keyup',

                // Eventos de formulário
                'focus', 'blur', 'change', 'input', 'submit', 'reset',

                // Eventos de janela/documento
                'load', 'unload', 'beforeunload', 'resize', 'scroll', 'hashchange', 'popstate',

                // Eventos de mídia
                'abort', 'canplay', 'canplaythrough', 'durationchange', 'emptied', 'ended', 'error',
                'loadeddata', 'loadedmetadata', 'loadstart', 'pause', 'play', 'playing', 'progress',
                'ratechange', 'seeked', 'seeking', 'stalled', 'suspend', 'timeupdate', 'volumechange', 'waiting',

                // Eventos de drag & drop
                'drag', 'dragend', 'dragenter', 'dragleave', 'dragover', 'dragstart', 'drop',

                // Eventos de seleção
                'select',

                // Eventos de toque
                'touchstart', 'touchmove', 'touchend', 'touchcancel',

                // Eventos de ponteiro
                'pointerdown', 'pointerup', 'pointermove', 'pointerover', 'pointerout', 'pointerenter',
                'pointerleave', 'pointercancel',

                // Outros eventos
                'animationstart', 'animationend', 'animationiteration', 'transitionstart', 'transitionend',
                'transitionrun', 'transitioncancel'
            ];

            // Adicionando os event listeners
            addEventListeners(options.onClick, '$component.find');
            addEventListeners(options.onKeyPress, '', true);
            addEventListeners(options.events); 
        }

        getModule(key) {
            return this.settings.modules[key];
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

        addContent(content, parent, url) {


            var component = $(content);
            var parentElement;

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

            //component.attr("id", url);


            this.settings.modules[url] = { url: url, component: component };
            return component;
        }


        addModulo(url, parent) {
            if (url) {             
                this.settings.loadingShow();   
                $.get(url)
                    .done((data) => {
                        this.settings.loadingHidden();
                        const tempDiv = $('<div>').html(data);
                        const scripts = tempDiv.find('script').remove();
                        const content = tempDiv.html();
  

                        const textContent = $(scripts[0]).text();
                        const idMatch = textContent.match(/id:\s*'([^']+)'/);
                        const idModule = idMatch ? idMatch[1] : 'null';

                        if(!idModule){
                            idModule = 'dialog_'+Math.floor(Math.random() * 10);
                            this.settings.modules;
                        }
                      

                        if(idModule)this.settings.modules[idModule] = {}  



                        this.addContent(content, parent, idModule);



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


                    })
                    .fail(() => {
                        this.settings.loadingHidden();
                        console.error('Erro: não foi possível carregar o arquivo:', url);
                        alert('Erro: não foi possível carregar o arquivo: ' + url);
                    });
            }
        }

        monitorHashChange() {
            window.addEventListener('hashchange', () => {

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

        GET() {
            return this.urlParams;
        }

        waitForFunction(funcao,callback) {
            const intervalId = setInterval(() => {
                if (typeof window.$.fn[funcao] === 'function') {
                    clearInterval(intervalId);
                    callback();
                }
            }, 10); // Verifica a cada 100ms
        };
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
