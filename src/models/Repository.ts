import * as path from "path";
import * as punycode from "punycode";
import { createDirectory, readFile, writeFile } from "../lib/platform";
import { Post, Type} from "../models";
import { RepositoryError } from "../lib/errors";

type Constructor<T = {}> = new (...args: any[]) => T;

export default class Repository {
  public static createRepository = async (repositoryDir: string): Promise<Repository> => {
    const repo = new Repository(repositoryDir);
    await repo.initializeRepository();
    return repo;
  };

  public readonly postsDir: string;
  public readonly typesDir: string;
  private repositorydir: string;

  constructor(repositoryDir: string) {
    this.repositorydir = repositoryDir;
    this.postsDir = path.join(this.repositorydir, "posts");
    this.typesDir = path.join(this.repositorydir, "types");
  }

  public initializeRepository = async () => {
    await createDirectory(this.postsDir);
    await createDirectory(this.typesDir);
  };

  public async get<TModel>(classParam: Constructor<TModel>, arg: string): Promise<Post | Type> {
    switch(classParam.name) {
      case "Post":
        return await this.getPost(arg);
      case "Type":
        return await this.getType(arg);
    }
    throw new RepositoryError(`No models of type ${classParam.name} in the repository!`);
  }

  public async save<TModel>(model: TModel): Promise<void> {
    if (model instanceof Post) {
      await this.savePost(model);
      return;
    }
    if (model instanceof Type) {
      await this.saveType(model);
      return;
    }
    throw new RepositoryError(`No models of type ${model.constructor.name} in the repository!`);
  }

  public getPath<TModel>(model: TModel): string {
    if (model instanceof Post) {
      return this.getPostPath(model.id);
    } else if (model instanceof Type) {
      return this.getTypeFilePath(model.name);
    }
    return "";
  }

  private getPost = async (postId: string): Promise<Post> => {
    const postPath = this.getPostPath(postId);
    const postText = await readFile(postPath);
    return new Post(JSON.parse(postText));
  };

  private getPostDirectory = (postId: string): string => {
    const dir1 = postId.substr(0, 3);
    const dir2 = postId.substr(3, 3);
    return path.join(this.postsDir, dir1, dir2);
  };

  private getPostPath = (postId: string): string => {
    const postDir = this.getPostDirectory(postId);
    return path.join(postDir, `${postId}.json`);
  };

  private getType = async (name: string): Promise<Type> => {
    const typeName = Type.validateName(name);
    const typeFilePath = this.getTypeFilePath(typeName);
    const typeText = await readFile(typeFilePath);
    const definition = JSON.parse(typeText);
    return new Type({name: typeName, definition});
  };

  private getTypeFilePath = (typeName: string): string => {
    // Convert any Unicode characters to ASCII for the filename
    const typeFileName = punycode.toASCII(typeName) + ".json";
    const typeFilePath = path.join(this.typesDir, typeFileName);
    return typeFilePath;
  };

  private savePost = async (post: Post): Promise<void> => {
    const postId = post.id;
    const postPath = this.getPostPath(postId);
    await createDirectory(this.getPostDirectory(postId));
    await writeFile(postPath, JSON.stringify(post));
  };

  private saveType = async (type: Type) => {
    const typeFilePath = this.getTypeFilePath(type.name);
    await writeFile(typeFilePath, JSON.stringify(type.definition, null, 4));
  };
}
