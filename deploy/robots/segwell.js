'use strict';
const path = require('path');
const robots = require('yogastudio/api/robots');
const scripts = require('yogastudio/api/scripts');


scripts.scriptRegistry.run_segwell = {
  path: require.resolve('../../segwell/run_segwell.js'),
  options: []
};

robots.robotRegistry.segwell = {
  needsLock: false,
  scripts: [
    {
      name: 'run_segwell',
      options: [
        {
          name: 'duration',
          default: 5,
          type: 'R',
        },
      ]
    }
  ]
};
