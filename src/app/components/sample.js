'use strict';

/**
 * @class Component.Sample
 */
Component.Sample = Phalanx.Component.extend({
  /**
   * @property {Object}
   */
  events: {
    'click .js-detect': 'onDetect'
  },

  /**
   * @property {Object}
   */
  ui: {
    count: null
  },

  /**
   *
   */
  onDetect: function() {
    this.trigger(Math.random() % 2 ? 'success' : 'error');
  }
});
