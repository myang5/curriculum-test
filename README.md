Aggregated repo for the curriculum units and various utilities for maintaining them. Each unit repository is added as a submodule.

Don't forget to `npm install`!

## Requirements for running utils
- Node
- Git
- GitHub CLI

## Demo updateEslint.js
- Open `unit-config/eslint-boilerplates/eslint-react.json` and make a change to the file. Save the file but don't commit the change.
- Run `npm run update-eslint --feat-branch=<your branch name>`
- The terminal should indicate that changes were detected in `eslint-react.json`, and that `unit-6-react-tic-tac-toe` and `unit-7-react-redux` need to be updated (these repos list `eslint-react.json` in their `eslint` key in the `unitConfig.json` file).
- After the script finishes running, go to the links listed in the two units `origin` key in `unitConfig.json` file. You'll see that there are new PRs for each repo, ready to be merged (still working on doing that programmatically).

## unitConfig.json and UnitConfig

The `unit-config` folder contains a utility class with some useful methods for manipulating the `unitConfig.json` file. The JSON file currently only contains which eslint boilerplates should be used to construct each units `eslintrc.json`, but could hold other useful config properties and metadata in the future.

The config object for each unit currently has this structure:

```
unit-name: {
  origin: the URL for the remote
  eslint: an array of eslint boilerplate file names that would be used to compose the unit's eslintrc. *The order matters* as configs are merged from left to right.
}
```

## Scripts

- `add-submodules` - a script that iterates over the `unitConfig.json` and adds each `origin` value as a submodule

- `view-submodules` - a test bash script to test the `git submodule foreach` command

- `update-eslint` - a script that updates the eslintrc files of any repos that depend on some changed eslint boilerplate file.
Possible environment variables:
    - --feat-branch=\<the name of the branch> The default name will be `update-eslint`.
