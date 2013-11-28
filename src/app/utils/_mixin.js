'use strict';


/**
 * Lodashの拡張
 */
_.mixin({
  /**
   * 指定した配列を、指定した長さの配列に再分割する
   *
   *     _.split([1,2,3,4,5,6,7,8,9,0], 3) // => [[1,2,3], [4,5,6], [7,8,9], [0]]
   *
   * @param {Array} array
   * @param {Number} unit
   * @param {*} fill
   * @return {Array.<Array>}
   */
  split: function(array, unit, fill) {
    var rvLength = Math.ceil(array.length/unit),
        rv = new Array(rvLength),
        lastChunk;

    array.forEach(function(item, i) {
      var rvi = Math.floor(i/unit);
      rv[rvi] || (rv[rvi] = []);
      rv[rvi].push(item);
    });

    lastChunk = rv[rvLength-1];
    if (fill && lastChunk && lastChunk.length < unit) {
      for (; lastChunk.length < unit;) {
        lastChunk.push(_.clone(fill));
      }
    }

    return rv;
  }
});