(function (global){

var define, requireModule, require, requirejs;

(function() {

  var _isArray;
  if (!Array.isArray) {
    _isArray = function (x) {
      return Object.prototype.toString.call(x) === "[object Array]";
    };
  } else {
    _isArray = Array.isArray;
  }

  var registry = {}, seen = {};
  var FAILED = false;

  var uuid = 0;

  function tryFinally(tryable, finalizer) {
    try {
      return tryable();
    } finally {
      finalizer();
    }
  }


  function Module(name, deps, callback, exports) {
    var defaultDeps = ['require', 'exports', 'module'];

    this.id       = uuid++;
    this.name     = name;
    this.deps     = !deps.length && callback.length ? defaultDeps : deps;
    this.exports  = exports || { };
    this.callback = callback;
    this.state    = undefined;
  }

  define = function(name, deps, callback) {
    if (!_isArray(deps)) {
      callback = deps;
      deps     =  [];
    }

    registry[name] = new Module(name, deps, callback);
  };

  define.amd = {};

  function reify(mod, name, seen) {
    var deps = mod.deps;
    var length = deps.length;
    var reified = new Array(length);
    var dep;
    // TODO: new Module
    // TODO: seen refactor
    var module = { };

    for (var i = 0, l = length; i < l; i++) {
      dep = deps[i];
      if (dep === 'exports') {
        module.exports = reified[i] = seen;
      } else if (dep === 'require') {
        reified[i] = function requireDep(dep) {
          return require(resolve(dep, name));
        };
      } else if (dep === 'module') {
        mod.exports = seen;
        module = reified[i] = mod;
      } else {
        reified[i] = require(resolve(dep, name));
      }
    }

    return {
      deps: reified,
      module: module
    };
  }

  requirejs = require = requireModule = function(name) {
    var mod = registry[name];
    if (!mod) {
      throw new Error('Could not find module ' + name);
    }

    if (mod.state !== FAILED &&
        seen.hasOwnProperty(name)) {
      return seen[name];
    }

    var reified;
    var module;
    var loaded = false;

    seen[name] = { }; // placeholder for run-time cycles

    tryFinally(function() {
      reified = reify(mod, name, seen[name]);
      module = mod.callback.apply(this, reified.deps);
      loaded = true;
    }, function() {
      if (!loaded) {
        mod.state = FAILED;
      }
    });

    var obj;
    if (module === undefined && reified.module.exports) {
      obj = reified.module.exports;
    } else {
      obj = seen[name] = module;
    }

    if (obj !== null && typeof obj === 'object' && obj['default'] === undefined) {
      obj['default'] = obj;
    }

    return (seen[name] = obj);
  };

  function resolve(child, name) {
    if (child.charAt(0) !== '.') { return child; }

    var parts = child.split('/');
    var nameParts = name.split('/');
    var parentBase = nameParts.slice(0, -1);

    for (var i = 0, l = parts.length; i < l; i++) {
      var part = parts[i];

      if (part === '..') { parentBase.pop(); }
      else if (part === '.') { continue; }
      else { parentBase.push(part); }
    }

    return parentBase.join('/');
  }

  requirejs.entries = requirejs._eak_seen = registry;
  requirejs.clear = function(){
    requirejs.entries = requirejs._eak_seen = registry = {};
    seen = state = {};
  };
})();

this["JST"] = this["JST"] || {};

this["JST"]["example"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<h2>Component Scope</h2>\r\n<div class="col-md-6">\r\n  <h3>Value</h3>\r\n  <input type="text" id="text" value="' +
__e( value ) +
'">\r\n</div>\r\n<div class="col-md-6">\r\n  <h3>Range bar</h3>\r\n  <input type="range" id="range" min="' +
__e( min ) +
'" max="' +
__e( max ) +
'" value="' +
__e( value ) +
'">\r\n</div>';

}
return __p
};
define("app", 
  ["components/ExampleComponent","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Example = __dependency1__["default"];

    
    var App = this.App = this.App || {};
    
    if ('undefined' === typeof App) {
      App = {};
    }
    
    App.init = function () {
      $('[data-template="components/example"').each(function() {
        Example.init(this);
      });
    };
    
    document.addEventListener('DOMContentLoaded', function () {
      App.init();
    });
    
    __exports__["default"] = App;
  });
define("components/ExampleComponent", 
  ["exports"],
  function(__exports__) {
    "use strict";
    'use strict';
    
    var Component = {
      template: window.JST.example,
    
      init: function (root) {
        this.$root = $(root);
        this.min = root.getAttribute('data-min') || 0.0;
        this.max = root.getAttribute('data-max') || 100.0;
        this.value = Math.floor((this.max - this.min) / 2);
    
        this.render();
    
        this.addListeners();
      },
    
      addListeners: function () {
        var that = this;
    
        this.$root.on('change', '#text', function() {
          that.value = this.value;
    
          that.render();
        });
    
        this.$root.on('change', '#range', function() {
          that.value = this.value;
    
          that.render();
        });
      },
    
      render: function () {
        var temp = this.template;
    
        this.$root.html(temp({
          min: this.min,
          max: this.max,
          value: this.value
        }));
      }
    };
    
    __exports__["default"] = Component;
  });

global.App = requireModule('app')['default'];
}(this));