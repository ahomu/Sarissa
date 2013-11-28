'use strict';

/**
 * @class View.Popup
 * @extend View.Base
 */
View.Popup = View.Base.extend({
  /**
   * @property {Object}
   */
  events: {
    'click .js-ok': 'pressOk',
    'click .js-ng': 'pressNg',
    'click .js-close': 'close'
  },

  /**
   * 初期化
   */
  onSetElement: function() {
    _.bindAll(this);
  },

  /**
   * 通知ポップアップ呼び出し
   * @param {Object} options
   */
  alert: function(options) {
    this.options = options;
    this.$el.html(Template['views/popup/alert'](this.options));
    this.open();
  },

  /**
   * 確認ポップアップ呼び出し
   * @param {Object} options
   */
  confirm: function(options) {
    this.options = options;
    this.$el.html(Template['views/popup/confirm'](this.options));
    this.open();
  },

  /**
   * スクロールロック用ハンドラ
   * @param {Event} evt
   */
  scrollLock: function(evt) {
    evt.preventDefault();
  },

  /**
   * 開く(´○`)
   */
  open: function() {
    this.$el.css(_.extend(Util.dimension.viewportSize(), {
      position: 'absolute',
      top: window.pageYOffset,
      left: 0
    }));
    this.$el.removeClass('is-hidden');
    this.$el.on('touchmove', this.scrollLock);
  },

  /**
   * 閉じる(´×`)
   * @return {boolean}
   */
  close: function() {
    this.$el.addClass('is-hidden');
    this.$el.off('touchmove', this.scrollLock);
    return false;
  },

  /**
   * 確認ポップアップで、OKボタン押したとき
   * @return {boolean}
   */
  pressOk: function() {
    if (_.isFunction(this.options.ok)) {
      this.options.ok();
    }
    return this.close();
  },

  /**
   * 確認ポップアップで、NGボタン押したとき
   * @return {boolean}
   */
  pressNg: function() {
    if (_.isFunction(this.options.ng)) {
      this.options.ng();
    }
    return this.close();
  }
});