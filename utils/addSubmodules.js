const { exec } = require('child_process');
const UnitConfig = require('../unit-config');
require('colors');

// get the unit config object
const unitConfig = UnitConfig.readSync();

// add each unit repo URL as a submodule
Object.entries(unitConfig).forEach(([unit, config]) => {
  console.log(`adding ${unit}`);
  exec(`git submodule add ${config.origin}`, { shell: 'bash' });
});

console.log('Finished!'.green);
