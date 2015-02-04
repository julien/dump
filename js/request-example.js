(function () { 'use strict';

  var url = './package.json';

  var worker = new RequestWorker('./request-worker.js');
  worker.on('error', function () {
    console.log('Worker error', err);
  });

  worker.on('data', function (data) {
    console.log('data', data);
  }, true); // Add handler once

  worker.request({
    headers: {'Content-Type': 'application/json', 'X-Secret-Token': 'Tokenizer'},
    url: url, method: 'GET' });

  req.request({method: 'GET', url: url});
  req.request({method: 'GET', url: url});
  req.request({method: 'GET', url: url});
  req.request({method: 'GET', url: url});

}());
