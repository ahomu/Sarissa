'use strict';

/**
 * @class View.Header
 * @extend View.Base
 */
View.Header = View.Base.extend({
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
  tmpl: 'views/header',

  /**
   * 初期化
   */
  onSetElement: function() {
    this.render();
  }

});
