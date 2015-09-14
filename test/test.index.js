'use strict';

process.env.NODE_ENV = 'test';

var should = require('should');

var OVouch = require('../index');
var ovouch;

beforeEach(function() {
  ovouch = null;
});

describe('OVouch', function() {
  it('should add to a trusted network', function(done) {
    ovouch = new OVouch();
    ovouch.vouchMin = 2;

    var key1 = '111';
    var user1 = {
      name: 'trusted user 1'
    };

    var key2 = '222';
    var user2 = {
      name: 'trusted user 2'
    };

    ovouch.addToTrustedNetwork(key1, user1);
    ovouch.trustedNetwork[key1].should.equal(user1);
    ovouch.addToTrustedNetwork(key2, user2);
    ovouch.trustedNetwork[key2].should.equal(user2);
    Object.keys(ovouch.trustedNetwork).length.should.equal(2);
    done();
  });

  it('should keep someone in the network and not move them to the vouched network', function(done) {
    ovouch = new OVouch();
    ovouch.vouchMin = 2;

    var key = '333';
    var user = {
      name: 'vouched user 3'
    };

    var trusted1 = '111';
    var user1 = {
      name: 'trusted user 1'
    };

    ovouch.addToTrustedNetwork(trusted1, user1);
    ovouch.addToNetwork(key, user);
    ovouch.network[key].should.equal(user);
    ovouch.addVouch(key, trusted1);
    should.not.exist(ovouch.vouchedNetwork[key]);
    done();
  });

  it('should add someone to the vouched network and remove them from the network', function(done) {
    ovouch = new OVouch();
    ovouch.vouchMin = 2;

    var key = '333';
    var user = {
      name: 'vouched user 3'
    };

    var trusted1 = '111';
    var user1 = {
      name: 'trusted user 1'
    };

    var trusted2 = '222';
    var user2 = {
      name: 'trusted user 2'
    };

    ovouch.addToNetwork(key, user);
    ovouch.addToTrustedNetwork(trusted1, user1);
    ovouch.addToTrustedNetwork(trusted2, user2);

    ovouch.addVouch(key, trusted1);
    ovouch.addVouch(key, trusted2);
    should.exist(ovouch.vouchedNetwork[key]);
    should.exist(ovouch.vouchedNetwork[key].vouchedBy[trusted1]);
    should.exist(ovouch.vouchedNetwork[key].vouchedBy[trusted2]);
    should.not.exist(ovouch.network[key]);
    done();
  });

  it('should remove a vouch and remove them from the vouched network', function(done) {
    ovouch = new OVouch();
    ovouch.vouchMin = 2;

    var key = '333';
    var user = {
      name: 'vouched user 4'
    };

    var trusted1 = '111';
    var user1 = {
      name: 'trusted user 1'
    };

    ovouch.addToNetwork(key, user);
    ovouch.addToTrustedNetwork(trusted1, user1);
    ovouch.removeVouch(key, trusted1);

    should.not.exist(ovouch.network[key].vouchedBy[trusted1]);
    should.not.exist(ovouch.vouchedNetwork[key]);
    should.exist(ovouch.network[key]);
    done();
  });

  it('should remove from the trusted network', function(done) {
    ovouch = new OVouch();
    ovouch.vouchMin = 2;

    var trusted1 = '111';
    var user1 = {
      name: 'trusted user 1'
    };

    ovouch.addToTrustedNetwork(trusted1, user1);

    ovouch.removeFromTrustedNetwork(trusted1);
    should.not.exist(ovouch.trustedNetwork[trusted1]);
    done();
  });

  it('should not vouch if the voucher is not in the trusted network', function(done) {
    ovouch = new OVouch();
    ovouch.vouchMin = 2;

    var key = '444';
    var user = {
      name: 'vouched user 4'
    };

    var trusted1 = '111';
    var user1 = {
      name: 'trusted user 1'
    };

    ovouch.addToTrustedNetwork(trusted1, user1);

    ovouch.addToNetwork(key, user);
    ovouch.addVouch(key, trusted1);
    should.not.exist(ovouch.vouchedNetwork[key]);
    done();
  });

  it('should ban a user and remove them from all networks', function(done) {
    ovouch = new OVouch();
    ovouch.vouchMin = 2;

    var key = '555';
    var user = {
      name: 'banned user'
    };

    var trusted1 = '111';
    var user1 = {
      name: 'trusted user 1'
    };

    var trusted2 = '222';
    var user2 = {
      name: 'trusted user 2'
    };

    ovouch.addToTrustedNetwork(key, user);
    should.exist(ovouch.trustedNetwork[key]);
    ovouch.banUser(key);
    should.not.exist(ovouch.trustedNetwork[key]);
    should.exist(ovouch.banned[key]);

    ovouch.addToNetwork(key, user);
    should.exist(ovouch.network[key]);
    ovouch.banUser(key);
    should.not.exist(ovouch.network[key]);
    should.exist(ovouch.banned[key]);

    ovouch.addToNetwork(key, user);
    ovouch.addToTrustedNetwork(trusted1, user1);
    ovouch.addToTrustedNetwork(trusted2, user2);
    ovouch.addVouch(key, trusted1);
    ovouch.addVouch(key, trusted2);
    should.exist(ovouch.vouchedNetwork[key]);
    ovouch.banUser(key);
    should.not.exist(ovouch.vouchedNetwork[key]);
    should.exist(ovouch.banned[key]);
    done();
  });

  it('should unban a user', function(done) {
    ovouch = new OVouch();
    var key = '555';
    var user = {
      name: 'banned user'
    };

    ovouch.addToNetwork(key, user);
    ovouch.banUser(key);
    ovouch.unbanUser(key);
    should.not.exist(ovouch.banned[key]);
    should.not.exist(ovouch.network[key]);
    should.not.exist(ovouch.vouchedNetwork[key]);
    should.not.exist(ovouch.trustedNetwork[key]);
    done();
  });
});
