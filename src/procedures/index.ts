import { IBaseJson } from "../lib/interfaces";
import { Post, Repository, Settings } from "../models";

export const getRepository = async () => {
  const settings = new Settings();
  await settings.readFromFile();
  return new Repository(settings.getRepositoryDir());
};

export const createRepository = async (repositoryDir: string) => {
  await Settings.generateSettings(repositoryDir);
  const repo = new Repository(repositoryDir);
  await repo.initializeRepository();
  return repo;
};

export const createPost = async (repo: Repository, postType:string, content: IBaseJson) => {
  const post = Post.generatePost(postType, content);
  await repo.savePost(post);
  return post;
};
