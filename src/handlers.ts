import App from "./App";
import BaseApp from "./app";
import { CreatePost, CreateType } from "./app";
import { ValidationError } from "./lib/errors";
import { isFile, readFile } from "./lib/platform";
import { Post, Type } from "./models";

export const createPost: CreatePost = async (app: BaseApp, type: string) => {
  const body = await (app as App).cli.readLine("What would you like to say?");
  const post = Post.generatePost(type, {"body": body});
  await app.repository.save(post);
  return post;
};

export const createType: CreateType = async (app: BaseApp, name: string) => {
  const cliApp = app as App;
  if (name === undefined) {
    throw new ValidationError("You must specify a type name!");
  }
  const type: Type = new Type({name, definition: {}});
  const typeFilePath = cliApp.repository.getPath(type);
  let oldText: string = "";
  if (await isFile(typeFilePath)) {
    oldText = await readFile(typeFilePath);
  }
  let existingType = false;
  if (oldText.length !== 0) {
    existingType = true;
    const answer = await cliApp.cli.readAnswer(`Type ${name} already exists! Edit?`, ['Y', 'N']);
    if (answer === 'N'){
      throw new ValidationError();
    }
  }
  const newText = cliApp.cli.readBody(oldText, "Define your type above in JSON format.");
  // TODO: Define an interface for type data
  try {
    type.definition = JSON.parse(newText);
  } catch(err) {
    // TODO: Allow fixing JSON errors
    throw new ValidationError("Can't parse input as JSON!");
  }
  cliApp.repository.save(type);
  if (existingType) {
    cliApp.cli.write(`Existing type edited: ${type.name}`);
  } else {
    cliApp.cli.write(`New type created: ${type.name}`);
  }
  return type;
};
