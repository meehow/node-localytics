'use strict';

var localytics = require('localytics')('', '');

localytics.setProfile('Bob', {
  $first_name: 'Bob',
  favoriteNumber: 7,
}).then(console.log).catch(console.log);
