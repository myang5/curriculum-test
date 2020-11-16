# Linting Boilerplates

Note: make sure to rename to `.eslintrc.json` when using these.

### Various boilerplates building from eslint-recommends

#### eslint-basic-boilerplate.json
- Extends eslint:recommended, has basic environments and formatting rules declared.
- `root: true` makes sure the no other eslintrc files are used.
- `ignorePatterns` ignoring test directories entirely.
- `no-unused-vars` turned off for top level functions only. Unused vars inside of functions will still be flagged.

#### eslint-csps.json
- Config from Codesmith's public site repo to be used as a reference.

#### eslint-react.json
- Adds React-specific plugins and rules. Should be combined with `eslint-basic-boilerplate.json` when creating the `.eslintrc.json` file.
- npm packages that need to be installed in addition to eslint: `eslint-import-resolver-webpack eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react`
- `"import/resolver": "webpack"` is used to lint import statements using wepback's dependency graph and can detect when components are not properly imported.






