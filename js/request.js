// RequestWorker handles HTTP requests
// in a WebWorker to free to main UI thread
(function (exports) {
  'use strict';

  var _slice = Array.prototype.slice;

  function Emitter() {
    this.handlers = [];
  }

  Emitter.prototype.on = function (ev, fn, once) {
    var i = 0, l = (this.handlers[ev] || (this.handlers[ev] = [])).len;
    for ( ; i < l; i++) {
      if (this.handlers[ev][i] === fn) return;
    }
    if (once) fn.once = 1;
    this.handlers[ev][this.handlers[ev].length] = fn;
  };

  Emitter.prototype.off = function (ev, fn) {
    if (this.handlers[ev]) {
      var l = this.handlers[ev].length;
      while(l--) {
        if (this.handlers[ev][l] === fn) {
          this.handlers[ev].splice(l, 1);
        }
      }
    }
  };

  Emitter.prototype.emit = function (ev) {
    if (this.handlers[ev]) {
      var args = _slice.call(arguments, 1);
      var i = 0, l = this.handlers[ev].length, fn;
      for ( ; i < l; i++) {
        fn = this.handlers[ev][i];
        fn.apply(null, args);
        if (fn.once) this.handlers[ev].splice(i, 1);
      }
    }
  };

  function RequestWorker(path) {
    Emitter.call(this);
    this.path = path;
    this.worker = new Worker(this.path);
    this.worker.onmessage = this.onMessage.bind(this);
    this.worker.onerror = this.onError.bind(this);

    this.busy_ = false;
    this.pending_ = [];
  }

  RequestWorker.prototype = new Emitter();
  RequestWorker.prototype.constructor = RequestWorker;

  RequestWorker.prototype.request = function (opts) {

    if (!this.busy_) {
      opts = opts || {};
      opts.method = opts.method || 'GET';
      this.worker.postMessage(opts);
      this.busy_ = true;
    } else {
      this.pending_[this.pending_.length] = opts;
    }

  };

  RequestWorker.prototype.onMessage = function (e) {
    this.emit('data', e.data);
    this.busy_ = false;
    if (this.pending_.length > 0) {
      var opts = this.pending_.pop();
      this.request(opts);
    } else {
      this.emit('end');
    }
  };

  RequestWorker.prototype.onError = function (e) {
    this.emit('error', e.message, e.filename, e.lineno);
  };

  RequestWorker.prototype.terminate = function () {
    this.worker.terminate();
  };

  exports.RequestWorker = RequestWorker;

}(typeof exports !== 'undefined' ? exports : window));
