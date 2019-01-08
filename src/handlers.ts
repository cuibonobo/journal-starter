import App from "./App";
import BaseApp from "./app";
import { CreatePost, CreateType } from "./app";
import { ValidationError } from "./errors";
import { isFile, readFile } from "./lib/platform";
import { Post, Type } from "./models";

export const createPost: CreatePost = async (app: BaseApp, type: string) => {
  if (type === undefined) {
    throw new ValidationError("You must specify a post type!");
  }
  const body = await App.readLine("What would you like to say?");
  const post = Post.generatePost(type, {"body": body});
  await app.Repository.save(post);
  return post;
};

export const createType: CreateType = async (app: BaseApp, name: string) => {
  if (name === undefined) {
    throw new ValidationError("You must specify a type name!");
  }
  const type: Type = new Type({name, definition: {}});
  const typeFilePath = app.Repository.getPath(type);
  let oldText: string = "";
  if (await isFile(typeFilePath)) {
    oldText = await readFile(typeFilePath);
  }
  let existingType = false;
  if (oldText.length !== 0) {
    existingType = true;
    const answer = await App.readAnswer(`Type ${name} already exists! Edit?`, ['Y', 'N']);
    if (answer === 'N'){
      throw new ValidationError();
    }
  }
  const newText = App.readBody(oldText, "Define your type above in JSON format.");
  // TODO: Define an interface for type data
  try {
    type.definition = JSON.parse(newText);
  } catch(err) {
    // TODO: Allow fixing JSON errors
    throw new ValidationError("Can't parse input as JSON!");
  }
  app.Repository.save(type);
  if (existingType) {
    App.write(`Existing type edited: ${type.name}`);
  } else {
    App.write(`New type created: ${type.name}`);
  }
  return type;
};
