const { exec } = require('child_process');
const { dirname } = require('path');

/**
 * Push commit by executing git push in the repo's directory
 * @param {string} branchName Name of the branch to push
 * @param {string} dirName Specify which directory to execute the command
 */
function pushCommit(branchName, dirName) {
  // I tried to push with nodegit but there's a bunch of auth hoops
  // to jump through so I went back to the CLI with exec
  return new Promise((resolve, reject) => {
    exec(`git push origin ${branchName}`, { cwd: dirName }, (error) => {
      if (error) reject(error);
      else resolve();
    });
  });
}

/**
 * Create a PR from the feature branch to the main/master branch
 * @param {string} branchName Name of the branch to PR from
 * @param {string} dirName Specify which directory to execute the command
 * @param {string} prTitle
 * @param {string} prBody
 */
function createPrToMain(branchName, dirName, prTitle, prBody) {
  return new Promise((resolve, reject) => {
    exec(
      `gh pr create --head ${branchName} --title "${prTitle}" --body "${prBody}"`,
      { cwd: dirName },
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

/**
 * Merge the PR from a feature branch to the main/master branch
 * @param {*} branchName Name of the branch the PR came from
 * @param {*} dirName Specify which directory to execute the command
 */
function mergePrToMain(branchName, dirName) {
  return new Promise((resolve, reject) => {
    exec(`gh pr merge ${branchName} --merge`, { cwd: dirName }, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

module.exports = {
  pushCommit,
  createPrToMain,
  mergePrToMain,
};
