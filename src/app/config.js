'use strict';

// 定数的アレコレ
var NS = 'Sarissa',
    App, Model, Layout, View, Component, Util, Template, Config;

// オブジェクトをローカル変数と名前空間内に配置
var App        = window[NS];
var Model      = App.Model      = {};
var Layout     = App.Layout     = {};
var View       = App.View       = {};
var Component  = App.Component  = {};
var Util       = App.Util       = {};
var Config     = App.Config     = {};
var Template   = App.Template;

// タイムアウト設定
Config.timeout = {
  AJAX: 15000,
  GEOLOCATION: 10000
};

// このレイアウトマップで `:param` として指定したパラメータは、
// Layoutの `this.options.param` として渡される
Config.layoutRoutes = {
  // トップ
  ''              : 'Sample',

  // エラーページ
  'error/:status' : 'Error'
};

// Ajaxセットアップ
Config.ajaxSettings = _.extend($.ajaxSettings, {
  timeout: Config.timeout.AJAX,
  beforeSend: function(xhr, options) {
  },
  complete: function(xhr) {
  }
});
