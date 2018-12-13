import { Cli } from "./lib/cli";
import { EventManager } from "./lib/events";
import { IArgs, ICommandArgs } from "./lib/interfaces";
import { Repository, Settings } from "./models";

export default class App {
  public static generateApp = async (cli: Cli, repositoryDir?: string) => {
    let settings: Settings;
    let repo: Repository;
    if (repositoryDir !== undefined) {
      settings = await App.createSettings(repositoryDir);
      repo = await App.createRepository(repositoryDir);
    } else {
      settings = await App.getSettings();
      repo = await App.getRepository(settings);
    }
    return new App(cli, settings, repo);
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

  constructor(cli: Cli, settings: Settings, repository: Repository) {
    this.cli = cli;
    this.settings = settings;
    this.repository = repository;
    this.events = new EventManager<App>(this);
  }

  public close = (message?: string) => {
    let opts: IArgs | undefined;
    if (message !== undefined) {
      opts = {args: [message], kwargs: {}};
    }
    this.events.dispatchEvent("close", opts);
  };

  public processInteraction = async (interaction: ICommandArgs): Promise<void> => {
    const {command, args, kwargs} = interaction;
    await this.events.dispatchEvent(command, {args, kwargs});
    return new Promise<void>((resolve, reject) => {
      this.events.getEvent("close").one((a, k) => {
        if (k.args.length > 0) {
          this.cli.write(k.args[0]);
        }
        resolve();
      })
    });
  }
}
