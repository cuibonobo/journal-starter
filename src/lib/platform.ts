import * as fs from "graceful-fs";
import * as writeFileAtomic from "write-file-atomic";

/*
From https://stackoverflow.com/questions/19275776/node-js-how-to-get-the-os-platforms-user-data-folder#26227660

The expected result is:
  * OS X: '~/Library/Preferences'
  * Windows 8: 'C:\Users\User\AppData\Roaming'
  * Windows XP: 'C:\Documents and Settings\User\Application Data'
  * Linux: '~/.config'
*/
export const getUserDataDir = (): string => {
  if (process.env.APPDATA) {
    return process.env.APPDATA;
  }
  if (process.platform === "darwin") {
    return process.env.HOME + "Library/Preferences";
  }
  return `/home/${process.env.USER}/.config`
};

export const writeFile = async (path: string, data: string): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    writeFileAtomic(path, data, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export const readFile = async (path: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    fs.readFile(path, (err, data:Buffer) => {
      if (err) {
        return reject(err);
      }
      resolve(data.toString());
    });
  });
};

export const isFile = async (path: string): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
    fs.lstat(path, (err: NodeJS.ErrnoException, stats: fs.Stats) => {
      if (err) {
        if(err.code === 'ENOENT'){
          return resolve(false);
        }
        return reject(err);
      }
      return resolve(stats.isFile());
    });
  });
}

export const isDirectory = async (path: string): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
    fs.lstat(path, (err: NodeJS.ErrnoException, stats: fs.Stats) => {
      if (err) {
        if(err.code === 'ENOENT'){
          return resolve(false);
        }
        return reject(err);
      }
      return resolve(stats.isDirectory());
    });
  });
};

export const createDirectory = async (path: string): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    fs.mkdir(path, {recursive: true, mode: 0o755},(err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
