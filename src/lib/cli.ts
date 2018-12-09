import { edit } from "external-editor";
import * as minimist from "minimist";
import * as readline from "readline";
import { ICommands } from "./interfaces/functions";

export class Cli {
  public static parseArguments = (): {args: string[], kwargs:{[key:string]: string | boolean}} => {
    const baseArgs = minimist(process.argv.slice(2));
    const args = [...baseArgs._];
    const kwargs = {...baseArgs};
    delete kwargs._;
    return {args, kwargs};
  };

  public static processCommand = async (commands:ICommands, cli: Cli | null, args:string[], kwargs:{[key:string]: string | boolean}) => {
    if (args.length > 0 && Object.keys(commands).indexOf(args[0]) > -1) {
      // Keep track of whether the CLI was created here or passed in
      let isBase = false;
      if (cli === null) {
        cli = new Cli();
        isBase = true;
      }
      const command = args[0];
      await commands[command](cli, args.slice(1), kwargs);
      // If this was the level where the CLI was created, close the CLI
      if (isBase) {
        cli.close();
      }
    } else {
      console.debug(args, kwargs);
    }
  };

  private rl:readline.ReadLine;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

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
      this.rl.question(text, (input) => resolve(input));
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
    this.rl.write(message + "\n");
  };

  public close = (): void => {
    this.rl.close();
  };
}
