'use strict';

/**
 * @class
 * @extend Layout.Base
 */
Layout.Root = Layout.Base.extend({
  /**
   * @property {String}
   */
  el: 'body',

  /**
   * @property {Object}
   */
  regions: {
    header  : '#js-header',
    content : '#js-content',
    footer  : '#js-footer',
    popup   : '#js-popup'
  },

  /**
   * 初期化
   */
  initialize: function() {
    var headerView = new View.Header(),
        footerView = new View.Footer(),
        popupView  = new View.Popup();

    this.assign('header',   headerView);
    this.assign('footer',   footerView);
    this.assign('popup',    popupView);

    Util.mediator.on('popup:alert',     popupView.alert);
    Util.mediator.on('popup:confirm',   popupView.confirm);
  },

  /**
   * @param {String} regionName
   * @param {Phalanx.Layout} newLayout
   * @param {Phalanx.Layout} oldLayout
   */
  onChange: function(regionName, newLayout, oldLayout) {
    switch(regionName) {
      case 'content':
        this.stopListening(oldLayout);
        this.listenToOnce(newLayout, 'render:complete', this.onShowContent);
      break;
    }
  },

  /**
   * 通常render時に、ContentLayoutの`render:complete`イベントから発火する
   * @see Layout.Base.render
   */
  onShowContent: function() {
    _.defer(_.bind(function() {
      window.scrollTo(0, 0);
    }, this));
  }
});
