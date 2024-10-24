# AutoLoader.js

AutoLoader is a tool for dynamically loading JavaScript modules in an application.

## Installation

```bash
npm install @partyk/autoloader.js
```

## Usage

### JavaScript

Basic usage of AutoLoader in JavaScript looks like this:

```javascript
import AutoLoader from '@partyk/autoloader.js';

export default (wrapper = global.document, selector = '.js-auto-loader') => {
    const loader = new AutoLoader({
        wrapper,
        selector,
        prefixConsole: 'Admin',
        loadModuleName: (moduleName) => import(/* webpackChunkName: "[request]" */ './' + moduleName + '.loader'),
    });

    loader.load();
};
```

### HTML

In the HTML structure, mark elements that should be loaded as modules using the corresponding class and data attribute:

```html
<div
    class="js-auto-loader"
    data-load-module="components/calendar"
    data-load-type="lazy"
>
</div>
```

- The `js-auto-loader` class corresponds to the default selector in the AutoLoader configuration.
- The `data-load-module` attribute specifies the path to the module that should be loaded for this element.
- The `data-load-type="lazy"` attribute controls the loading behavior. When set to "lazy", the HTML element will only be loaded when it becomes visible in the viewport.
- The `data-load-delay="10"` attribute specifies a delay in seconds before the module is loaded.


## Configuration

AutoLoader supports the following configuration parameters:

| Parameter | Type | Default Value | Description |
|-----------|------|---------------|-------------|
| `wrapper` | HTMLElement | global.document | The element in which modules will be searched for loading |
| `selector` | string | '.js-auto-loader' | CSS selector for finding modules |
| `attributeName` | string | 'data-load-module' | Name of the attribute for marking modules |
| `classPreloaderLoading` | string | 'preloader--loading' | CSS class for the preloader loading state |
| `classPreloaderLoaded` | string | 'preloader--loaded' | CSS class for the preloader loaded state |
| `hasAttribute` | boolean/object | false | Check for an additional attribute. If an object, expected in the format `{name: 'attribute-name', value: 'value'}` |
| `hasAttributeSkip` | boolean | false | If true, modules with a matching `hasAttribute` will be skipped |
| `loadModuleName` | function | - | Function for dynamically loading modules. Expected to return a Promise |
| `prefixConsole` | string | 'Fron' | Prefix for console outputs |

## Example with Custom Configuration

```javascript
import AutoLoader from '@partyk/autoloader.js';

const customLoader = (wrapper = document.querySelector('#app'), selector = '.custom-module') => {
    const loader = new AutoLoader({
        wrapper,
        selector,
        attributeName: 'data-custom-module',
        classPreloaderLoading: 'my-loading-class',
        classPreloaderLoaded: 'my-loaded-class',
        hasAttribute: {name: 'data-load-module-admin', value: 'local'},
        hasAttributeSkip: true,
        prefixConsole: 'MyApp',
        loadModuleName: (moduleName) => import(/* webpackChunkName: "[request]" */ './modules/' + moduleName + '.loader'),
    });

    loader.load();
};

export default customLoader;
```

## Methods

### `load()`

Initiates the module loading process. This method must be called after creating an AutoLoader instance.

## Notes

- AutoLoader uses dynamic import for loading modules, allowing efficient code splitting.
- Ensure that your build tools (e.g., webpack) support dynamic import and properly configure chunks for optimal performance.
- Modules are loaded based on the value of the `data-load-module` attribute in HTML.

## License

MIT

## Contributing

MIT License

Copyright (c) 2024 Bohdan Partyk

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
