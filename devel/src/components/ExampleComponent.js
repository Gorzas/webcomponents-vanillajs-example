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

export default Component;