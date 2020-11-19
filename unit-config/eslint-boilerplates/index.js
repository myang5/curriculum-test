const fs = require('fs');
const path = require('path');
const { merge: webpackMerge } = require('webpack-merge');

class EslintConfig {
  static validConfigs = ['eslint-basic.json', 'eslint-react.json'];

  /**
   * Helper function to validate the config file name
   * @param  {string} config
   */
  static validate(config) {
    return this.validConfigs.includes(config);
  }

  /**
   * Read and parse the eslint config file
   * @param {string} config 
   */
  static read(config) {
    if (!this.validate(config)) {
      throw new TypeError(`${config} is not a valid eslint config`);
    }
    return JSON.parse(fs.readFile(path.resolve(__dirname, `./${config}`)))
  }

  /**
   * Read and parse the eslint config file synchronously
   * @param {string} config 
   */
  static readSync(config) {
    if (!this.validate(config)) {
      throw new TypeError(`${config} is not a valid eslint config`);
    }
    return JSON.parse(fs.readFileSync(path.resolve(__dirname, `./${config}`)))
  }

  /**
   * Merge eslint config objects using merge() from the webpack-merge package
   * @param {(string[]|string)} firstArg Function can be invoked with either
   * an array of config file names or with multiple file name arguments
   * @param {...string} args The rest of the config file names if invoked with
   * multiple arguments
   * @return The merged config object
   */
  static merge(firstArg, ...args) {
    if (firstArg === undefined)
      throw new TypeError('cannot invoke with 0 arguments');
    // arguments could be multiple strings args or a single array arg
    const configArr = Array.isArray(firstArg) ? firstArg : [firstArg, ...args];
    for (let i = 0; i < configArr.length; i++) {
      if (!this.validate(configArr[i])) {
        throw new TypeError(`${configArr[i]} is not a valid eslint config`);
      }
    }
    const objects = configArr.map((configName) =>
      JSON.parse(fs.readFileSync(path.resolve(__dirname, `./${configName}`)))
    );
    return webpackMerge(objects);
  }
}

module.exports = EslintConfig;
