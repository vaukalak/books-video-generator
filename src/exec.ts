import * as cp from "child_process";

export async function exec(command: string, options: cp.ExecOptions = {}): Promise<string> {
  return new Promise((res, rej) => {
    console.log(command);
    cp.exec(command, options, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        rej(err);
      } else {
        res(stdout);
      }
    });
  });
}