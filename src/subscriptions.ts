import App from "./App";
import { createPost, createType } from "./handlers";
import { Cli } from "./lib/cli";

const subscriptions = (app: App) => {
  app.events.subscribe("createPost", createPost);
  app.events.subscribe("createType", createType);

  app.events.subscribe("create", (a, k) => {
    const {command, args, kwargs} = Cli.parseArguments(k);
    switch(command) {
      case "post":
        a.events.dispatchEvent("createPost", {args, kwargs});
        break;
      case "type":
        a.events.dispatchEvent("createType", {args, kwargs});
        break;
      default:
        console.debug(k);
        a.close();
    }
  });
};

export default subscriptions;
