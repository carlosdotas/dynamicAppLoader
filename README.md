
# Dynamic App Loader

Dynamic App Loader é uma biblioteca JavaScript que permite carregar dinamicamente módulos e recursos (scripts e estilos) em uma aplicação web.

## Características

- Carregamento dinâmico de módulos a partir de URLs.
- Suporte para definir título, ícone e conteúdo da página.
- Carregamento e aplicação de estilos e scripts.
- Monitoramento de mudanças na hash da URL para carregamento de módulos.
- Armazenamento de parâmetros da URL.

## Instalação

Para usar o Dynamic App Loader, basta incluir o script em seu projeto:

```html
<script src="path/to/dynamicAppLoader.js"></script>
```

## Uso

### Inicialização

Para inicializar a biblioteca, você pode chamar a função `$.apps` com as opções desejadas:

```javascript
$(document).ready(function() {
    $.apps({
        title: 'Minha Aplicação',
        description: 'Descrição da minha aplicação',
        version: '1.0.0',
        author: 'Seu Nome',
        url: 'https://example.com',
        license: 'MIT',
        icon: 'path/to/favicon.ico',
        content: '<h1>Bem-vindo à Minha Aplicação</h1>',
        metas: [
            { name: 'viewport', content: 'width=device-width, initial-scale=1' }
        ],
        style: [
            'body { font-family: Arial, sans-serif; }'
        ],
        filesScript: [
            'path/to/script1.js',
            { url: 'path/to/script2.js', async: true }
        ],
        filesStylesheets: [
            'path/to/styles.css'
        ],
        onLoad: function() {
            console.log('Recursos carregados!');
        }
    });
});
```

### Métodos

#### `init()`
Inicializa a aplicação carregando configurações e recursos.

#### `applySettings()`
Aplica as configurações iniciais, como título, ícone e conteúdo.

#### `setTitle(title)`
Define o título da página.
- `title` (string): Título da página.

#### `setIcon(icon)`
Define o ícone da página.
- `icon` (string): URL do ícone.

#### `setContent(content, parent)`
Define o conteúdo da página.
- `content` (string): Conteúdo HTML a ser inserido.
- `parent` (string|jQuery object, opcional): Seletor ou objeto jQuery do elemento pai onde o conteúdo será inserido.

#### `addContent(content, parent)`
Adiciona conteúdo à página.
- `content` (string): Conteúdo HTML a ser inserido.
- `parent` (string|jQuery object, opcional): Seletor ou objeto jQuery do elemento pai onde o conteúdo será adicionado.

#### `addModulo(url, parent)`
Adiciona um módulo à página.
- `url` (string): URL do módulo a ser carregado.
- `parent` (string|jQuery object, opcional): Seletor ou objeto jQuery do elemento pai onde o módulo será inserido.

#### `checkUrlForModule()`
Verifica a URL para módulos e os carrega se necessário.

#### `monitorHashChange()`
Monitora mudanças na hash da URL para carregamento de módulos.

#### `addMetaTags()`
Adiciona meta tags à página com base nas configurações.

#### `addInlineStyles()`
Adiciona estilos inline à página com base nas configurações.

#### `addStyle(style)`
Adiciona um estilo inline à página.
- `style` (string): Estilo CSS a ser adicionado.

#### `addTagToHead(tag)`
Adiciona uma tag ao elemento `<head>` da página.
- `tag` (string): Tag HTML a ser adicionada.

#### `loadResources(callback)`
Carrega recursos (scripts e estilos) e executa um callback quando todos forem carregados.
- `callback` (function): Função a ser executada após o carregamento dos recursos.

#### `resourceLoaded()`
Incrementa o contador de recursos carregados e executa a função `onLoad` quando todos os recursos forem carregados.

#### `loadStylesheet(url)`
Carrega uma folha de estilos.
- `url` (string): URL da folha de estilos.

#### `loadScript(url, options)`
Carrega um script.
- `url` (string): URL do script.
- `options` (object, opcional): Opções adicionais para o script (e.g., `async`, `defer`, `callback`, `callbackFunction`).

#### `addStylesheet(url)`
Adiciona uma folha de estilos à página.
- `url` (string): URL da folha de estilos.

#### `addScript(url, options)`
Adiciona um script à página.
- `url` (string): URL do script.
- `options` (object, opcional): Opções adicionais para o script (e.g., `async`, `defer`, `callback`, `callbackFunction`).

#### `getUrlParams()`
Obtém os parâmetros da URL.
- Retorna um objeto com os parâmetros da URL.

## Parâmetros de Configuração

- `title` (string): Título da página.
- `description` (string): Descrição da aplicação.
- `version` (string): Versão da aplicação.
- `author` (string): Autor da aplicação.
- `url` (string): URL da aplicação.
- `license` (string): Licença da aplicação.
- `icon` (string): URL do ícone da página.
- `content` (string): Conteúdo HTML inicial da página.
- `metas` (array): Meta tags para a página.
  - Cada meta tag deve ser um objeto com propriedades `name` e `content`.
- `style` (array): Estilos CSS inline para a página.
  - Cada estilo deve ser uma string.
- `filesScript` (array): URLs de scripts a serem carregados.
  - Cada script pode ser uma string (URL) ou um objeto com propriedades `url`, `async`, `defer`, `callback`, e `callbackFunction`.
- `filesStylesheets` (array): URLs de folhas de estilos a serem carregadas.
- `onLoad` (function): Função a ser executada após o carregamento de todos os recursos.

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Autor

Desenvolvido por Seu Nome. Você pode me contatar em seu.email@example.com.
