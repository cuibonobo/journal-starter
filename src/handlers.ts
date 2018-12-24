import App from "./App";
import { IArgs } from "./lib/interfaces";
import { isFile, readFile, writeFile } from "./lib/platform";
import { Post, Type } from "./models";

export const createPost = async (app: App, args: IArgs) => {
  const body = await app.cli.readLine("What would you like to say?");
  const post = Post.generatePost(args.args[0], {"body": body});
  await app.repository.savePost(post);
  app.close();
};

export const createType = async (app: App, args: IArgs) => {
  let name = args.args[0];
  if (name === undefined) {
    app.close("You must specify a type name!");
    return;
  }
  try {
    name = Type.validateName(name);
  } catch (err) {
    app.cli.write(err);
    app.close();
    return;
  }
  const typeFilePath = app.repository.getTypePath(name);
  const comment: string = "Define your type above in JSON format.";
  let oldText: string = "";
  if (await isFile(typeFilePath)) {
    oldText = await readFile(typeFilePath);
  }
  if (oldText.length === 0) {
    const newText = app.cli.readBody("", comment);
    app.events.dispatchEvent("saveType", {args: [name, typeFilePath, newText], kwargs: {}});
    return;
  }
  const existsOpts: {[key: string]: () => void} = {
    "Edit": () => {
      const newText = app.cli.readBody(oldText, comment);
      app.events.dispatchEvent("saveType", {args: [name, typeFilePath, newText], kwargs: {}});
    },
    "Overwrite": () => {
      const newText = app.cli.readBody("", comment);
      app.events.dispatchEvent("saveType", {args: [name, typeFilePath, newText], kwargs: {}});
    },
    "Quit": () => {
      app.close();
    }
  };
  const answer = await app.cli.readAnswer(`Type ${name} already exists! What would you like to do?`, Object.keys(existsOpts));
  existsOpts[answer]();  
};

export const saveType = async (app: App, args: IArgs) => {
  const typeName = args.args[0];
  const typeFilePath = args.args[1];
  const text = args.args[2];
  // TODO: Define an interface for type data
  let data = {};
  try {
    data = JSON.parse(text);
  } catch(err) {
    // TODO: Allow fixing JSON errors
    app.close("Can't parse input as JSON!");
    return;
  }
  await writeFile(typeFilePath, JSON.stringify(data, null, 4));
  app.close(`New type created: ${typeName}`);
};
