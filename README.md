
# Dynamic App Loader

Este repositório contém o código para o `dynamicAppLoader.js`, um carregador de aplicativos dinâmico baseado em jQuery. Este script permite carregar módulos de forma dinâmica, monitorar mudanças na URL e gerenciar recursos como scripts e folhas de estilo.

## Funcionalidades

### Novas Funcionalidades Adicionadas
- **Ícone e Conteúdo Dinâmico**: Parâmetros `icon` e `content` foram adicionados para definir o ícone do site e o conteúdo dinâmico de uma página.
- **Monitoramento de Criação de Diálogo**: Uma nova função `monitorDialogCreation` foi adicionada para monitorar a criação de `window.$.fn.dialog`.
- **Monitoramento de Mudanças na URL**: Função `monitorHashChange` monitora mudanças na hash da URL.
- **Carregamento Dinâmico de Módulos**: Função `addModulo` para carregar módulos dinâmicos a partir de URLs.

## Uso

### Inicialização
Para iniciar o aplicativo, basta chamar a função `$.apps` com as opções desejadas:

```javascript
$(document).ready(function() {
    $.apps({
        title: 'Meu Aplicativo',
        description: 'Descrição do meu aplicativo',
        version: '1.0.0',
        author: 'Autor do Aplicativo',
        url: 'URL do Aplicativo',
        homePage: '#modulos/home/index.html',
        license: 'Licença do Aplicativo',
        icon: 'path/to/icon.ico',
        content: '<h1>Bem-vindo ao Meu Aplicativo</h1>',
        metas: [
            { name: 'viewport', content: 'width=device-width, initial-scale=1' }
        ],
        style: [
            'body { background-color: #f0f0f0; }'
        ],
        filesScript: [
            'path/to/script.js'
        ],
        modules: {},
        filesStylesheets: [
            'path/to/stylesheet.css'
        ],
        onLoad: function() {
            console.log('Aplicativo carregado com sucesso!');
        }
    });
});
```

### Métodos

#### `getApp()`
Retorna as configurações atuais do aplicativo.

#### `options(key, options)`
Atualiza as opções de um módulo específico.

**Parâmetros:**
- `key` (string): O nome do módulo.
- `options` (object): As novas opções para o módulo.

#### `getModule(key)`
Retorna as configurações de um módulo específico.

**Parâmetros:**
- `key` (string): O nome do módulo.

#### `setTitle(title)`
Define o título da página.

**Parâmetros:**
- `title` (string): O novo título da página.

#### `setIcon(icon)`
Define o ícone do site.

**Parâmetros:**
- `icon` (string): O caminho para o ícone.

#### `setContent(content, parent)`
Define o conteúdo dinâmico da página.

**Parâmetros:**
- `content` (string): O novo conteúdo da página.
- `parent` (string|jQuery): O elemento pai onde o conteúdo será inserido (opcional).

#### `addContent(content, parent, url)`
Adiciona conteúdo dinâmico à página.

**Parâmetros:**
- `content` (string): O conteúdo a ser adicionado.
- `parent` (string|jQuery): O elemento pai onde o conteúdo será inserido (opcional).
- `url` (string): A URL do módulo.

#### `addModulo(url, parent)`
Carrega um módulo a partir de uma URL e o adiciona à página.

**Parâmetros:**
- `url` (string): A URL do módulo.
- `parent` (string|jQuery): O elemento pai onde o módulo será inserido (opcional).

### Monitoramento de Mudanças na URL
O script monitora mudanças na hash da URL e carrega módulos dinamicamente quando detecta mudanças.

### Carregamento de Recursos
Carrega dinamicamente scripts e folhas de estilo definidos nas configurações.

#### `loadResources(callback)`
Carrega todos os recursos (scripts e folhas de estilo) definidos nas configurações e chama o callback após o carregamento.

**Parâmetros:**
- `callback` (function): A função a ser chamada após o carregamento de todos os recursos.

#### `resourceLoaded()`
Atualiza o contador de recursos carregados e verifica se todos os recursos foram carregados.

#### `loadStylesheet(url)`
Carrega uma folha de estilo a partir da URL fornecida.

**Parâmetros:**
- `url` (string): A URL da folha de estilo.

#### `loadScript(url, options)`
Carrega um script a partir da URL fornecida com opções adicionais.

**Parâmetros:**
- `url` (string): A URL do script.
- `options` (object): Opções adicionais para o carregamento do script (opcional).

#### `addStylesheet(url)`
Adiciona uma folha de estilo ao carregador.

**Parâmetros:**
- `url` (string): A URL da folha de estilo.

#### `addScript(url, options)`
Adiciona um script ao carregador.

**Parâmetros:**
- `url` (string): A URL do script.
- `options` (object): Opções adicionais para o carregamento do script (opcional).

