'use strict';

/**
 * @class Model.Base
 */
Model.Base = Phalanx.Model.extend({
  /**
   * @property {Object}
   */
  syncParam: {
    contentType: 'application/json',
    dataType: 'json'
  },

  /**
   * @property {Object}
   */
  methodMap: {
    'create': 'POST',
    'update': 'PUT',
    'patch':  'PATCH',
    'delete': 'DELETE',
    'read':   'GET'
  },

  /**
   * 次回Layoutがchangeされたあとに、LayoutCacheをクリアする
   * @property {Boolean}
   */
  bustCache: false,

  /**
   * リクエスト前に、即座にLayoutCacheをクリアする
   * @property {Boolean}
   */
  bustCacheImmediate: false,

  /**
   * バリデーションルール
   *
   *     validation: {
   *        storeId: {
   *          required: true
   *        },
   *        comment: {
   *          maxLength: 200
   *        }
   *     }
   *
   * @property {Object}
   */
  validation: {},

  /**
   * バリデーションエラーメッセージ
   *
   *     messages: {
   *        storeId: {
   *          required: 'お店を選択してください'
   *        },
   *        comment: {
   *          maxLength: '最大200文字におさめてください'
   *        }
   *     }
   *
   * @property {Object}
   */
  messages: {},

  /**
   * @property {String}
   */
  latestMethod: null,

  /**
   * リクエストパスを生成する
   * @return {String}
   */
  url: function() {
    var hasProtocol, path;
    path = _.isFunction(this.path) ? this.path() : this.path;
    hasProtocol = !!path.match(/^\w+:\/\//);
    return (hasProtocol ? '' : (Config.baseUrl || '')) + path;
  },

  /**
   * APIのパス メソッドまたは文字列として、各Modelで定義する
   * @return {Function|String}
   */
  path: '',

  /**
   * APIのパラメータを返すメソッドとして、各Modelで定義する
   * @return {Object}
   */
  params: function() {
    return {};
  },

  /**
   * valueがnull, undefinedなパラメータを除去して取得する
   * @returns {Object}
   */
  filteredParams: function() {
    var params = this.params();
    _.each(params, function(val, key) {
      if (val == null) {
        delete params[key];
      }
    }, this);
    return params;
  },

  /**
   * 通信処理前の共通エラー処理セット
   *
   * @param method
   * @returns {*}
   */
  sync: function(method, __, options) {

    this.latestMethod = this.methodMap[method];

    switch (this.latestMethod) {
      case 'GET':
        this.listenToOnce(this, 'error', this._onGetError);
        options.data = this.filteredParams();
        break;
      case 'POST':
      case 'DELETE':
      case 'PUT':
      case 'PATCH':
        this.listenToOnce(this, 'error',   this._onPostError);
        options.attrs = $.param(this.filteredParams());

        // LayoutCache即時クリア
        if (this.bustCacheImmediate) {
          Util.mediator.trigger('bustcache:immediate');
        }

        break;
    }

    return  Phalanx.Model.prototype.sync.apply(this, [method, __, options]);
  },

  /**
   * Mediator宛てにグローバルな通信エラーの発生を送出する
   * @private
   * @param {Phalanx.Model} model
   * @param {XMLHttpRequest} xhr
   */
  _onGetError: function(model, xhr) {
    Util.loader.hide();

    var meta,
        message = '通信中にエラーが発生しました',
        jsonText = xhr.responseText || '{}';

    // 一部のAndroid 2系で、200でないレスポンスのときのxhr.responseTextの末尾に、ステータスコード + メッセージがつく疑い
    jsonText = jsonText.replace(new RegExp(xhr.status + ' ' + xhr.statusText + '$'), '');

    switch(xhr.status) {
      case 400:
        meta = JSON.parse(jsonText).meta;
        message = meta.message;
        break;
      case 0:
        // maybe...
        try {
          // ABORTED
          if (!xhr.getAllResponseHeaders()) {
            return;
          }
        } catch(e) {
          // TIMEOUT

        }
        break;
      default:
        break;
    }
    /**
     * @event sync:error:get
     * @param {String} message
     */
    Util.mediator.trigger('sync:error:get', message);
  },

  /**
   * POST ErrorといいつつDELETEとかPUTもカバーするハンドラ...
   * 役割はonGetErrorと同じで、送るイベントが違うだけ
   * @private
   * @param {Phalanx.Model} model
   * @param {XMLHttpRequest} xhr
   */
  _onPostError: function(model, xhr) {
    Util.loader.hide();

    var meta,
        message = '通信中にエラーが発生しました<br>時間をあけていただくか<br>電波の良いところでお試しください',
        jsonText = xhr.responseText || '{}';

    // 一部のAndroid 2系で、200でないレスポンスのときのxhr.responseTextの末尾に、ステータスコード + メッセージがつく疑い
    jsonText = jsonText.replace(new RegExp(xhr.status + ' ' + xhr.statusText + '$'), '');

    switch(xhr.status) {
      case 302:
        meta = JSON.parse(jsonText).meta;
        Util.loader.show();
        location.href = meta.location;
        return;
      case 400:
        meta = JSON.parse(jsonText).meta;
        message = meta.message;
        break;
      case 0:
        try {
          // ABORTED
          // getAllResponseHeaders が false を返せばAbortっぽい
          // TIMEOUTのときは、例外が投げられる
          if (!xhr.getAllResponseHeaders()) {
            return;
          }
        } catch(e) {
          // TIMEOUT
        }
        break;
      default:
        break;
    }
    /**
     * @event sync:error:post
     * @param {String} message
     */
    Util.mediator.trigger('sync:error:post', message);
  },

  /**
   * バリデート
   * @param {Object} attrs
   */
  validate: function() {
    var attributes,
        i = 0,
        keys = Object.keys(this.validation), // attrsのキー名たち
        key,                                 // attributeのキー
        val,                                 // attributeの値
        j = 0,
        validities,                          // validationのメソッド名たち
        validity,                            // validationのメソッド
        condition,                           // validationの条件
        invalids = [];                       // invalidな条件を "キー:バリデーションメソッド" で追加する

    // バリデーションがそもそもなければ終了
    if (!keys.length) {
      return;
    }

    // APIのパラメーター値
    attributes = this.filteredParams() || {};

    // ぐるぐるぐる（attrからキーを抽出）
    while ((key = keys[i++])) {
      val = attributes[key];
      validities = Object.keys(this.validation[key]);
      j = 0;

      // ぐるぐるぐるぐるぐるぐる（attrごとのvalidityを抽出）
      while ((validity = validities[j++])) {
        condition = this.validation[key][validity];

        if (!_.isFunction(Util.validator[validity])) {
          throw new Error('"' + validity + '" is not implmented in `Util.validator`');
        }
        else if (!Util.validator[validity](val, condition)) {
          invalids.push(key+':'+validity);
        }
      }
    }

    if (invalids.length) {
      this.listenToOnce(this, 'invalid', this._onInvalidError);
      return invalids;
    }
  },

  /**
   * バリデーションエラーがあったときのポップアップ用ハンドラ
   * @private
   * @param {Phalanx.Model} model
   * @param {Object|String} validities
   */
  _onInvalidError: function(model, validities) {
    Util.loader.hide();

    var i = 0, key_validity, messages = [];

    while ((key_validity = validities[i++])) {
      key_validity = key_validity.split(':');

      if (!this.messages[key_validity[0]] || !this.messages[key_validity[0]][key_validity[1]]) {
        throw new Error(key_validity[0] + '\'s validation error message not specified');
      }
      messages.push(this.messages[key_validity[0]][key_validity[1]]);
    }

    Util.popup.alert({
      message: messages.join('<br>')
    });
  },

  /**
   * ロウデータの共通加工フェーズ
   */
  parse: function(data) {
    // LayoutCacheクリア予約
    if (this.bustCache) {
      Util.mediator.trigger('bustcache');
    }
    return data;
  }
});
