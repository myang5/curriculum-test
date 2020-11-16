Aggregated repo for the curriculum units and various utilities for maintaining them. Each unit repository is added as a submodule.

Don't forget to `npm install`!

## Requirements for running utils
- Node
- Git
- GitHub CLI

## unitConfig.json and UnitConfig

The `unit-config` folder contains a utility class with some useful methods for manipulating the `unitConfig.json` file. The JSON file currently only contains which eslint boilerplates should be used to construct each units `eslintrc.json`, but could hold other useful config properties and metadata in the future.