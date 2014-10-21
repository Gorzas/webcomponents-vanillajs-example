import Example from 'components/ExampleComponent';

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

export default App;