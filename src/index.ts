import { Cli } from "./lib/cli";
import { generateId } from "./lib/id";
import { ICommands } from "./lib/interfaces";
import { createPost, createRepository, getRepository } from "./procedures";

const CREATE_COMMANDS: ICommands = {
  "post": async (cli, args, kwargs) => {
    const repo = await getRepository();
    const note: string = await cli.readLine("What do you want to say?");
    await createPost(repo, "note", {"body": note});
  },
  "type": async (cli, args, kwargs) => {
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
  "create": async (cli, args, kwargs) => {
    await Cli.processCommand(CREATE_COMMANDS, cli, args, kwargs);
  },
  "generate-id": async (cli) => {
    cli.write(generateId());
  },
  "init": async (cli) => {
    const repositoryDir: string = await cli.readLine("Where should the data live?");
    await createRepository(repositoryDir);
  }
};

const main = async () => {
  const {args, kwargs} = Cli.parseArguments();
  await Cli.processCommand(BASE_COMMANDS, null, args, kwargs);
};

export default main;
