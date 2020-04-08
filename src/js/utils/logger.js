'use strict';

/* eslint no-console: off */

/**
 * This file needs to use `require` rather than `import` to be able to be used
 * by webpack.
 *
 * We use this in the router as well, so keep it light and ES5 only!
 */

module.exports = function (logLevel) {
  function Logger (prefix) {
    if (logLevel === undefined && typeof window !== 'undefined') {
      // The logLevel may be set in localstorage
      // e.g. localStorage.setItem('skylineos.clsp-player.logLevel', 3), then refresh
      logLevel = isNaN(Number(window.localStorage.getItem('skylineos.clsp-player.logLevel')))
        ? 1
        : Number(window.localStorage.getItem('skylineos.clsp-player.logLevel'));

      window.localStorage.setItem('skylineos.clsp-player.logLevel', logLevel);
    }

    this.logLevel = logLevel;
    this.prefix = prefix;
  }

  Logger.factory = function (prefix) {
    return new Logger(prefix || '');
  };

  Logger.prototype._constructMessage = function (type, message) {
    if (!this.prefix) {
      return message;
    }

    return this.prefix + ' (' + type + ')' + ' --> ' + message;
  };

  Logger.prototype.silly = function (message) {
    if (this.logLevel >= 4) {
      console.log(this._constructMessage('silly', message));
    }
  };

  Logger.prototype.debug = function (message) {
    if (this.logLevel >= 3) {
      console.log(this._constructMessage('debug', message));
    }
  };

  Logger.prototype.info = function (message) {
    if (this.logLevel >= 2) {
      console.log(this._constructMessage('info', message));
    }
  };

  Logger.prototype.warn = function (message) {
    if (this.logLevel >= 1) {
      console.warn(this._constructMessage('warn', message));
    }
  };

  Logger.prototype.error = function (message) {
    console.error(this._constructMessage('error', message));
  };

  return Logger;
}
