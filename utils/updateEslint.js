/**
 * A util to run once changes to the eslint boilerplate files need
 * to be pushed to the unit repos. The function will identify which
 * files were changed using NodeGit, create feature branches and PRs
 * in each repo that needs them, and merge the PRs.
 */

const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const { Repository, Diff, DiffOptions } = require('nodegit');
const { mergeWithCustomize, customizeArray } = require('webpack-merge');
require('colors');
const UnitConfig = require('../unit-config');
const EslintConfig = require('../unit-config/eslint-boilerplates');

const unitConfig = UnitConfig.readSync();
const ROOT = path.resolve(__dirname, '..');
const ESLINTRC = '.eslintrc.json';

// values needed to create the commit
const FEAT_BRANCH = process.env.npm_config_feat_branch || 'update-eslint';
const COMMIT_MSG = 'update eslint config';

// values used in the `gh pr` command
// the exact repo needs to be specified if working on a forked copy
const PR_TITLE = `Update ${ESLINTRC}`;
let PR_BODY = `Updating config file based on edits made to the following templates: %TEMPLATE`;

(async function () {
  /*
   * Figure out which eslint templates have diffs
   */
  const repo = await Repository.open(`${ROOT}`);
  // get a reference to the file state (tree) of most recent commit
  // TODO: figure out if head commit points to local HEAD or origin/head
  const headTree = await repo.getHeadCommit().then((head) => head.getTree());
  // only compare files in the eslint templates folder
  const diffOptions = new DiffOptions();
  diffOptions.pathspec = `unit-config/eslint-boilerplates`;
  // get the diff between the most recent commit and the current working directory tree
  const treeDiff = await Diff.treeToWorkdir(repo, headTree, diffOptions);
  // parse the list of diffs and get the eslint file names
  const treePatches = await treeDiff.patches();
  const updatedFiles = treePatches.map((patch) => {
    const paths = patch.oldFile().path().split('/');
    const file = paths[paths.length - 1];
    return file;
  });
  // TODO: instead of exiting, confirm whether user wants to proceed anyway
  if (!updatedFiles.length) {
    return console.log('No changes found in any eslint config files.'.red);
  }
  console.log('Changes found in these eslint config files:'.yellow);
  updatedFiles.forEach((file) => console.log(file));
  PR_BODY = PR_BODY.replace('%TEMPLATE', updatedFiles.join(', '));
  console.log('\n');

  /*
   * Check which units list those eslint templates in their configs
   */
  console.log('Units that need to be updated:'.yellow);
  const unitsToUpdate = Object.keys(unitConfig).filter((unit) => {
    for (let i = 0; i < updatedFiles.length; i++) {
      // if (unit === 'unit-6-react-tic-tac-toe') {
      if (unitConfig[unit].eslint.includes(updatedFiles[i])) {
        console.log(unit);
        return true;
      }
    }
    console.log(unit.grey);
    return false;
  });
  console.log('\n');

  /*
   * Update each unit repo accordingly
   */
  // memoize eslint config calculation since many of the units will
  // probably have the same config
  const eslintCache = {};

  for (let unit of unitsToUpdate) {
    process.stdout.write(`updating ${unit} ...\n`);
    let repo;
    let index;
    let head;
    Repository.open(`${ROOT}/${unit}`)
      .then(async (repoResult) => {
        /*
         * Create a feature branch and checkout to it
         */
        repo = repoResult;
        head = await repo.getHeadCommit();
        const branchRef = await repo.createBranch(FEAT_BRANCH, head, true);
        await repo.checkoutBranch(branchRef);
      })
      .catch((err) => {
        // repo.createBranch will throw an error if current checked out branch
        // is already named update-eslint, but that doesn't prevent functionality
        // TODO: confirm with user if it's okay to keep working in the branch
        // instead of just continuing
        if (err.errorFunction === 'Branch.create' && err.errno === -1) {
          return;
        }
        // actually throw any other errors
        else throw err;
      })
      .then(async () => {
        /*
         * Generate new eslintrc based on the templates
         */
        const key = JSON.stringify(unitConfig[unit].eslint);
        if (!eslintCache[key]) {
          const objects = unitConfig[unit].eslint.map((configName) =>
            EslintConfig.readSync(configName)
          );
          // use webpack-merge to merge config objects
          // TODO: separate into it's own function so merging can be
          // customized on a unit-by-unit basis if necessary
          eslintCache[key] = mergeWithCustomize({
            customizeArray: customizeArray({
              extends: 'append',
              plugins: 'append',
            }),
          })(objects);
        }
        // write to each unit repo's eslintrc
        fs.writeFileSync(
          path.resolve(repo.workdir(), ESLINTRC),
          JSON.stringify(eslintCache[key], null, 2)
        );
        /*
         * Commit the new eslintrc
         */
        // not 100% sure what this code is doing but it's copied from NodeGit's example
        // https://github.com/nodegit/nodegit/blob/master/examples/add-and-commit.js
        index = await repo.refreshIndex();
        await index.addByPath(ESLINTRC);
        await index.write();
        const tree = await index.writeTree();
        const signature = await repo.defaultSignature();
        return repo.createCommit(
          'HEAD',
          signature,
          signature,
          COMMIT_MSG,
          tree,
          [head]
        );
      })
      .then(() => {
        /*
         * Push commit by executing git push in the repo's directory
         */
        // I tried to push with nodegit but there's a bunch of auth hoops
        // to jump through so I went back to the CLI with exec
        exec(
          `git push origin ${FEAT_BRANCH}`,
          { cwd: repo.workdir() },
          (error) => {
            if (error) throw error;
          }
        );
      })
      .then(async () => {
        /*
         * Create a PR from the feature branch to the main/master branch
         */
        // const remote = await repo.getRemote('origin');
        // const remoteUrl = remote.url();
        // console.log(remoteUrl);
        // exec(
        //   `gh pr create --repo ${remoteUrl} --title "${PR_TITLE}" --body "${PR_BODY}" `,
        //   { cwd: repo.workdir() },
        //   (error) => {
        //     if (error) throw error;
        //   }
        // );
        /*
         * TODO: Merge the PR
         */
      })
      .then(() => console.log('Finished (sort of)!'.green))
      .catch((err) => {
        console.log(err);
      });
  }
})();
