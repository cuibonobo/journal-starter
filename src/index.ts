import { Cli } from "./lib/cli";
import { generateId } from "./lib/id";
import { ICommands } from "./lib/interfaces";
import { createPost, createRepository, getRepository } from "./procedures";

const cli = new Cli();

const CREATE_COMMANDS: ICommands = {
  "post": async (args, kwargs) => {
    const repo = await getRepository();
    const note: string = await cli.readLine("What do you want to say?");
    await createPost(repo, "note", {"body": note});
  },
  "type": async (args, kwargs) => {
    if (args.length === 0) {
      console.debug(args);
      return;
    }
    const data = cli.readBody("Define your type above.");
    console.debug(`New type: ${args[0]}`);
    console.debug(JSON.parse(data));
  }
};

const BASE_COMMANDS: ICommands = {
  "create": async (args, kwargs) => {
    await Cli.processCommand(CREATE_COMMANDS, args, kwargs);
  },
  "generate-id": async () => {
    cli.write(generateId());
  },
  "init": async () => {
    const repositoryDir: string = await cli.readLine("Where should the data live?");
    await createRepository(repositoryDir);
  }
};

const main = async () => {
  const {args, kwargs} = Cli.parseArguments();
  await Cli.processCommand(BASE_COMMANDS, args, kwargs);
  cli.close();
};

export default main;
