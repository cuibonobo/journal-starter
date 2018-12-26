import App from "./App";
import { IArgs } from "./lib/interfaces";
import { isFile, readFile, writeFile } from "./lib/platform";
import { Post, Type } from "./models";

export const createPost = async (app: App, args: IArgs) => {
  const body = await app.cli.readLine("What would you like to say?");
  const post = Post.generatePost(args.args[0], {"body": body});
  await app.repository.save(post);
};

export const createType = async (app: App, args: IArgs) => {
  const name = args.args[0];
  if (name === undefined) {
    app.cli.write("You must specify a type name!");
    return;
  }
  let type: Type;
  try {
    type = new Type({name, definition: {}});
  } catch (err) {
    app.cli.write(err);
    return;
  }
  const typeFilePath = app.repository.getPath(type);
  let oldText: string = "";
  if (await isFile(typeFilePath)) {
    oldText = await readFile(typeFilePath);
  }
  let existingType = false;
  if (oldText.length !== 0) {
    existingType = true;
    const answer = await app.cli.readAnswer(`Type ${name} already exists! Edit?`, ['Y', 'N']);
    if (answer === 'N'){
      return;
    }
  }
  const newText = app.cli.readBody(oldText, "Define your type above in JSON format.");
  // TODO: Define an interface for type data
  try {
    type.definition = JSON.parse(newText);
  } catch(err) {
    // TODO: Allow fixing JSON errors
    app.cli.write("Can't parse input as JSON!");
    return;
  }
  app.repository.save(type);
  if (existingType) {
    app.cli.write(`Existing type edited: ${type.name}`);
  } else {
    app.cli.write(`New type created: ${type.name}`);
  }
};
