import * as path from "path";
import { createDirectory, writeFile } from "../lib/platform";
import Post from "./Post";

export default class Repository {
  private repositorydir: string;

  constructor(repositoryDir: string) {
    this.repositorydir = repositoryDir;
  }

  public async initializeRepository() {
    await createDirectory(path.join(this.repositorydir, "posts"));
    await createDirectory(path.join(this.repositorydir, "types"));
  };

  public async savePost(post: Post) {
    const postId = post.id;
    const dir1 = postId.substr(0, 3);
    const dir2 = postId.substr(3, 3);
    const postDir = path.join(this.repositorydir, "posts", dir1, dir2);
    await createDirectory(postDir);
    await writeFile(path.join(postDir, `${postId}.json`), JSON.stringify(post));
  }
}
