'use strict';

/**
 * @class View.Sample
 * @extend View.Base
 */
View.Sample = View.Base.extend({

  /**
   * @property {Object}
   */
  events: {
    'click [data-ui="foo"]': 'onClickFoo'
  },

  /**
   * @property {Object}
   */
  ui: {
    foo: null,
    bar: null
  },

  /**
   * @property {Object}
   */
  components: {
    'sample': Component.Sample
  },

  /**
   * @property {Object}
   */
  listeners: {
    'success sample': 'onSuccess',
    'error sample': 'onError'
  },

  /**
   * @property {String}
   */
  tmpl: 'views/sample',

  /**
   * 要素セット初期化
   */
  onSetElement: function() {
    this.render();
  },

  /**
   * @return {Object}
   */
  presenter: function(data) {
    return data;
  },

  onSuccess: function() {

  },

  onError: function() {

  }
});