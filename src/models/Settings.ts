import * as path from "path";
import { ISettingsJSON } from "../lib/interfaces";
import { readFile, userDataDir, writeFile } from "../lib/platform";

export default class Settings {
  public static readonly filename: string = "journal.json";
  public static readonly filePath = path.join(userDataDir, Settings.filename);

  public static async generateSettings(repositoryDir: string) {
    const obj:ISettingsJSON = {repositoryDir};
    await writeFile(Settings.filePath, JSON.stringify(obj));
  }

  private settings?:ISettingsJSON;

  public async readFromFile() {
    this.settings = JSON.parse(await readFile(Settings.filePath));
  }

  public getRepositoryDir(): string {
    if (this.settings === undefined) {
      throw new Error("No repository defined!");
    }
    return this.settings.repositoryDir;
  }
}
