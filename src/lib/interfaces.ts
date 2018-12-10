export interface IArgs {
  args: string[];
  kwargs: {[key: string]: string | boolean};
}

export interface IBaseJson {
  [key: string]: any;
}

export interface ICommandArgs extends IArgs {
  command: string;
}

export interface IPostJson {
  id: string;
  type: string;
  createdDate: Date;
  updatedDate: Date;
  content: IBaseJson;
}

export interface ISettingsJson {
  repositoryDir: string;
}

export interface ITypeJson {
  name: string;
  definition: IBaseJson;
}
