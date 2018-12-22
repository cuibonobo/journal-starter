import App from "./App";
import { Cli } from "./lib/cli";
import { generateId } from "./lib/id";
import { ICommandArgs } from "./lib/interfaces";
import subscriptions from "./subscriptions";

const main = async () => {
  let cli: Cli;
  let opts: ICommandArgs;
  try {
    opts = Cli.parseArguments();
  } catch(err) {
    console.debug("You must provide a command!");
    return;
  }
  
  switch(opts.command) {
    case "generate-id":
      cli = new Cli();
      cli.write(generateId());
      cli.close();
      break;
    case "init":
      cli = new Cli();
      const repositoryDir: string = await cli.readLine("Where should the data live?");
      cli.close();
      await App.generateApp(repositoryDir);
      break;
    case undefined:
      break;
    default:
      const app: App = await App.generateApp();
      subscriptions(app);
      app.events.dispatchEvent(opts.command, {args: opts.args, kwargs: opts.kwargs});
      await app.processInteraction(Cli.parseArguments({args: opts.args, kwargs: opts.kwargs}));
  }
};

export default main;
