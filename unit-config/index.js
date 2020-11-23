const path = require('path');
const fs = require('fs');

const UNIT_CONFIG = path.resolve(__dirname, './unitConfig.json');

/**
 * Utility class to manipulate the unit config file.
 */
class UnitConfig {
  /**
   * Read and parse the unit config file.
   * @param {Function} [cb] Optional callback to be executed after reading
   * @returns the unit config as a JS object
   */
  static read(cb) {
    return cb
      ? JSON.parse(fs.readFile(UNIT_CONFIG))
      : JSON.parse(fs.readFile(UNIT_CONFIG), cb);
  }

  /**
   * Read and parse the unit config file synchronously.
   * @param {Function} [cb] Optional callback to be executed after reading
   * @return the unit config as a JS object
   */
  static readSync(cb) {
    return cb
      ? JSON.parse(fs.readFileSync(UNIT_CONFIG))
      : JSON.parse(fs.readFileSync(UNIT_CONFIG), cb);
  }

  /**
   * Write the new config object to the unit config file synchronously.
   * @param {Object} newConfig The JS object to write
   * @param {Function} [cb] Optional callback to be executed after reading
   */
  static write(newConfig, cb) {
    if (!cb)
      return fs.writeFile(UNIT_CONFIG, JSON.stringify(newConfig, null, 2));
    fs.writeFile(UNIT_CONFIG, JSON.stringify(newConfig, null, 2), cb);
  }

  /**
   * Write the new config object to the unit config file synchronously.
   * @param {Object} newConfig The JS object to write
   * @param {Function} [cb] Optional callback to be executed after reading
   */
  static writeSync(newConfig, cb) {
    if (!cb)
      return fs.writeFileSync(UNIT_CONFIG, JSON.stringify(newConfig, null, 2));
    fs.writeFileSync(UNIT_CONFIG, JSON.stringify(newConfig, null, 2), cb);
  }

  /**
   * Add/update the property on a specific unit
   * @param {String} unit The name of the unit
   * @param {String} prop The property name
   * @param {*} [value=null] Optional value to set for each property, defaults to null
   */
  static addPropertyTo(unit, prop, value) {
    if (typeof unit !== 'string')
      throw new TypeError('unit should be a string');
    if (typeof prop !== 'string')
      throw new TypeError('prop should be a string');
    const unitConfig = this.readSync();
    if (!Object.prototype.hasOwnProperty.call(unitConfig, prop))
      throw new ReferenceError('requested unit does not exist in config');
    unitConfig[unit][prop] = value ? value : null;
    this.writeSync(unitConfig);
  }

  /**
   * Add/update property on each unit's config object
   * @param {String} prop The property name
   * @param {*} [value=null] Optional value to set for each property, defaults to null
   */
  static addPropertyToAll(prop, value) {
    if (typeof prop !== 'string')
      throw new TypeError('prop should be a string');
    const unitConfig = this.readSync();
    Object.values(unitConfig).forEach((config) => {
      config[prop] = value ? value : null;
    });
    this.writeSync(unitConfig);
  }

  /**
   * Delete property from each unit's config object
   * @param {String} prop The property name
   */
  static deletePropertyFromAll(prop) {
    if (typeof prop !== 'string')
      throw new TypeError('prop should be a string');
    const unitConfig = this.readSync();
    Object.values(unitConfig).forEach((config) => {
      delete config[prop];
    });
    this.writeSync(unitConfig);
  }
}

module.exports = UnitConfig;
