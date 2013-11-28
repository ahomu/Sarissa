'use strict';

/**
 * @abstract
 * @class View.Base
 * @param {Object} [options]
 * @param {Object} [initData]
 */
View.Base = Phalanx.View.extend({

  /**
   * 初期表示データのストア
   */
  _renderData: null,

  /**
   * 第2引数があれば、それをrenderメソッドが利用する初期表示データとして利用する
   */
  onCreate: function() {
    this.setRenderData(arguments[1] || {});
  },

  /**
   * 描画データのセット
   * @param {Object} data
   */
  setRenderData: function(data) {
    this._renderData = data;
  },

  /**
   * 共通の描画メソッド
   * @chainable
   */
  render: function() {

    if (Template[this.tmpl]) {
      var data = this._renderData;

      // 描画前
      _.isFunction(this.onBeforeRender) && this.onBeforeRender(data);

      // 描画
      this.$el.html(Template[this.tmpl](data));
      // 初期表示データを破棄
      this._renderData = null;

      // uiの参照を更新
      this.lookupUi();

      // 描画後
      _.isFunction(this.onAfterRender) && this.onAfterRender(data);

      /**
       * @event render:complete
       */
      this.trigger('render:complete');
    } else {
      this.$el.html(Template['layouts/error']({
        message: 'Template file `' + this.tmpl + '.hbs` is not found.'
      }));
    }

    return this;
  },

  /**
   * 描画データの提供メソッド
   * @param {Object} data
   * @return {Object}
   */
  presenter: function(data) {
    // TODO optionsにデカいオブジェクトの参照を入れておくの、あんまりよくない気がする...destroy時に参照外せば大丈夫？
    return data || {};
  },

  /**
   * @abstract
   * @method
   */
  onBeforeRender: null,

  /**
   * @abstract
   * @method
   */
  onAfterRender: null
});