'use strict';

/**
 * @singleton
 * @class
 */
Util.storage = (function() {

  var storageKey = 'sarissa_storage',
      storage    = window.localStorage,
      data       = JSON.parse(storage.getItem(storageKey) || '{}') || {};

  return {
    /**
     * @param {String} key
     * @param {*} val
     */
    set: function(key, val) {
      data[key] = val;
      storage.setItem(storageKey, JSON.stringify(data));
    },

    /**
     * @param {String} key
     */
    get: function(key) {
      return data[key];
    },

    /**
     * @param {String} key
     * @return {Boolean}
     */
    exists: function(key) {
      return key in data;
    },

    /**
     * @param {String} key
     */
    remove: function(key) {
      delete data[key];
      storage.setItem(storageKey, JSON.stringify(data));
    },

    /**
     * @param key
     * @return {Boolean}
     */
    isTrue: function(key) {
      return data[key] === true;
    },

    /**
     *
     */
    clear: function() {
      storage.setItem(storageKey, JSON.stringify(data = {}));
    }
  };

})();