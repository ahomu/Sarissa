'use strict';

Util.inHistory = {
  /**
   * @property {Boolean} 履歴回遊中？
   */
  isInHistory: false,

  /**
   * @private
   * @property {Boolean} アンカーリンクまたはnavigateによる前方向遷移かを判定
   */
  _isForward: undefined,

  /**
   * 初期化・onHashChange
   */
  init: function() {
    this.isInHistory = false;
    $(window).on('hashchange', _.bind(this.onHashChange, this));
    $(document).on('click', 'a', _.bind(this.onClickAnchor, this));
  },

  /**
   * リンク遷移は履歴回遊ではなく、新規画面への移動とみなす
   */
  onClickAnchor: function() {
    this._isForward = true;
  },

  /**
   * ハッシュチェンジの際に、 `_isForward`を元に履歴回遊かどうかを判定する
   */
  onHashChange: function() {
    this.isInHistory = !this._isForward;
    this._isForward  = undefined; // reset
  }
};
