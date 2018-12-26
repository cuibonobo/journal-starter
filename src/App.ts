import { edit } from "external-editor";
import * as minimist from "minimist";
import * as readline from "readline";
import BaseApp from "./app/BaseApp";
import { createPost, createType } from "./handlers";
import { IArgs, ICommandArgs, ISettingsJson } from "./lib/interfaces";
import { Repository, Settings } from "./models";

export default class App extends BaseApp {
  public static parseArguments = (opts?: IArgs): ICommandArgs => {
    let args;
    let kwargs;
    if (opts === undefined) {
      const baseArgs = minimist(process.argv.slice(2));
      args = [...baseArgs._];
      kwargs = {...baseArgs};
    } else {
      args = opts.args;
      kwargs = opts.kwargs;
    }
    const command = args[0];
    args = args.slice(1);
    delete kwargs._;
    return {command, args, kwargs};
  };

  public static createApp = async (repositoryDir: string) => {
    await Settings.createSettings(repositoryDir)
    const repo: Repository = await Repository.createRepository(repositoryDir);
    return new App(repo);
  };

  public static getRepository = async () => {
    const settings = await Settings.getSettings();
    return new Repository(settings.getRepositoryDir());
  };

  public readAnswer = async (questionText: string, options: string[]): Promise<string> => {
    const answers = options.map((value: string) => value.toLowerCase());
    const text = `${questionText} (${options.join(", ")})`;
    let answer: string;
    let idx: number = -1;
    while(idx < 0) {
      answer = await this.readLine(text);
      idx = answers.indexOf(answer.toLowerCase());
    }
    return new Promise<string>((resolve) => resolve(options[idx]));
  };

  public readLine = async (questionText?: string): Promise<string> => {
    let text = "";
    if (questionText !== undefined) {
      text = questionText + "\n";
    }
    return new Promise((resolve: (input: string) => void, reject) => {
      const rl = this.createInterface();
      rl.question(text, (input) => {
        resolve(input);
        rl.close();
      });
    });
  };

  public readBody = (bodyText?: string, commentText?: string): string => {
    let body = "";
    let comment = "";
    if (bodyText !== undefined) {
      body = bodyText;
    }
    if (commentText !== undefined) {
      comment = "\n\n# " + commentText;
      body += comment;
    }
    try {
      const data = edit(body);
      const idx = data.indexOf(comment);
      if (idx > -1) {
        return data.substr(0, idx);
      }
      return data;
    } catch(err) {
      console.debug(err);
      return "";
    }
  };

  public write = (message: string): void => {
    const rl = this.createInterface();
    rl.write(message + "\n");
    rl.close();
  };

  public processInteraction = async (command: string, args: IArgs): Promise<void> => {
    switch(command) {
      case "create":
        const opts = App.parseArguments(args);
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
          this.write(err.message);
        }
        break;
      default:
        console.debug(command, args);
    }
  };

  private createInterface = (): readline.ReadLine => {
    return readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  };
}
