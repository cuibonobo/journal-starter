import * as fs from "fs";
import * as path from "path";
import { ISettingsJSON } from "../lib/interfaces";
import { userDataDir } from "../lib/platform";

export default class Settings {
  public static readonly filename: string = "journal.json";
  public static readonly filePath = path.join(userDataDir, Settings.filename);

  public static async generateSettings(repositoryDir: string) {
    const obj:ISettingsJSON = {repositoryDir};
    return new Promise((resolve, reject) => {
      fs.writeFile(Settings.filePath, JSON.stringify(obj), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
  public repositoryDir: string;

  constructor() {
    if (fs.existsSync(Settings.filePath)) {
      const obj: ISettingsJSON = JSON.parse(fs.readFileSync('file', 'utf8'));
      this.repositoryDir = obj.repositoryDir;
    } else {
      throw Error("No settings file!");
    }
  }
}
