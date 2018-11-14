import minimist = require("minimist");
import * as readline from "readline";
import { edit } from "external-editor";
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

const CREATE_COMMANDS: ICommands = {
  "post": async (args, kwargs) => {
    const settings = new Settings();
    await settings.readFromFile();
    const repo = new Repository(settings.getRepositoryDir());
    const note: string = await ask("What do you want to say?\n");
    const post = Post.generatePost("note", {"body": note});
    repo.savePost(post);
  },
  "type": async (args, kwargs) => {
    if (args.length === 0) {
      console.debug(args);
      return;
    }
    const data = edit("\n\n# Define your type above.");
    console.debug(`New type: ${args[0]}`);
    console.debug(data);
  }
};

const BASE_COMMANDS: ICommands = {
  "create": async (args, kwargs) => {
    if (args.length > 0 && Object.keys(CREATE_COMMANDS).indexOf(args[0]) > -1) {
      await CREATE_COMMANDS[args[0]](args.slice(1), kwargs);
    } else {
      console.debug(args);
    }
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
  if (args._.length > 0 && Object.keys(BASE_COMMANDS).indexOf(args._[0]) > -1) {
    const command = args._[0];
    const seq_args = args._.slice(1);
    const kwargs = {...args};
    delete kwargs._;
    await BASE_COMMANDS[command](seq_args, kwargs);
  } else {
    console.debug(args);
  }
  rl.close();
};

export default main;
