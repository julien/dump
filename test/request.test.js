describe('tests', function() {
  'use strict';
  describe('worker tests', function () {

    it('should', function () {
      expect(RequestWorker).to.throwError();
    });

    it('should emit events', function (done) {
      var rw = new RequestWorker('./js/request-worker.js');
      rw.on('data', function (data) {
        expect(data).to.be.an('object');
        expect(data).to.have.key('status');
        expect(data.status).to.eql(404);
        done();
      });
      rw.request({method: 'GET', url: 'non-existing'});

    });
  });
});
