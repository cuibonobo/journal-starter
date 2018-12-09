import * as path from "path";
import * as punycode from "punycode";
import { Cli } from "../lib/cli";
import { IBaseJson } from "../lib/interfaces/data";
import { isFile, readFile, writeFile } from "../lib/platform";
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

export const checkTypeName = (typeName: string): string | null => {
  // Make sure this is a domain-safe name. Regex from https://thekevinscott.com/emojis-in-javascript/#writing-a-regular-expression
  const r = new RegExp(/(?:[\w\-\.]|(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*)+/);
  const match = r.exec(typeName);
  if (match === null) {
    return "This is not a valid type name";
  }
  if (match.index > 0) {
    return `Can't use that type name. Try again with '${match[0]}'.`;
  }
  if (typeName.startsWith('-') || typeName.endsWith('-')) {
    return "A type name can't start or end with a hyphen.";
  }
  if (typeName.startsWith('.') || typeName.endsWith('.')) {
    return "A type name can't start or end with a period.";
  }
  if ((typeName.length > 3 && typeName[2] === '-') || (typeName.length > 4 && typeName[3] === '-')) {
    return "The 3rd or 4th characters in a type name cannot be hyphens.";
  }
  if (match[0] !== match.input) {
    return `Illegal characters in type name. Only the '${match[0]}' portion is permitted.`;
  }
  return null;
};

export const getTypeMetadata = async (name: string): Promise<{typeName: string, typeFilePath: string}> => {
  const typeName = name.toLowerCase();
  // Convert any Unicode characters to ASCII for the filename
  const typeFileName = punycode.toASCII(typeName) + ".json";
  const repo = await getRepository();
  const typeFilePath = path.join(repo.typesDir, typeFileName);
  return {typeName, typeFilePath};
};

export const createType = async (cli: Cli, name: string): Promise<void> => {
  let signal = false;
  const checkMsg = checkTypeName(name);
  if (checkMsg !== null) {
    cli.write(checkMsg);
    return;
  }
  const {typeName, typeFilePath} = await getTypeMetadata(name);
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
