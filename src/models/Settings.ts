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
  private settings?:ISettingsJSON;

  public async readFromFile() {
    return new Promise((resolve, reject) => {
      fs.exists(Settings.filePath, (exists:boolean) => {
        if (!exists) {
          return reject();
        }
        fs.readFile(Settings.filePath, (err, data:Buffer) => {
          if (err) {
            return reject(err);
          }
          this.settings = JSON.parse(data.toString());
          resolve();
        });
      });
    });
  }
}
