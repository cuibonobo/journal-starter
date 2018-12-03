import * as minimist from "minimist";
import * as readline from "readline";
import { ICommands } from "../lib/interfaces";

export class Cli {
  public static parseArguments = (): {args: string[], kwargs:{[key:string]: string | boolean}} => {
    const baseArgs = minimist(process.argv.slice(2));
    const args = [...baseArgs._];
    const kwargs = {...baseArgs};
    delete kwargs._;
    return {args, kwargs};
  };

  public static processCommand = async (commands:ICommands, args:string[], kwargs:{[key:string]: string | boolean}) => {
    if (args.length > 0 && Object.keys(commands).indexOf(args[0]) > -1) {
      const command = args[0];
      await commands[command](args.slice(1), kwargs);
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

  public read = async (questionText?: string): Promise<string> => {
    let text = "";
    if (questionText !== undefined) {
      text = questionText;
    }
    return new Promise((resolve: (input: string) => void, reject) => {
      this.rl.question(text, (input) => resolve(input));
    });
  };

  public write = (message: string): void => {
    this.rl.write(message + "\n");
  };

  public close = (): void => {
    this.rl.close();
  };
}
