const UnitConfig = require('../unit-config');
const eslint = require('../unit-config/eslintConstants.js');
const { exec } = require('child_process');

// figure out which eslintrcs have diffs
// check which units list those eslintrcs in their configs
// for each unit repo
  // create a feature branch
  // generate new eslintrc based on the templates
  // commit the new eslintrc
  // create a PR
  // merge the PR
