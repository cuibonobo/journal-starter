import BaseApp from "./app/BaseApp";
import { createPost, createType } from "./handlers";
import { Cli } from "./lib/cli";
import { IArgs } from "./lib/interfaces";
import { Repository, Settings } from "./models";

export default class App extends BaseApp {
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

  constructor(settings: Settings, repository: Repository) {
    super(settings, repository);
    this.cli = new Cli();
  }

  public processInteraction = async (command: string, args: IArgs): Promise<void> => {
    switch(command) {
      case "create":
        const opts = Cli.parseArguments(args);
        try {
          switch(opts.command) {
            case "post":
              await createPost(this, opts.args[0]);
              break;
            case "type":
              await createType(this, opts.args[0]);
              break;
            default:
              console.debug(opts);
          }
        } catch(err) {
          this.cli.write(err.message);
        }
        break;
      default:
        console.debug(command, args);
    }
  };
}
