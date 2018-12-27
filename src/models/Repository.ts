import * as path from "path";
import * as punycode from "punycode";
import { RepositoryError } from "../lib/errors";
import { IBaseJson, ITypeJson } from "../lib/interfaces";
import { createDirectory, readFile, walk, writeFile } from "../lib/platform";
import { Post, Type} from "../models";

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

  public async getOne<TModel>(classParam: Constructor<TModel>, arg: string): Promise<Post | Type> {
    switch(classParam.name) {
      case "Post":
        return await this.getPostById(arg);
      case "Type":
        return await this.getTypeByName(arg);
    }
    throw new RepositoryError(`No models of type ${classParam.name} in the repository!`);
  }

  public async get<TModel>(classParam: Constructor<TModel>, query?: IBaseJson): Promise<Post[] | Type[]> {
    if (query === undefined) {
      query = {};
    }
    switch(classParam.name) {
      case "Post":
        return await this.queryPost(query);
      case "Type":
        return await this.queryType(query);
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

  private getPostById = async (postId: string): Promise<Post> => {
    const postPath = this.getPostPath(postId);
    return this.getPostByPath(postPath);
  };

  private getPostByPath = async (filePath: string): Promise<Post> => {
    const postText = await readFile(filePath);
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

  private getTypeByName = async (name: string): Promise<Type> => {
    const typeName = Type.validateName(name);
    const typeFilePath = this.getTypeFilePath(typeName);
    return await this.getTypeByPath(typeFilePath);
  };

  private getTypeByPath = async (filePath: string): Promise<Type> => {
    const typeText = await readFile(filePath);
    const typeData: ITypeJson = JSON.parse(typeText);
    return new Type(typeData);
  };

  private getTypeFilePath = (typeName: string): string => {
    // Convert any Unicode characters to ASCII for the filename
    const typeFileName = punycode.toASCII(typeName) + ".json";
    const typeFilePath = path.join(this.typesDir, typeFileName);
    return typeFilePath;
  };

  private queryPost = async (query: IBaseJson): Promise<Post[]> => {
    const posts: Post[] = [];
    await walk(this.postsDir, async (filename: string) => {
      // TODO: Actually filter stuff based on the query!
      const post = await this.getPostByPath(filename);
      posts.push(post);
    });
    return posts;
  };

  private queryType = async (query: IBaseJson): Promise<Type[]> => {
    const types: Type[] = [];
    await walk(this.typesDir, async (filename: string) => {
      // TODO: Actually filter stuff based on the query!
      const type = await this.getTypeByPath(filename);
      types.push(type);
    });
    return types;
  };

  private savePost = async (post: Post): Promise<void> => {
    const postId = post.id;
    const postPath = this.getPostPath(postId);
    await createDirectory(this.getPostDirectory(postId));
    await writeFile(postPath, JSON.stringify(post));
  };

  private saveType = async (type: Type) => {
    const typeFilePath = this.getTypeFilePath(type.name);
    await writeFile(typeFilePath, JSON.stringify(type, null, 4));
  };
}
