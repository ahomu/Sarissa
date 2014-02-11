'use strict';

/**
 * @class Layout.Sample
 * @extend Layout.Base
 */
Layout.Sample = Layout.Base.extend({
  /**
   * @property {Object}
   */
  meta: {
    title: 'サンプル',
    name : 'Sample'
  },

  /**
   * @property {Object}
   */
  events: {
    'click .js-redraw': function() {
      this.assign('partial', new View.Sample({}));
    }
  },

  /**
   * @property {Object}
   */
  regions: {
    partial: '#js-reg-partial'
  },

  /**
   * @property {String}
   */
  tmpl: 'layouts/sample',

  /**
   * 要素セット初期化
   */
  onSetElement: function() {
    this.render();
  },

  /**
   * Layout描画後に、Regionをセット
   */
  onAfterRender: function() {
    /**
     * @params {Object} options
     * @params {Object} initData
     */
    this.assign('partial', new View.Sample({}));
  },

  /**
   * LayoutにModelのデータを直接展開する
   * @params {Object} data
   * @return {Object}
   */
  presenter: function(data) {
    data.foo = 'foo';
    data.bar = 'bar';
    return data;
  }
});