const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
require('colors');

const unitConfig = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../unitConfig.json'))
);
Object.entries(unitConfig).forEach(([unit, config]) => {
  console.log(`adding ${unit}`);
  exec(`git submodule add ${config.origin}`, { shell: 'bash' });
});
console.log('Finished!'.green);
