import * as fs from "fs";

/*
From https://stackoverflow.com/questions/19275776/node-js-how-to-get-the-os-platforms-user-data-folder#26227660

The expected result is:
  * OS X: '~/Library/Preferences'
  * Windows 8: 'C:\Users\User\AppData\Roaming'
  * Windows XP: 'C:\Documents and Settings\User\Application Data'
  * Linux: '~/.config'
*/
export const userDataDir = process.env.APPDATA || (process.platform === 'darwin' ? process.env.HOME + 'Library/Preferences' : `/home/${process.env.USER}/.config`);

export const writeFile = (path: string, data: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export const readFile = (path: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.exists(path, (exists:boolean) => {
      if (!exists) {
        return reject();
      }
      fs.readFile(path, (err, data:Buffer) => {
        if (err) {
          return reject(err);
        }
        resolve(data.toString());
      });
    });
  });
};
