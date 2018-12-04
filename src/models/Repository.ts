import * as path from "path";
import { createDirectory, writeFile } from "../lib/platform";
import Post from "./Post";

export default class Repository {
;
  public readonly postsDir: string;
  public readonly typesDir: string;
  private repositorydir: string;

  constructor(repositoryDir: string) {
    this.repositorydir = repositoryDir;
    this.postsDir = path.join(this.repositorydir, "posts");
    this.typesDir = path.join(this.repositorydir, "types");
  }

  public async initializeRepository() {
    await createDirectory(this.postsDir);
    await createDirectory(this.typesDir);
  }
  public async savePost(post: Post) {
    const postId = post.id;
    const dir1 = postId.substr(0, 3);
    const dir2 = postId.substr(3, 3);
    const postDir = path.join(this.repositorydir, "posts", dir1, dir2);
    await createDirectory(postDir);
    await writeFile(path.join(postDir, `${postId}.json`), JSON.stringify(post));
  }
}
