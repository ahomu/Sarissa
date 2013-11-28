'use strict';

/**
 * @abstract
 * @class Layout.Base
 * @param {Object} [options]
 * @param {Object} [initData]
 */
Layout.Base = Phalanx.Layout.extend({
  /**
   * @property {Object}
   */
  meta: {
    title: '',
    name : 'Unknown'
  },

  /**
   * xhrのスタック
   * @property {Array}
   */
  xhrStack: [],

  /**
   * xhrのスタックを追加する
   * @param {XMLHttpRequest} xhr
   */
  handleAsyncXHR: function(xhr) {
    this.xhrStack.push(xhr);
  },

  /**
   * 非同期モジュールを読み込んで、regionにassignする
   * xhrはViewの破棄時に中断できるよう、ハンドリングさせる
   *
   * TODO inheritanceから何らか分断して、各Layoutがtraitとして実装するほうが良いと思われる
   *
   * @param {String} region
   * @param {Object} options
   */
  assignAsyncModule: function(region, options) {
    var model = _.isString(options.model) ? new Model[options.model]() : options.model,
        view  = _.isString(options.view)  ? new View[options.view]()   : options.view,
        prop  = options.prop,
        xhr   = model.fetch({
                  success: _.bind(function(model) {
                    view.setRenderData(model.get(prop));
                    this.assign(region, view);
                  }, this)
                });

    xhr.fromAsyncModule = true;
    this.handleAsyncXHR(xhr);
  },

  /**
   * 画面のリフレッシュ
   */
  refresh: function() {
    // region viewsを破棄する
    var i = 0, regions = Object.keys(this.regions),
        regionName;
    while ((regionName = regions[i++])) {
      this.withdraw(regionName);
    }

    // コンポーネントを破棄する
    this.destroyComponents();

    // イベントのリスニングを止める
    // ISSUE Componentと無関係なイベントもまとめて殺してしまっているので、区別して捨てた方が良い
    this.stopListening();

    // 要素セット時の処理からやり直してリフレッシュ
    this.onSetElement();
  },

  /**
   * 共通の描画メソッド
   * @chainable
   */
  render: View.Base.prototype.render,

  /**
   * 描画データの提供メソッド
   * @param {Object} data
   * @return {Object}
   */
  presenter: View.Base.prototype.presenter,

  /**
   * @abstract
   * @method
   */
  onBeforeRender: null,

  /**
   * @abstract
   * @method
   */
  onAfterRender: null,

  /**
   * Layoutがresumeされた際に、履歴回遊中であればスクロール位置を復元する
   */
  resume: function() {
    // renderし終わってからスクロールさせる (render中におけるforced layout避け)
    if (Util.inHistory.isInHistory) {
      _.defer(_.bind(function() {
        window.scrollTo(0, this.prevScrollY);
      }, this));
    } else {
      _.defer(_.bind(function() {
        window.scrollTo(0, 0);
      }, this));
    }
    Phalanx.Layout.prototype.resume.apply(this, arguments);
  },

  /**
   * Layoutをpauseする際に、スクロール位置を保持する
   */
  pause: function() {
    if (Util.inHistory.isInHistory) {
      if (window.scrollY !== 0) {
        console.log(this.prevScrollY + ' to ' + window.scrollY);
        this.prevScrollY = window.scrollY;
      }
    } else {
      this.prevScrollY = window.scrollY;
    }
    Phalanx.Layout.prototype.pause.apply(this, arguments);
  },

  /**
   * ハンドリングが必要とされるXHRのスタックを、すべてabortする
   */
  destroy: function() {
    var i = 0, xhr;
    while((xhr = this.xhrStack[i++])) {
      xhr.abort();
    }
    this.xhrStack = [];
    Phalanx.Layout.prototype.destroy.apply(this, arguments);
  }

});