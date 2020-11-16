const path = require('path');
const { Repository, Diff, DiffOptions } = require('nodegit');
const { exec } = require('child_process');
const UnitConfig = require('../unit-config');
const eslint = require('../unit-config/eslintConstants.js');

const execBash = (command, cb) => {
  if (!cb) exec(command, { shell: 'bash' });
  else exec(command, { shell: 'bash' }, cb);
};

const ROOT = path.resolve(__dirname, '..');
console.log(ROOT);

(async function () {
  // figure out which eslintrcs have diffs
  const repo = await Repository.open(`${ROOT}`);
  console.log('sha', (await repo.getHeadCommit()).sha());
  const headTree = await repo.getHeadCommit().then((head) => head.getTree());
  const diffOptions = new DiffOptions();
  diffOptions.pathspec = `unit-config/eslint-boilerplates`;
  const indexDiff = await Diff.indexToWorkdir(repo, null, diffOptions);
  const treeDiff = await Diff.treeToWorkdirWithIndex(repo, headTree, diffOptions);
  const indexPatches = await indexDiff.patches();
  const treePatches = await treeDiff.patches();
  indexPatches.forEach(async (patch) => {
    console.log('index', patch.newFile().path());
    patch.hunks().then((hunks) => {
      hunks.forEach((hunk) => console.log(hunk.header()));
    });
  });
  treePatches.forEach((patch) => {
    console.log('tree', patch.oldFile().path());
    patch.hunks().then((hunks) => {
      hunks.forEach((hunk) => console.log(hunk.header()));
    });
  });
  // check which units list those eslintrcs in their configs
  // for each unit repo
  // create a feature branch
  // generate new eslintrc based on the templates
  // commit the new eslintrc
  // create a PR
  // merge the PR
})();
