'use strict';

var https = require('https');

module.exports = function init(key, secret) {
  return new Localytics(
    key || process.env.LOCALYTICS_KEY,
    secret || process.env.LOCALYTICS_SECRET);
};

function Localytics(key, secret) {
  this.authHeader = 'Basic ';
  this.authHeader += new Buffer(key + ':' + secret, 'utf8').toString('base64');
  this.agent = new https.Agent();
}

function promisyfy(resolve, reject, res) {
  var data = [];
  res.on('data', function(chunk) {
    data.push(chunk);
  });
  res.on('end', function() {
    var json = JSON.parse(Buffer.concat(data));
    if (res.statusCode >= 200 && res.statusCode < 300) {
      resolve(json);
    } else {
      var error = new Error(json.error);
      error.code = res.statusCode;
      reject(error);
    }
  });
}

var contentType = 'application/json';

Localytics.prototype.request = function(opts) {
  var headers = {
    'User-Agent': 'MoZiLlA',
    'Authorization': this.authHeader,
  };
  var postData;
  if (opts.data) {
    postData = JSON.stringify(opts.data);
    headers['Content-Type'] = contentType;
    headers['Content-Length'] = Buffer.byteLength(postData, 'utf8');
  }
  var httpsOpts = {
    agent: this.agent,
    hostname: opts.hostname,
    path: opts.path,
    method: opts.data ? 'POST': 'GET',
    headers: headers,
  };
  return new Promise(function(resolve, reject) {
    var req = https.request(httpsOpts, promisyfy.bind(null, resolve, reject));
    req.on('error', reject);
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
};

Localytics.prototype.getProfile = function(id) {
  return this.request({
    hostname: 'profile.localytics.com',
    path: '/v1/profiles/' + id,
  });
};

Localytics.prototype.setProfile = function(id, attributes) {
  return this.request({
    hostname: 'profile.localytics.com',
    path: '/v1/profiles/' + id,
    data: {
      attributes: attributes,
    }
  });
};
