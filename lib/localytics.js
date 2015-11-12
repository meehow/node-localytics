'use strict';

var https = require('https');

module.exports = function init(key, secret) {
  return new Localytics(
    key || process.env.LOCALYTICS_KEY,
    secret || process.env.LOCALYTICS_SECRET);
};

function Localytics(key, secret) {
  if (!key || !secret) throw new Error('LOCALYTICS_KEY or LOCALYTICS_SECRET is not defined');
  this.authHeader = 'Basic ';
  this.authHeader += new Buffer(key + ':' + secret, 'utf8').toString('base64');
  this.agent = new https.Agent();
}

function promisyfy(resolve, reject, res) {
  var data = [];
  res.on('data', data.push.bind(data));
  res.on('end', function() {
    if (res.statusCode == 204) {
      resolve();
    } else if (res.statusCode >= 200 && res.statusCode < 300) {
      resolve(JSON.parse(Buffer.concat(data)));
    } else {
      reject(new Error(res.statusMessage));
    }
  });
}

var contentType = 'application/json';

Localytics.prototype.request = function(opts) {
  var headers = {
    'User-Agent': 'node-localytics',
    'Authorization': this.authHeader,
  };
  var content;
  if (opts.data) {
    content = JSON.stringify(opts.data);
    headers['Content-Type'] = contentType;
    headers['Content-Length'] = Buffer.byteLength(content, 'utf8');
  }
  var httpsOpts = {
    agent: this.agent,
    hostname: opts.hostname,
    path: opts.path,
    method: opts.method,
    headers: headers,
  };
  return new Promise(function(resolve, reject) {
    var req = https.request(httpsOpts, promisyfy.bind(null, resolve, reject));
    req.on('error', reject);
    if (content) {
      req.write(content);
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
    method: 'PATCH',
    path: '/v1/profiles/' + id,
    data: {
      attributes: attributes,
    }
  });
};

Localytics.prototype.deleteProfile = function(id) {
  return this.request({
    hostname: 'profile.localytics.com',
    method: 'DELETE',
    path: '/v1/profiles/' + id,
  });
};
