'use strict';

/**
 * @singleton
 * @class
 */
Util.dimension = (function(win, doc) {

  /**
   * 表示領域のサイズを取得する
   *
   * @return {Object}
   */
  function viewportSize() {
    return {
      width : win.innerWidth,
      height: win.innerHeight
    };
  }

  /**
   * スクロール量を取得する
   *
   * @return {Object}
   */
  function scrollPos() {
    return {
      left: win.pageXOffset || doc.documentElement.scrollLeft || doc.body.scrollLeft,
      top : win.pageYOffset || doc.documentElement.scrollTop  || doc.body.scrollTop
    };
  }

  /**
   * 要素の表示領域内の絶対座標と，矩形の幅と高さを返す ( border-boxモデル )
   * getBoundingClientRectの実装が必要
   *
   * @param {Element} elm
   * @return {Object}
   */
    function elAbsRectPos(elm) {
      var rect = elm.getBoundingClientRect();

      return {
        top   : rect.top,
        bottom: rect.bottom,
        left  : rect.left,
        right : rect.right,
        width : rect.width  || (rect.right  - rect.left),
        height: rect.height || (rect.bottom - rect.top)
      };
    }

  /**
   * 要素の親要素との相対座標と，矩形の幅と高さを返す
   *
   * @param {Element} elm
   * @param {Element} [parent]
   * @return {Object}
   */
  function elRelRectPos(elm, parent) {
    var crit = elAbsRectPos(parent || elm.parentNode),
        self = elAbsRectPos(elm);

    return {
      top    : self.top    - crit.top,
      bottom : crit.bottom - self.bottom,
      left   : self.left   - crit.left,
      right  : crit.right  - self.right
    };
  }

  /**
   * 要素を中央に配置する
   * デフォルトはviewportに対しての中央
   *
   * @param {Element} elm
   * @param {Element} [crit]
   */
    // @todo issue: ロジックの整理が必要
  function elCentering(elm, crit) {
    var self = elAbsRectPos(elm), from, to, xy = {},
        pos = {}, fix = {}, relbase = false;

    function _isRelative(elm) {
      var e = elm, state;
      while (e = e.parentNode) {
        // documentに突き当たったら終了
        if (e === doc) {
          return false;
        }
        state = elm.style.position;
        if (state === 'absolute' || state === 'relative') {
          return e;
        }
      }
      return false;
    }

    // critがあって，スタイルのtop, leftと座標が異なれば相対基準をチェック
    xy.top  = elm.style.top;
    xy.left = elm.style.left;

    if (crit && self.top !== xy.top && self.left !== xy.left) {
      relbase = _isRelative(elm);
    }

    // 相対基準がいるか？
    if (relbase !== false) {
      // 相対基準とcritは同一か？
      if (crit && crit === relbase) {
        // 1.相対座標でfix
        to = elAbsRectPos(crit);

        pos.left = (to.width  - self.width)  / 2 + 'px';
        pos.top  = (to.height - self.height) / 2 + 'px';
      } else {
        // 2.relbaseとcritの座標をあわせて，矩形サイズの比較から中央を算出する -> noteみる
        to   = elAbsRectPos(crit);
        from = elAbsRectPos(relbase);

        fix.top  = to.top  - from.top;
        fix.left = to.left - from.left;

        pos.left = (to.width  - self.width)  / 2 + fix.left + 'px';
        pos.top  = (to.height - self.height) / 2 + fix.top  + 'px';
      }
    } else {
      // critはあるか？
      if (crit) {
        // 3.単純に絶対座標同士でフィックス
        to = elAbsRectPos(crit);

        pos.left = (to.width  - self.width)  / 2 + to.left + 'px';
        pos.top  = (to.height - self.height) / 2 + to.top  + 'px';
      } else {
        // 4.単純にviewportの中央にする（スクロール位置でfix）
        to = viewportSize();
        fix = scrollPos();

        pos.left = (to.width  - self.width)  / 2 + fix.left + 'px';
        pos.top  = (to.height - self.height) / 2 + fix.top  + 'px';
      }
    }

    Object.keys(pos).forEach(function(prop) {
      elm.style[prop] = pos[prop];
    });
  }

  /**
   * 指定された要素をTOPとした座標まで移動する
   * @param {Element} el
   * @param {Number} [offset]
   */
  function elScrollTo(el, offset) {
    offset || (offset = 0);
    scrollTo(0, el.offsetTop + offset);
  }

  return {
    viewportSize: viewportSize,
    scrollPos   : scrollPos,
    elCentering : elCentering,
    elRelRectPos: elRelRectPos,
    elAbsRectPos: elAbsRectPos,
    elScrollTo  : elScrollTo
  };

})(window, document);
