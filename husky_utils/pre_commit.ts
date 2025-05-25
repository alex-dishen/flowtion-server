/* eslint-disable no-console */
import chalk from 'chalk';
import { exec } from 'child_process';
import { emptyLine } from './empty_line';
import { loader } from './loader';
import { logError, logSuccess } from './colorful_logs';

interface ParsedErrors {
  errors: string[];
  files: Record<string, number>;
}

const parseTypescriptErrors = (output: string): ParsedErrors => {
  const errorLines = output.split('\n');
  const errors: string[] = [];
  const files: Record<string, number> = {};

  for (const line of errorLines) {
    const pattern = /(.+)\((\d+),(\d+)\): error (.+)/;
    const match = line.match(pattern);

    if (match) {
      const filePath = match[1];
      const lineNumber = match[2];
      const columnNumber = match[3];
      const errorMessage = match[4].replace(/TS\d+:\s*/g, '');
      const numbers = `${lineNumber}:${columnNumber}`;

      const error = `${chalk.underline(`${filePath}:${numbers}`)}\n    ${chalk.dim(numbers)}  ${chalk.red('error')}  ${errorMessage}\n`;

      errors.push(error);

      if (files[filePath]) {
        files[filePath] += 1;
      } else {
        files[filePath] = 1;
      }
    }
  }

  return { errors, files };
};

const validateTypes = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const spinnerInterval = loader('Running type checking');
    exec('npm run tsc --noEmit', (error, stdout) => {
      clearInterval(spinnerInterval);
      emptyLine();

      if (error) {
        console.log(chalk.red('✖ tsc --noEmit\n'));
        const { errors, files } = parseTypescriptErrors(stdout);

        errors.forEach(err => console.log(err));

        let filesOutput = '';

        Object.entries(files).forEach(([key, value]) => {
          const fileOutput = `${value}  ${chalk.underline(key)} \n `;
          filesOutput += fileOutput;
        });

        const rejectError = `❌ You've got ${errors.length} TS errors in ${Object.keys(files).length} files:\n\n ${filesOutput}`;

        reject(new Error(rejectError));
      } else {
        logSuccess('Type validation successful, no errors found 🚀');
        resolve();
      }
    });
  });
};

const validateCodeStyle = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const spinnerInterval = loader('Checking code style');
    exec('npx lint-staged', (error, _stdout, stderr) => {
      clearInterval(spinnerInterval);
      emptyLine();

      if (error) {
        if (stderr) {
          console.log(stderr);
        }
        reject(new Error('Code style is out of order 😢\n'));
      } else {
        logSuccess('Code style is great 👍\n');
        resolve();
      }
    });
  });
};

const runPreCommitScripts = async (): Promise<void> => {
  try {
    await validateTypes();
    await validateCodeStyle();
  } catch (error) {
    if (error instanceof Error) {
      logError(error.message);
    }
    process.exit(1);
  }
};

runPreCommitScripts();
