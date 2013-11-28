'use strict';

/**
 * @class View.Footer
 * @extend View.Base
 */
View.Footer = View.Base.extend({
  /**
   * @property {Object}
   */
  events: {

  },

  /**
   * @property {Object}
   */
  ui: {

  },

  /**
   * @property {String}
   */
  tmpl: 'views/footer',

  /**
   * 初期化
   */
  onSetElement: function() {
    this.render();
  }

});