import { createPost, createType } from "./handlers";
import { Cli } from "./lib/cli";
import { IArgs } from "./lib/interfaces";
import { Repository, Settings } from "./models";

export default class App {
  public static generateApp = async (repositoryDir?: string) => {
    let settings: Settings;
    let repo: Repository;
    if (repositoryDir !== undefined) {
      settings = await Settings.createSettings(repositoryDir);
      repo = await Repository.createRepository(repositoryDir);
    } else {
      settings = await Settings.getSettings();
      repo = await Repository.getRepository(settings);
    }
    return new App(settings, repo);
  };

  public readonly cli: Cli;
  public readonly settings: Settings;
  public readonly repository: Repository;

  constructor(settings: Settings, repository: Repository) {
    this.cli = new Cli();
    this.settings = settings;
    this.repository = repository;
  }

  public processInteraction = async (command: string, args: IArgs): Promise<void> => {
    switch(command) {
      case "create":
        const opts = Cli.parseArguments({args: args.args, kwargs: args.kwargs});
        switch(opts.command) {
          case "post":
            await createPost(this, {args: opts.args, kwargs: opts.kwargs});
            break;
          case "type":
            await createType(this, {args: opts.args, kwargs: opts.kwargs});
            break;
          default:
            console.debug(opts);
        }
        break;
      default:
        console.debug(command, args);
    }
  };
}
