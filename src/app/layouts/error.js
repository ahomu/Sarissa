'use strict';

/**
 * @class Layout.Error
 * @extend Layout.Base
 */
Layout.Error = Layout.Base.extend({
  /**
   * @property {Object}
   */
  meta: {
    title: 'エラー',
    name : 'Error'
  },

  /**
   * @property {String}
   */
  tmpl: 'layouts/error',

  /**
   * 要素セット初期化
   */
  onSetElement: function() {
    this.render();
  },

  /**
   * ステータスコードがoptionsに入っているので渡す
   */
  presenter: function() {
    return this.options;
  }
});