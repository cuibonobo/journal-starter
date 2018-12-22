import { Cli } from "./lib/cli";
import EventManager from "./lib/events";
import { ICommandArgs } from "./lib/interfaces";
import { Repository, Settings } from "./models";

export default class App {
  public static generateApp = async (repositoryDir?: string) => {
    let settings: Settings;
    let repo: Repository;
    if (repositoryDir !== undefined) {
      settings = await App.createSettings(repositoryDir);
      repo = await App.createRepository(repositoryDir);
    } else {
      settings = await App.getSettings();
      repo = await App.getRepository(settings);
    }
    return new App(settings, repo);
  };

  private static createRepository = async (repositoryDir: string): Promise<Repository> => {
    const repo = new Repository(repositoryDir);
    await repo.initializeRepository();
    return repo;
  };

  private static createSettings = async (repositoryDir: string): Promise<Settings> => {
    const settings = await Settings.generateSettings(repositoryDir);
    return new Settings(settings);
  };

  private static getRepository = async (settings: Settings): Promise<Repository> => {
    return new Repository(settings.getRepositoryDir());
  };

  private static getSettings = async(): Promise<Settings> => {
    const settings = new Settings();
    await settings.readFromFile();
    return settings;
  };

  public readonly cli: Cli;
  public readonly events: EventManager<App>;
  public readonly settings: Settings;
  public readonly repository: Repository;

  constructor(settings: Settings, repository: Repository) {
    this.cli = new Cli();
    this.settings = settings;
    this.repository = repository;
    this.events = new EventManager<App>(this);
  }

  public close = (message?: string) => {
    if (message !== undefined) {
      this.cli.write(message);
    }
    this.cli.close();
  }; 

  public processInteraction = async (interaction: ICommandArgs): Promise<void> => {
    const {command, args, kwargs} = interaction;
    if (command === undefined) {
      this.close();
      return;
    }
    await this.events.dispatchEvent(command, {args, kwargs});
  }
}
