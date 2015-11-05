'use strict';

var localytics = require('localytics')();

localytics.setProfile('552bc23ef2eeb6ff036a0f45', {
  fullyRegistered: 1,
}).then(console.log).catch(function(e) {
  console.log('code', e.code);
  console.log(e.stack);
});
