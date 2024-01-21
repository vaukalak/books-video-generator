const cp = require("child_process");

const exec = (command, options = {}) => {
  return new Promise((res, rej) => {
    console.log(command);
    cp.exec(command, options, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        rej(new Error(err));
      } else {
        res(stdout);
      }
    });
  });
};

module.exports = { exec };