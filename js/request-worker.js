'use strict';

function createRequest(opts) {
  var req = new XMLHttpRequest();
  req.onreadystatechange = function () {
    var data;
    if (req.readyState === XMLHttpRequest.DONE) {
      if (req.status !== 200 && opts.retry) {
        opts.retry--;
        createRequest(opts);
        return;
      }
      data = req.getResponseHeader('Content-Type') === 'application/json' ? JSON.parse(req.responseText) : req.responseText;
      self.postMessage({status: req.status, data: data, headers: req.getAllResponseHeaders()});
    }
  };

  req.open(opts.method, opts.url);
  if (typeof opts.headers === 'object') {
    var p;
    for (p in opts.headers) { if (opts.headers.hasOwnProperty(p)) {
      req.setRequestHeader(p, opts.headers[p]);
    }}
  }
  req.send(opts.data);
  return req;
}

self.onmessage = function (e) {
  createRequest(e.data);
};
