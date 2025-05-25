const checkDependencies = require('check-dependencies');
const chalk = require('chalk');

function checkProjectDependencies() {
  checkDependencies().then(({ error }) => {
    if (error.length > 0) {
      console.error('\n❌ Dependencies are outdated or missing!\n');
      console.error("💡 Run 'npm install' to fix this.");

      process.exit(1);
    } else {
      const logText = chalk.green('Dependencies are in order ✅\n');
      console.log(logText);
    }
  });
}

module.exports = { checkProjectDependencies };
