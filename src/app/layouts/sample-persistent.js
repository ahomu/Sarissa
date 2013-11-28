'use strict';

/**
 * @class Layout.SamplePersistent
 * @extend Layout.Base
 */
Layout.SamplePersistent = Layout.Base.extend({
  /**
   * @property {Object}
   */
  meta: {
    title: 'サンプル(永続)',
    name : 'SamplePersistent'
  },

  /**
   * @property {Boolean}
   */
  persistent: true,

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
  },

  /**
   *
   */
  onPause: function() {
  },

  /**
   *
   */
  onResume: function() {
  }
});