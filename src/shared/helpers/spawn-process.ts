import { spawn } from 'node:child_process';

export interface SpawnProcessResult {
  data: string;
  errors: string[];
}

export async function spawnProcess(command: string, args: string[]): Promise<SpawnProcessResult> {
  return new Promise((resolve, reject) => {
    const process = spawn(command, [...args], { shell: true });

    const result: SpawnProcessResult = {
      data: '',
      errors: [],
    };

    process.stdout.on('data', data => {
      // Without transformation the data is a raw buffer: <Buffer 48 65 6c 6c 6f 2c 20 e4 b8 96 e7 95 8c 21>
      result.data = Buffer.from(data).toString('utf-8');
      // eslint-disable-next-line no-console
      console.log(Buffer.from(data).toString('utf-8'));
    });

    process.stderr.on('data', data => {
      // Without transformation the data is a raw buffer: <Buffer 48 65 6c 6c 6f 2c 20 e4 b8 96 e7 95 8c 21>
      result.errors.push(Buffer.from(data).toString('utf-8'));
      console.error(`${command} stderr: ${data}`);
    });

    process.on('close', code => {
      if (code === 0) {
        resolve(result);
      } else {
        reject(new Error(result.errors.join('\n')));
      }
    });
  });
}
