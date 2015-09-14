'use strict';

var OVouch = function() {
  // Minimum number of vouches by trusted network before a recommendation is
  // suggested.
  this._vouchMin = 0;

  /*
   *  All trusted users in your network.
   *  Format for user object is:
   *  {
   *    "userID": {
   *      "name": ""
   *    },
   *  }
   *
   *  If `this.vouchMin` is 0, then it means you will share all information to
   *  all users in the system and do not require vouching for access.
   */
  this._trustedNetwork = {};

  /*
   *  All vouched users in your network.
   *  Format for user object is:
   *  Format for user object is:
   *  {
   *    "userID": {
   *      "name": "",
   *      "vouchedBy": {}
   *    },
   *  }
   *
   *  If `this.vouchMin` is 0, then it means you will share all information to
   *  all users in the system and do not require vouching for access.
   */
  this._vouchedNetwork = {};

  /*
   *  All users in your network.
   *  Format for user object is:
   *  {
   *    "userID": {
   *      "name": "",
   *      "vouchedBy": {}
   *    },
   *  }
   *
   */
  this._network = {};

  // All banned users.
  this._banned = {};
};

OVouch.prototype = {
  get vouchMin() {
    return this._vouchMin;
  },

  set vouchMin(min) {
    this._vouchMin = parseInt(min, 10) || 0;
  },

  get trustedNetwork() {
    return this._trustedNetwork;
  },

  get vouchedNetwork() {
    return this._vouchedNetwork;
  },

  get network() {
    return this._network;
  },

  get banned() {
    return this._banned;
  },

  addToTrustedNetwork: function(key, userObj) {
    this._trustedNetwork[key] = userObj;
    delete this._network[key];
  },

  removeFromTrustedNetwork: function(key) {
    delete this._trustedNetwork[key];
  },

  addToNetwork: function(key, userObj) {
    userObj.vouchedBy = {};
    this._network[key] = userObj;
  },

  removeFromNetwork: function(key) {
    delete this._network[key];
  },

  addVouch: function(key, voucherKey) {
    if (!this._trustedNetwork[voucherKey]) {
      return;
    }

    this._network[key].vouchedBy[voucherKey] = true;

    if (Object.keys(this._network[key].vouchedBy).length >= this._vouchMin) {
      this._vouchedNetwork[key] = this._network[key];
      delete this._network[key];
    }
  },

  removeVouch: function(key, voucherKey) {
    if (this._vouchedNetwork[key]) {
      delete this._vouchedNetwork[key].vouchedBy[voucherKey];

      if (Object.keys(this._vouchedNetwork[key].vouchedBy).length < this._vouchMin) {
        this.addToNetwork(key, this._vouchedNetwork[key]);
        delete this._vouchedNetwork[key];
      }

      return;
    }

    delete this._network[key].vouchedBy[voucherKey];
  },

  banUser: function(key) {
    this.removeFromTrustedNetwork(key);
    delete this._vouchedNetwork[key];
    this.removeFromNetwork(key);
    this._banned[key] = true;
  },

  unbanUser: function(key) {
    delete this._banned[key];
  }
};

module.exports = OVouch;
