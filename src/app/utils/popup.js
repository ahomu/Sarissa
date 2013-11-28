'use strict';

/**
 * @singleton
 * @class
 */
Util.popup = (function() {

  return {
    confirm: function(options) {
      Util.mediator.trigger('popup:confirm', options);
    },

    alert: function(options) {
      Util.mediator.trigger('popup:alert', options);
    }
  };

})();