import { Cli } from "../cli";

export interface ICommands {
  [key: string]: (cli: Cli, args: string[], kwargs: {[key: string]: string | boolean}) => Promise<void>;
}
