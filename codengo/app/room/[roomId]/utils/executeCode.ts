import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { v4 as uuidv4 } from "uuid";

export function executeCpp(code: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const filename = `${uuidv4()}.cpp`;
    const filepath = path.join("/tmp", filename);

    fs.writeFileSync(filepath, code);

    const command = `docker run --rm -v /tmp:/code -w /code solanki018/cpp-runner sh -c "g++ ${filename} -o main && ./main"`;
        
    exec(command, (error, stdout, stderr) => {
      fs.unlinkSync(filepath); // clean up

      if (error) {
        reject(stderr || error.message);
      } else {
        resolve(stdout);
      }
    });
  });
}
