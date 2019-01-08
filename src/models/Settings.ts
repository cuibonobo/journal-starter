import * as path from "path";
import { ISettingsJson } from "../lib/interfaces";
import { getUserDataDir, isFile, readFile, writeFile } from "../lib/platform";

export default class Settings {
  public static createSettings = async (name: string, repositoryDir: string): Promise<Settings> => {
    const settings = new Settings(name, {repositoryDir});
    settings.save();
    return settings;
  };

  public static getSettings = async(name: string): Promise<Settings> => {
    const settings = new Settings(name);
    await settings.initialize();
    return settings;
  };
  
  public readonly filePath: string;
  private name: string;
  private filename: string;

  private settings?:ISettingsJson;

  constructor(name: string, settings?: ISettingsJson) {
    this.name = name;
    this.filename = name + ".json";
    this.filePath = path.join(getUserDataDir(), this.filename);
    this.settings = settings;
  }

  get repositoryDir(): string {
    if (this.settings === undefined) {
      throw new Error("No repository defined!");
    }
    return this.settings.repositoryDir;
  }

  private async save(): Promise<void> {
    await writeFile(this.filePath, JSON.stringify(this.settings));
  }

  private async initialize() {
    if (await isFile(this.filePath)) {
      this.settings = JSON.parse(await readFile(this.filePath));
    }
  }
}
