'use strict';

/**
 * @singleton
 * @class
 */
Util.date = (function() {

  function pad (d, n, p) {
    var s = '' + d;
    p = p || '0';
    while (s.length < n) {
      s = p + s;
    }
    return s;
  }

  var locales = {
    en: {
      A: [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday',
        'Thursday', 'Friday', 'Saturday'
      ],
      a: [
        'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
      ],
      B: [
        'January', 'February', 'March', 'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December'
      ],
      b:  ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    ja: {
      B: [' 1月', ' 2月', ' 3月', ' 4月', ' 5月', ' 6月', ' 7月', ' 8月', ' 9月', '10月', '11月', '12月'],
      b: [' 1月', ' 2月', ' 3月', ' 4月', ' 5月', ' 6月', ' 7月', ' 8月', ' 9月', '10月', '11月', '12月'],
      A: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
      a: ['日', '月', '火', '水', '木', '金', '土']
    }
  };
  var formats = {
    A: function(d, locale) {
      return locales[locale].A[d.getDay()];
    },
    a: function(d, locale) {
      return locales[locale].a[d.getDay()];
    },
    B: function(d, locale) {
      return locales[locale].B[d.getMonth()];
    },
    b: function(d, locale) {
      return locales[locale].b[d.getMonth()];
    },
    C: function(d) {
      return Math.floor(d.getFullYear() / 100);
    },
    c: function(d) {
      return d.toString();
    },
    d: function(d) {
      return pad(d.getDate(), 2, '0');
    },
    e: function(d) {
      return pad(d.getDate(), 2, ' ');
    },
    H: function(d) {
      return pad(d.getHours(), 2, '0');
    },
    I: function(d) {
      return pad((d.getHours() % 12 || 12), 2);
    },
    k: function(d) {
      return pad(d.getHours(), 2, ' ');
    },
    l: function(d) {
      return pad((d.getHours() % 12 || 12), 2, ' ');
    },
    M: function(d) {
      return pad(d.getMinutes(), 2, '0');
    },
    m: function(d) {
      return pad((d.getMonth() + 1), 2, '0');
    },
    p: function(d) {
      return (d.getHours() > 11) ? 'PM' : 'AM';
    },
    S: function(d) {
      return pad(d.getSeconds(), 2, '0');
    },
    s: function(d) {
      return Math.floor(d.getTime() / 1000);
    },
    u: function(d) {
      return (d.getDay() || 7);
    },
    w: function(d) {
      return d.getDay();
    },
    Y: function(d) {
      return d.getFullYear();
    },
    y: function(d) {
      return pad((d.getYear() % 100), 2);
    },
    '%': function() {
      return '%';
    }
  };

  return {
    /**
     * JavaScript Pretty Date
     * Copyright (c) 2011 John Resig (ejohn.org)
     * Licensed under the MIT and GPL licenses.
     *
     * @original http://ejohn.org/blog/javascript-pretty-date/
     * @param {String|Number} time
     * @param {String|Number} [now]
     */
    pretty: function(time, now) {
      var date     = new Date(time.replace(/-/g, '/')),
          diff     = (( (now || Date.now()) - date.getTime() ) / 1000),
          day_diff = Math.floor(diff / 86400);

      if (isNaN(day_diff) || day_diff < 0 || day_diff >= 31) {
        return date.getMonth()+1 + '月 ' + date.getDate() + '日';
      }

      return day_diff === 0 && (
             diff < 60      && Math.floor(diff) + '秒前' ||
               diff < 120   && '1分前' ||
               diff < 3600  && Math.floor(diff / 60) + '分前' ||
               diff < 7200  && '1時間前' ||
               diff < 86400 && Math.floor(diff / 3600) + '時間前'
             ) ||
             day_diff === 1 && '昨日' ||
             day_diff < 7   && day_diff + '日前' ||
             day_diff < 31  && Math.floor(day_diff / 7) + '週間前';
    },
    prettyToEl: function($dates) {
      _.each($dates, function(el) {
        el.textContent = Util.date.pretty(el.getAttribute('datetime'));
        el.className   = el.className.replace('js-pretty-date', '');
      });
    },

    /**
     * version 0.11 by Daniel Rench
     * More information: http://dren.ch/strftime/
     * This is public domain software
     *
     * Some modification by tokuhirom.
     * Tokuhirom's modifications are public domain, too.
     *
     * @original https://github.com/tokuhirom/strftime-js
     * @param {Date|Number|String} date
     * @param {String} fmt
     * @param {String} [locale]
     * @returns {string}
     */
    strftime: function(date, fmt, locale) {
      var ret = '', n = 0, char;
      if (!locale) {
        locale = 'ja';
      }
      if (!_.isDate(date) && !_.isNumber(date)) {
        date = new Date(date.replace(/-/g, '/'));
      } else {
        date = new Date(date);
      }
      while (n < fmt.length) {
        char = fmt.substring(n, n + 1);
        if (char === '%') {
          char = fmt.substring(++n, n + 1);
          ret += (formats[char]) ? formats[char](date, locale) : char;
        } else {
          ret += char;
        }
        ++n;
      }
      return ret;
    },
    strftimeToEl: function($dates, format) {
      _.each($dates, function(el) {
        el.textContent = Util.date.strftime(el.getAttribute('datetime'), format);
        el.className   = el.className.replace('js-strf-date', '');
      });
    },

    /**
     * 指定した期間内かどうかを判定する
     * @param {String} since 2013-08-26 00:00:00
     * @param {String} until 2032-12-24 23:59:59
     * @return {Boolean}
     */
    withinTerm: function(since, until) {
      since = (new Date(since.replace(/-/g, '/'))).getTime();
      until = (new Date(until.replace(/-/g, '/'))).getTime();
      return DATE_NOW >= since && DATE_NOW <= until;
    }
  };
})();