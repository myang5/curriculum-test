const path = require('path');
require('colors');
const { Repository, Diff, DiffOptions } = require('nodegit');
const UnitConfig = require('../unit-config');
const eslint = require('../unit-config/eslintConstants.js');
const { Console } = require('console');

const ROOT = path.resolve(__dirname, '..');

(async function () {
  /*
   * Figure out which eslint templates have diffs
   */
  const repo = await Repository.open(`${ROOT}`);
  // get a reference to the file state (tree) of most recent commit
  const headTree = await repo.getHeadCommit().then((head) => head.getTree());
  // only compare files in the eslint templates folder
  const diffOptions = new DiffOptions();
  diffOptions.pathspec = `unit-config/eslint-boilerplates`;
  // get the diff between the repo tree and the working directory tree
  const treeDiff = await Diff.treeToWorkdir(repo, headTree, diffOptions);
  // parse the list of diffs and get the eslint file names
  const treePatches = await treeDiff.patches();
  const updatedFiles = treePatches.map((patch) => {
    const paths = patch.oldFile().path().split('/');
    const file = paths[paths.length - 1];
    return file;
  });
  if (!updatedFiles.length) {
    return console.log('No changes found in any eslint config files.'.red);
  }
  console.log('Changes found in these eslint config files:'.yellow);
  updatedFiles.forEach((file) => console.log(file));
  console.log('\n');

  /*
   * Check which units list those eslintrcs in their configs
   */
  const unitConfig = UnitConfig.readSync();
  console.log('Units that need to be updated:'.yellow);
  const unitsToUpdate = Object.keys(unitConfig).filter((unit) => {
    for (let i = 0; i < updatedFiles.length; i++) {
      if (unitConfig[unit].eslint.includes(updatedFiles[i])) {
        console.log(unit);
        return true;
      }
    }
    console.log(unit.grey);
    return false;
  });
  // for each unit repo
  // create a feature branch
  // generate new eslintrc based on the templates
  // commit the new eslintrc
  // create a PR
  // merge the PR
})();
