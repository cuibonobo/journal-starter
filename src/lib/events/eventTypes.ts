import { Post, Type } from "../../models";
import { IBaseJson, IPostJson } from "../interfaces";

export type PostCreate = (args: {postType: string, content: IPostJson}) => Promise<void>;
export type PostUpdate = (args: {postType: string, oldContent: IPostJson, newContent: IPostJson}) => Promise<void>;
export type TypeCreate = (args: {name: string, content: IBaseJson}) => Promise<void>;
export type TypeUpdate = (args: {name: string, oldContent: IBaseJson, newContent: IBaseJson}) => Promise<void>;

export type PostCreated = (args: {post: Post}) => Promise<void>;
export type PostUpdated = (args: {post: Post}) => Promise<void>;
export type TypeCreated = (args: {type: Type}) => Promise<void>;
export type TypeUpdated = (args: {type: Type}) => Promise<void>;
