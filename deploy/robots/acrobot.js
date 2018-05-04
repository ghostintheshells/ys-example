'use strict';
const path = require('path');
const robots = require('yogastudio/api/robots');
const scripts = require('yogastudio/api/scripts');


scripts.scriptRegistry.run_acrobot = {
  path: require.resolve('../../run_acrobot.js'),
  options: []
};

robots.robotRegistry.acrobot = {
  needsLock: false,
  scripts: [
    {
      name: 'run_acrobot',
      options: [
        {
          name: 'duration',
          default: 20,
          type: 'R',
        },
      ]
    }
  ]
};
