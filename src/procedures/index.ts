import { Cli } from "../lib/cli";
import { IBaseJson } from "../lib/interfaces/data";
import { isFile, readFile, writeFile } from "../lib/platform";
import { Post, Repository, Settings, Type } from "../models";

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

export const createType = async (cli: Cli, name: string): Promise<void> => {
  let signal = false;
  try {
    Type.validateName(name);
  } catch(err) {
    cli.write(err);
    return;
  }
  const repo = await getRepository();
  const {typeName, typeFilePath} = Type.getMetadata(repo, name);
  let bodyText: string = "";
  if (await isFile(typeFilePath)) {
    const fileData = await readFile(typeFilePath);
    const existsOpts: {[key: string]: () => void} = {
      "Edit": () => {
        bodyText = fileData;
      },
      "Overwrite": () => {
        // Keep body text blank
      },
      "Quit": () => {
        signal = true;
      }
    };
    const answer = await cli.readAnswer(`Type ${typeName} already exists! What would you like to do?`, Object.keys(existsOpts));
    existsOpts[answer]();
  }
  if (signal) {
    return;
  }

  const text = cli.readBody(bodyText, "Define your type above in JSON format.");
  // TODO: Define an interface for type data
  let data = {};
  try {
    data = JSON.parse(text);
  } catch(err) {
    // TODO: Allow fixing JSON errors
    cli.write("Can't parse input as JSON!");
    return;
  }

  await writeFile(typeFilePath, JSON.stringify(data, null, 4));
  cli.write(`New type created: ${typeName}`);
};
