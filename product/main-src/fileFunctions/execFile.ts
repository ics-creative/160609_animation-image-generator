import { ExecFileException, execFile } from 'child_process';

/** execFileの実行結果 */
interface ExecFileResult {
  err: ExecFileException | null;
  stdout: string;
  stderr: string;
}

/** execFileのPromiseラッパーです */
export const waitExecFile = (
  file: string,
  options: string[]
): Promise<ExecFileResult> =>
  new Promise((resolve) => {
    console.log(`::exec ${file} ${options} ::`);
    execFile(file, options, (err, stdout, stderr) =>
      resolve({ err, stdout, stderr })
    );
  });
