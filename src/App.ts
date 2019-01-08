import { edit } from "external-editor";
import * as minimist from "minimist";
import * as readline from "readline";
import BaseApp from "./app/BaseApp";
import { createPost, createType } from "./handlers";
import { IArgs, ICommandArgs } from "./interfaces";

export default class App extends BaseApp {
  public static readonly appName: string = "journal";

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
    await Settings.createSettings(App.appName, repositoryDir)
    const repo: Repository = await Repository.createRepository(repositoryDir);
    return new App(repo);
  };

  public static getRepository = async () => {
    const settings = await Settings.getSettings(App.appName);
    return new Repository(settings.getRepositoryDir());
  };

  public static readAnswer = async (questionText: string, options: string[]): Promise<string> => {
    const answers = options.map((value: string) => value.toLowerCase());
    const text = `${questionText} (${options.join(", ")})`;
    let answer: string;
    let idx: number = -1;
    while(idx < 0) {
      answer = await App.readLine(text);
      idx = answers.indexOf(answer.toLowerCase());
    }
    return new Promise<string>((resolve) => resolve(options[idx]));
  };

  public static readLine = async (questionText?: string): Promise<string> => {
    let text = "";
    if (questionText !== undefined) {
      text = questionText + "\n";
    }
    return new Promise((resolve: (input: string) => void, reject) => {
      const rl = App.createInterface();
      rl.question(text, (input) => {
        resolve(input);
        rl.close();
      });
    });
  };

  public static readBody = (bodyText?: string, commentText?: string): string => {
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

  public static write = (message: string): void => {
    const rl = App.createInterface();
    rl.write(message + "\n");
    rl.close();
  };

  public static createInterface = (): readline.ReadLine => {
    return readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  };

  public runCommandCallback = async (app: App, opts: ICommandArgs, cb: (a: BaseApp, o: ICommandArgs) => Promise<void>) => {
    try {
      await cb(this, opts);
    } catch(err) {
      App.write(err.message);
    }
  }

  public processInteraction = async (command: string, args: IArgs): Promise<void> => {
    const opts = App.parseArguments(args);
    switch(command) {
      case "create":
        await this.runCommandCallback(this, opts, create);
        break;
      case "list":
        await this.runCommandCallback(this, opts, list);
        break;
      default:
        console.debug(command, args);
    }
  };
}
