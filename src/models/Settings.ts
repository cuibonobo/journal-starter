import * as path from "path";
import { ISettingsJson } from "../lib/interfaces";
import { getUserDataDir, isFile, readFile, writeFile } from "../lib/platform";

export default class Settings {
  public static readonly filename: string = "journal.json";
  public static readonly filePath = path.join(getUserDataDir(), Settings.filename);

  public static async generateSettings(repositoryDir: string): Promise<ISettingsJson> {
    const obj:ISettingsJson = {repositoryDir};
    await writeFile(Settings.filePath, JSON.stringify(obj));
    return obj;
  }

  private settings?:ISettingsJson;

  constructor(settings?: ISettingsJson) {
    this.settings = settings;
  }

  public async readFromFile() {
    if (await isFile(Settings.filePath)) {
      this.settings = JSON.parse(await readFile(Settings.filePath));
    }
  }

  public getRepositoryDir(): string {
    if (this.settings === undefined) {
      throw new Error("No repository defined!");
    }
    return this.settings.repositoryDir;
  }
}
