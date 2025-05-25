/* eslint-disable no-console */
import chalk from 'chalk';

const logError = (...text: string[]) => {
  console.log(chalk.white.bgRed(' ERROR: '), chalk.red(...text));
};

const logSuccess = (...text: string[]) => {
  console.log(chalk.white.bgGreen(' SUCCESS: '), chalk.green(...text));
};

export { logError, logSuccess };
