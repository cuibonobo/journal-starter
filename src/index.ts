import minimist = require("minimist");
import * as readline from "readline";
import { generateId } from "./lib/id";
import { ICommands } from "./lib/interfaces";
import { Repository, Settings } from "./models";
import Post from "./models/Post";

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
  "create": async () => {
    const settings = new Settings();
    await settings.readFromFile();
    const repo = new Repository(settings.getRepositoryDir());
    const note: string = await ask("What do you want to say?\n");
    const post = Post.generatePost("note", {"body": note});
    repo.savePost(post);
  },
  "generate-id": async () => {
    rl.write(generateId() + "\n");
  },
  "init": async () => {
    const repositoryDir: string = await ask("Where should the data live?\n");
    await Settings.generateSettings(repositoryDir);
    const repo = new Repository(repositoryDir);
    repo.initializeRepository();
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
