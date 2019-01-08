import BaseApp from "./app/BaseApp";
import { createPost, createType } from "./handlers";
import { ICommandArgs } from "./interfaces";
import { Post, Type } from "./models";

export const create = async (app: BaseApp, opts: ICommandArgs) => {
  switch(opts.command) {
    case "post":
      await createPost(app, opts.args[0]);
      break;
    case "type":
      await createType(app, opts.args[0]);
      break;
    default:
      console.debug(opts);
  }
};
export const list = async (app: BaseApp, opts: ICommandArgs) => {
  switch(opts.command) {
    case "posts":
      const posts = await app.Repository.get(Post);
      console.debug(posts);
      break;
    case "types":
      const types = await app.Repository.get(Type);
      console.debug(types);
      break;
    default:
      console.debug(opts);
  }
};
