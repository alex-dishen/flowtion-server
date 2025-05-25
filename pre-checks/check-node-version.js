const requiredVersion = require('../package.json').engines.node;
const semver = require('semver');
const chalk = require('chalk');

function checkNodeVersion() {
  if (!semver.satisfies(process.version, requiredVersion)) {
    console.error(`\n❌ Node.js version mismatch! Required: ${requiredVersion}, but found: ${process.version}\n`);
    console.error('🚀 Please use the correct version before running this project.');
    console.error('💡 Run "nvm use" and follow the instructions from nvm');

    process.exit(1);
  } else {
    const logText = chalk.green(`Your Node.js version(${process.version}) is suitable to work on the project ✅\n`);
    console.log(logText);
  }
}

module.exports = { checkNodeVersion };
