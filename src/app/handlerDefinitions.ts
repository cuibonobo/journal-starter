import { Post, Type } from "../models";
import BaseApp from "./BaseApp";

export type CreatePost = (app: BaseApp, type: string, ...args: any[]) => Promise<Post>;
export type CreateType = (app: BaseApp, name: string, ...args: any[]) => Promise<Type>;
