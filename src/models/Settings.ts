import * as path from "path";
import { ISettingsJson } from "../lib/interfaces";
import { getUserDataDir, isFile, readFile, writeFile } from "../lib/platform";

export default class Settings {
  public static readonly filename: string = "journal.json";
  public static readonly filePath = path.join(getUserDataDir(), Settings.filename);

  public static createSettings = async (repositoryDir: string): Promise<Settings> => {
    const settings = new Settings({repositoryDir});
    settings.save();
    return settings;
  };

  public static getSettings = async(): Promise<Settings> => {
    const settings = new Settings();
    await settings.initialize();
    return settings;
  };

  private settings?:ISettingsJson;

  constructor(settings?: ISettingsJson) {
    this.settings = settings;
  }

  public getRepositoryDir(): string {
    if (this.settings === undefined) {
      throw new Error("No repository defined!");
    }
    return this.settings.repositoryDir;
  }

  private async save(): Promise<void> {
    await writeFile(Settings.filePath, JSON.stringify(this.settings));
  }

  private async initialize() {
    if (await isFile(Settings.filePath)) {
      this.settings = JSON.parse(await readFile(Settings.filePath));
    }
  }
}
