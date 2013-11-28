'use strict';

/**
 * @class PageLayoutRouter
 */
window[NS] = Phalanx.Router.extend({
  /**
   * このレイアウトマップで `:param` として指定したパラメータは、
   * Layoutの `this.options.param` として渡される
   * @property {Object}
   */
  map: Config.layoutRoutes,

  /**
   * 永続化されたViewをストックしておくトコロ
   * @property {Object}
   */
  persistentLayouts: {},

  /**
   * ルートレイアウトの参照
   * @property {Phalanx.Layout}
   */
  rootLayout: null,

  /**
   * インスタンス生成時の事前処理
   * レイアウトマップを `routes` に変換する
   */
  onCreate: function() {
    var i = 0, keys = Object.keys(this.map), iz = keys.length,
        routePath, layoutName;

    this.routes  = this.routes || {};

    for (; i<iz; i++) {
      routePath  = keys[i];
      layoutName = this.map[routePath];
      this.routes[routePath] = this.getDispatcher(layoutName, routePath);
    }
  },

  /**
   * @param {String} layoutName
   * @param {String} routePath
   * @returns {Function}
   */
  getDispatcher: function(layoutName, routePath) {
    return function() {
      var LoClass, keys, loInstance;
      if (!!(LoClass = App.Layout[layoutName])) {
        keys = _.map(routePath.match(/[:](\w+)/g), function(key) {
          return key.slice(1);
        });

        loInstance = this.persistentLayouts[layoutName] || new LoClass(_.object(keys, arguments));
        if (loInstance.persistent) {
          this.persistentLayouts[layoutName] = loInstance;
        }
        this.rootLayout.assign('content', loInstance);

        // 遅延キャッシュクリア
        if (!!this.approveClearCache) {
          this.clearLayoutCache(loInstance);
          this.approveClearCache = false;
        }
      } else {
        throw new Error(layoutName + ' is not defined. Content is not assigned');
      }
    };
  },

  /**
   * @constructor
   */
  initialize: function() {
    _.bindAll(this, 'onGetError', 'onPostError', 'onBustCache', 'clearLayoutCache');

    this.rootLayout = new App.Layout.Root();
    Backbone.history.start({pushState: true});

    Util.mediator.on('sync:error:get',  this.onGetError);
    Util.mediator.on('sync:error:post', this.onPostError);
    Util.mediator.on('bustcache',       this.onBustCache);
    Util.mediator.on('bustcache:immediate', this.clearLayoutCache);
  },

  /**
   * persistentLayoutsのキャッシュをすべてクリアする
   * @param {Phalanx.Layout} currentlyInstance 現在表示中のLayoutをクリア対象から除外する
   */
  clearLayoutCache: function(currentlyInstance) {
    var i = 0, keys = Object.keys(this.persistentLayouts), key;
    while ((key = keys[i++])) {
      if (this.persistentLayouts[key] && currentlyInstance !== this.persistentLayouts[key]) {
        this.persistentLayouts[key].destroy();
        this.persistentLayouts[key] = null;
      }
    }
  },

  /**
   * Layoutが変更されたあとに、それまでにCahceされていたPersistentLayoutsの破棄を予約する
   */
  onBustCache: function() {
    this.approveClearCache = true;
  },

  /**
   * Model.Base由来の通信エラーハンドリング
   */
  onGetError: function(message) {
    var options = {
        message: message,
        okLabel: '再読込',
        ok: function() { location.reload(); }
      },
      contentRegionView;

    if (Util.is.initialized()) {
      // 1ページでも表示された後なら、戻れる(閉じる)ようにする
      options.ngLabel = '閉じる';
      options.ng = function() { history.back(); };

      // 永続化レイアウトであれば、貯蓄場所から破棄する
      contentRegionView = this.rootLayout.getRegionView('content');
      if (contentRegionView.persistent) {
        this.persistentLayouts[contentRegionView.name] = null;
      }

      // 初期化に失敗したLayoutを破棄する
      this.rootLayout.withdraw('content');
    } else {
      options.ngLabel = 'トップに戻る';
      options.ng = function() { location.href = '/'; };
    }

    Util.popup.confirm(options);
  },

  /**
   * Model.Base由来の通信エラーハンドリング
   */
  onPostError: function(message) {
    Util.popup.alert({
      message: message
    });
  }
}, App);
