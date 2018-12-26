import App from "./App";
import { ICommandArgs } from "./lib/interfaces";

const main = async () => {
  let opts: ICommandArgs;
  try {
    opts = App.parseArguments();
  } catch(err) {
    console.debug("You must provide a command!");
    return;
  }
  
  const app = new App();
  switch(opts.command) {
    case "init":
      const repositoryDir: string = await app.readLine("Where should the data live?");
      await App.createApp(repositoryDir);
      break;
    case undefined:
      break;
    default:
      const repo = await App.getRepository();
      app.Repository = repo;
      await app.processInteraction(opts.command, {args: opts.args, kwargs: opts.kwargs});
  }
};

export default main;
