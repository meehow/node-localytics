[Localytics](http://www.localytics.com/) API wrapper.

- Configurable from __env__ variables or a source code
- Returns a promise
- Don't require external modules
- Capable of using Keep-Alive connections

So far only [Profiles API](http://docs.localytics.com/index.html#Dev/Profiles/api.html)
is implemented.

Installation
============

`npm i localytics --save`

Usage
=====

Define API Keys `LOCALYTICS_KEY` and `LOCALYTICS_SECRET`. You can find them in your
[localitics profile](https://dashboard.localytics.com/settings/apikeys).

Keys can be passed from env or as arguments when library is initialized:
```javascript
var localytics = require('localytics')('MY_API_KEY', 'MY_API_SECRET');
```
or from shell, or [Heroku Config Vars](https://devcenter.heroku.com/articles/config-vars)
```bash
export LOCALYTICS_KEY="MY_API_KEY"
export LOCALYTICS_SECRET="MY_API_SECRET"
```

Example
=======
```javascript
var localytics = require('localytics')();

localytics.setProfile('Bob', {
  $first_name: 'Bob',
  favoriteNumber: 7,
  toDelete: null,
}).then(console.log).catch(console.log);
```

Promises
=========

### `setProfile(id, data)`

### `getProfile(id)`

### `deleteProfile(id)`

To Do
=====

- Add [Push API](http://docs.localytics.com/index.html#Dev/transactional-push.html)
- Add [Query API](http://docs.localytics.com/index.html#Dev/query-api.html)
