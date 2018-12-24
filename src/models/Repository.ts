import * as path from "path";
import * as punycode from "punycode";
import { createDirectory, writeFile } from "../lib/platform";
import Post from "./Post";
import Type from "./Type";

export default class Repository {
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

  public getPostDirectory = (postId: string): string => {
    const dir1 = postId.substr(0, 3);
    const dir2 = postId.substr(3, 3);
    return path.join(this.postsDir, dir1, dir2);
  };

  public getPostPath = (postId: string): string => {
    const postDir = this.getPostDirectory(postId);
    return path.join(postDir, `${postId}.json`);
  };

  public savePost = async (post: Post): Promise<void> => {
    const postId = post.id;
    const postFilename = this.getPostPath(postId);
    await createDirectory(this.getPostDirectory(postId));
    await writeFile(postFilename, JSON.stringify(post));
  };

  public getTypePath = (name: string): string => {
    const typeName = Type.validateName(name);
    // Convert any Unicode characters to ASCII for the filename
    const typeFileName = punycode.toASCII(typeName) + ".json";
    const typeFilePath = path.join(this.typesDir, typeFileName);
    return typeFilePath;
  };

  public saveType = async (type: Type) => {
    const typeFilePath = this.getTypePath(type.name);
    await writeFile(typeFilePath, JSON.stringify(type.definition, null, 4));
  };
}
