import * as fs from "graceful-fs";
import * as p from "path";
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

export const readDir = async (path: string): Promise<string[]> => {
  return new Promise<string[]>((resolve, reject) => {
    fs.readdir(path, {encoding: "utf8"}, (err, files) => {
      if (err) {
        return reject(err);
      }
      return resolve(files)
    });
  });
};

export const walk = async (path: string, fileCb?: (filename: string) => Promise<void>, dirCb?: (dirName: string) => Promise<void>): Promise<void> => {
  path = p.resolve(path);
  const items: string[] = await readDir(path);
  for (const item of items) {
    const itemPath = p.join(path, item);
    if (await isFile(itemPath)) {
      if (fileCb !== undefined) {
        await fileCb(itemPath);
      }
    }
    if (await isDirectory(itemPath)) {
      if (dirCb !== undefined) {
        await dirCb(itemPath);
      }
      await walk(itemPath, fileCb, dirCb);
    }
  }
};

export const writeFile = async (path: string, data: string): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    writeFileAtomic(path, data, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
};

export const readFile = async (path: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    fs.readFile(path, (err, data:Buffer) => {
      if (err) {
        return reject(err);
      }
      return resolve(data.toString());
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
        return reject(err);
      }
      return resolve();
    });
  });
};
