const { checkNodeVersion } = require('./check-node-version');
const { checkProjectDependencies } = require('./check-dependencies');

function runPreChecks() {
  checkNodeVersion();
  checkProjectDependencies();
}

runPreChecks();
