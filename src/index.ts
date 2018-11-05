import minimist = require("minimist");
import * as readline from "readline";
import { generateId } from "./lib/id";
import { ICommands } from "./lib/interfaces";
import { Settings } from "./models";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = async (questionText: string): Promise<string> => {
  return new Promise((resolve: (input: string) => void, reject) => {
    rl.question(questionText, (input) => resolve(input));
  });
};

const COMMANDS: ICommands = {
  "generate-id": async () => {
    rl.write(generateId() + "\n");
  },
  "init": async () => {
    const repositoryDir: string = await ask("Where should the data live?\n");
    await Settings.generateSettings(repositoryDir);
  }
};

const main = async () => {
  const args = minimist(process.argv.slice(2));
  if (args._.length > 0 && Object.keys(COMMANDS).indexOf(args._[0]) > -1) {
    await COMMANDS[args._[0]]();
  } else {
    console.debug(args);
  }
  rl.close();
};

export default main;
