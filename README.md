Aggregated repo for the curriculum units and various utilities for maintaining them. Each unit repository is added as a submodule.

Don't forget to `npm install`!

## Requirements for running utils
- Node
- Git
- GitHub CLI

## unitConfig.json and UnitConfig

The `unit-config` folder contains a utility class with some useful methods for manipulating the `unitConfig.json` file. The JSON file currently only contains which eslint boilerplates should be used to construct each units `eslintrc.json`, but could hold other useful config properties and metadata in the future.

The config object for each unit currently has this structure:

```
unit-name: {
  origin: the URL for the remote
  eslint: an array of eslint boilerplate file names that would be used to compose the unit's eslintrc. *The order matters* as configs are merged from left to right.
}
```

## utils

- `addUnitSubmodules.js` - a script that iterates over the `unitConfig.json` and adds each `origin` value as a submodule
- `printEachModule.sh` - a test bash script to test the `git submodule foreach` command
- `updateEslint.js` - a script that updates the eslintrc files of any repos that depend on some changed eslint boilerplate file