### Manipulação de URL e Parâmetros

#### `GET()`
Retorna os parâmetros da URL.

### Eventos de Carregamento e Mudança de Hash
O script adiciona listeners para os eventos de carregamento da página e mudanças na hash da URL para carregar dinamicamente módulos com base na URL.

### Carregamento de Módulos
Ao ler o módulo, ele carrega os seguintes parâmetros:
```javascript
$.apps('options', 'modulos/home/index.html', {
    title: 'titulo',
    width: 400,
    height: 200,
    closed: false,
    cache: false,
    modal: true,
    onOpen: function() {
        // Ações a serem executadas na abertura do módulo
    },
    onLoad: function(data) {
        data.component.dialog({
            title: $.apps('GET').text
        });
    }
});
```

## Opções

O método `options` permite configurar várias definições para sua aplicação ou módulo. Abaixo estão as opções disponíveis e suas descrições:

- **`id`**: (string) Um identificador único para o módulo.
- **`title`**: (string) O título do módulo.
- **`fit`**: (boolean) Se verdadeiro, o módulo se ajustará para caber no contêiner.
- **`closed`**: (boolean) Se falso, o módulo estará aberto por padrão.
- **`cache`**: (boolean) Se falso, o módulo não será armazenado em cache.
- **`modal`**: (boolean) Se verdadeiro, o módulo será modal.
- **`icon`**: (string) Especifica o ícone para o módulo. *(Novo)*
- **`content`**: (string) Define o conteúdo HTML inicial para o módulo. *(Novo)*
- **`events`**: (array) Define uma lista de eventos a serem vinculados aos elementos especificados.
- **`onOpen`**: (function) Uma função de callback a ser executada quando o módulo for aberto.
- **`onLoad`**: (function) Uma função de callback a ser executada quando o módulo for carregado.
- **`onClick`**: (array) Define eventos de clique para elementos específicos. *(Novo)*
- **`onKeyPress`**: (array) Define eventos de tecla pressionada para elementos específicos. *(Novo)*

### Exemplo

```javascript
$.apps('options', {
    id: 'encomendasList',
    title: '<i class="fas fa-map-marker-alt"></i> Lista de Encomendas',
    fit: true,
    closed: false,
    cache: false,
    modal: true,
    icon: 'path/to/icon.png',
    content: '<div>Conteúdo Inicial</div>',
    events: [
        {
            '.bntDel[contextmenu]': function(data) {
                alert('Botão Delete clicado com botão direito');
            }
        },
    ],
    onOpen: function() {
        $.parser.parse();
    },
    onLoad: function(data) {
        data.component.dialog(data);

        $.apps('waitForFunction', 'dataGridHandler', function() {
            $(data.component).find('.dataGridEncomendas').dataGridHandler('server/encomendas/index.php?list=encomendas');
        });
    },
    onClick: [
        {
            '.saveBtn[click]': function() {
                alert('Botão Salvar clicado');
            }
        }
    ],
    onKeyPress: [
        {
            'input[type="text"][keypress]': function(event) {
                if (event.key === 'Enter') {
                    alert('Enter pressionado');
                }
            }
        }
    ]
});
```


## Exemplo Completo

Aqui está um exemplo completo demonstrando como usar o `ContentLoader` e o método `options` juntos:

```javascript
$(document).ready(function() {
    const contentLoader = new ContentLoader(window.location.href);
    contentLoader.initializeMethods();

    $.apps('options', {
        id: 'encomendasList',
        title: '<i class="fas fa-map-marker-alt"></i> Lista de Encomendas',
        fit: true,
        closed: false,
        cache: false,
        modal: true,
        icon: 'path/to/icon.png',
        content: '<div>Conteúdo Inicial</div>',
        events: [
            {
                '.bntDel[contextmenu]': function(data) {
                    alert('Botão Delete clicado com botão direito');
                }
            },
        ],
        onOpen: function() {
            $.parser.parse();
        },
        onLoad: function(data) {
            data.component.dialog(data);

            $.apps('waitForFunction', 'dataGridHandler', function() {
                $(data.component).find('.dataGridEncomendas').dataGridHandler('server/encomendas/index.php?list=encomendas');
            });
        },
        onClick: [
            {
                '.saveBtn[click]': function() {
                    alert('Botão Salvar clicado');
                }
            }
        ],
        onKeyPress: [
            {
                'input[type="text"][keypress]': function(event) {
                    if (event.key === 'Enter') {
                        alert('Enter pressionado');
                    }
                }
            }
        ]
    });
});
```



## Licença
Este projeto está licenciado sob a [MIT License](LICENSE).

## Contribuições
Contribuições são bem-vindas! Por favor, envie um pull request ou abra uma issue para discutir mudanças.
