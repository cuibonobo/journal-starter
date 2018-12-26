import * as path from "path";
import * as punycode from "punycode";
import { createDirectory, writeFile } from "../lib/platform";
import { Post, Type} from "../models";

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

  public async save<TModel>(model: TModel) {
    if (model instanceof Post) {
      await this.savePost(model);
    } else if (model instanceof Type) {
      await this.saveType(model);
    }
  }

  public getPath<TModel>(model: TModel): string {
    if (model instanceof Post) {
      return this.getPostPath(model.id);
    } else if (model instanceof Type) {
      return this.getTypePath(model.name);
    }
    return "";
  }

  private getPostDirectory = (postId: string): string => {
    const dir1 = postId.substr(0, 3);
    const dir2 = postId.substr(3, 3);
    return path.join(this.postsDir, dir1, dir2);
  };

  private getPostPath = (postId: string): string => {
    const postDir = this.getPostDirectory(postId);
    return path.join(postDir, `${postId}.json`);
  };

  private getTypePath = (name: string): string => {
    const typeName = Type.validateName(name);
    // Convert any Unicode characters to ASCII for the filename
    const typeFileName = punycode.toASCII(typeName) + ".json";
    const typeFilePath = path.join(this.typesDir, typeFileName);
    return typeFilePath;
  };

  private savePost = async (post: Post): Promise<void> => {
    const postId = post.id;
    const postFilename = this.getPostPath(postId);
    await createDirectory(this.getPostDirectory(postId));
    await writeFile(postFilename, JSON.stringify(post));
  };

  private saveType = async (type: Type) => {
    const typeFilePath = this.getTypePath(type.name);
    await writeFile(typeFilePath, JSON.stringify(type.definition, null, 4));
  };
}
