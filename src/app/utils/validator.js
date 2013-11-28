'use strict';

/**
 * @singleton
 * @class
 */
Util.validator = (function() {

  /**
   * @param {String|Number} v
   * @returns {Boolean}
   */
  function notEmpty(v) {
    // 0<Number>, '0'<String>, Truthyのいずれかでtrueとする
    return v === 0 || v === '0' || !!v;
  }

  function canLength(v) {
    return v != null;
  }

  return {
    /**
     * @param {String|Number} v
     * @return {Boolean}
     */
    required: function(v) {
      return notEmpty(v);
    },

    /**
     * @param {String|Number} v
     * @param {Number} limit
     * @return {Boolean}
     */
    maxLength: function(v, limit) {
      if (!canLength(v)) {
        return true;
      }
      v = '' + v;
      return v.length <= limit;
    },

    /**
     * @param {String} v
     * @return {Boolean}
     */
    validDate: function(v) {
      var start   = (new Date(Config.releaseDate)).getTime(),
          suspect = (new Date(v)).getTime(),
          until   = (new Date(Util.date.strftime(DATE_NOW.getTime() + 86400000, '%Y-%m-%d'))).getTime();

      if (suspect < start || suspect >= until) {
        return false;
      } else {
        return true;
      }
      return true;
    }
  };

})();