'use strict';

/**
 * @class Model.Sample
 */
Model.Sample = Model.Base.extend({
  /**
   * @property {String}
   */
  path: function() {
    return 'path/to';
  },

  /**
   * @return {Object}
   */
  params: function() {
    return {
      foo: this.get('foo'),
      bar: this.get('bar')
    };
  },

  /**
   * @property {Object}
   */
  validation: {
    foo: {
      required: true
    },
    bar: {
      required: true,
      maxLength: 200
    }
  },

  /**
   * @property {Object}
   */
  messages: {
    id: {
      required: 'FOOOOOOOOO'
    },
    comment: {
      required: 'BARRRRRRRR',
      maxLength: 'BARRRRRRRR'
    }
  }
});
