import * as OfflinePluginRuntime from 'offline-plugin/runtime';
OfflinePluginRuntime.install();

import promiseFinally from 'promise.prototype.finally';
import flatMap from 'array.prototype.flatmap';

promiseFinally.shim();
flatMap.shim();

document.addEventListener('WebComponentsReady', function componentsReady() {
    document.removeEventListener('WebComponentsReady', componentsReady, false);
    import( /* webpackChunkName: "ht-app" */ "./src/ht-app-tz.js")
    import( /* webpackChunkName: "ht-spinner" */ "./src/elements/ht-spinner/ht-spinner.js")
}, false);


(function() {
    'use strict';
    // global for (1) existence means `WebComponentsReady` will fire,
    // (2) WebComponents.ready == true means event has fired.
    window.WebComponents = window.WebComponents || {};
    var name = 'webcomponents-loader.js';
    // Feature detect which polyfill needs to be imported.
    var polyfills = [];

    if (!('attachShadow' in Element.prototype && 'getRootNode' in Element.prototype) ||
        (window.ShadyDOM && window.ShadyDOM.force)) {
        polyfills.push('sd');
    }
    if (!window.customElements || window.customElements.forcePolyfill) {
        polyfills.push('ce');
    }

    var needsTemplate = (function() {
        // no real <template> because no `content` property (IE and older browsers)
        var t = document.createElement('template');
        if (!('content' in t)) {
            return true;
        }
        // broken doc fragment (older Edge)
        if (!(t.content.cloneNode() instanceof DocumentFragment)) {
            return true;
        }
        // broken <template> cloning (Edge up to at least version 17)
        var t2 = document.createElement('template');
        t2.content.appendChild(document.createElement('div'));
        t.content.appendChild(t2);
        var clone = t.cloneNode(true);
        return (clone.content.childNodes.length === 0 ||
            clone.content.firstChild.content.childNodes.length === 0);
    })();

    // NOTE: any browser that does not have template or ES6 features
    // must load the full suite of polyfills.
    if (!window.Promise || !Array.from || !window.URL || !window.Symbol || needsTemplate) {
        polyfills = ['sd-ce-pf'];
    }

    if (polyfills.length) {
        // Load it from the right place.
        var seq = polyfills.join('-')

        if (seq === 'ce') {
            import( /* webpackChunkName: "wcl-ce" */ '@webcomponents/webcomponentsjs/bundles/webcomponents-ce.js')
        } else if (seq === 'sd') {
            import( /* webpackChunkName: "wcl-sd" */ '@webcomponents/webcomponentsjs/bundles/webcomponents-sd.js')
        } else if (seq === 'sd-ce') {
            import( /* webpackChunkName: "wcl-sd-ce" */ '@webcomponents/webcomponentsjs/bundles/webcomponents-sd-ce.js')
        } else {
            import( /* webpackChunkName: "wcl-lite" */ '@webcomponents/webcomponentsjs/bundles/webcomponents-sd-ce-pf.js')
        }
    } else {
        // Ensure `WebComponentsReady` is fired also when there are no polyfills loaded.
        // however, we have to wait for the document to be in 'interactive' state,
        // otherwise a rAF may fire before scripts in <body>

        var fire = function() {
            requestAnimationFrame(function() {
                window.WebComponents.ready = true;
                document.dispatchEvent(new CustomEvent('WebComponentsReady', {bubbles: true}));
            });
        };

        if (document.readyState !== 'loading') {
            fire();
        } else {
            document.addEventListener('readystatechange', function wait() {
                fire();
                document.removeEventListener('readystatechange', wait);
            });
        }
    }
})();
