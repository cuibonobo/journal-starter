import App from "./App";
import { Cli } from "./lib/cli";
import { generateId } from "./lib/id";
import { ICommandArgs } from "./lib/interfaces";
import subscriptions from "./subscriptions";

const main = async () => {
  const cli = new Cli();
  let opts: ICommandArgs;
  try {
    opts = Cli.parseArguments();
  } catch(err) {
    console.debug("You must provide a command!");
    return;
  }
  
  switch(opts.command) {
    case "generate-id":
      cli.write(generateId());
      break;
    case "init":
      const repositoryDir: string = await cli.readLine("Where should the data live?");
      await App.generateApp(cli, repositoryDir);
      break;
    case undefined:
      cli.close();
      return;
    default:
      const app: App = await App.generateApp(cli);
      subscriptions(app);
      app.events.dispatchEvent(opts.command, {args: opts.args, kwargs: opts.kwargs});
      await app.processInteraction(Cli.parseArguments({args: opts.args, kwargs: opts.kwargs}));
  }
  cli.close();
};

export default main;
