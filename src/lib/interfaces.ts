export interface ISettingsJSON {
  repositoryDir: string;
}

export interface ICommands {
  [key: string]: (args: string[], kwargs: {[key: string]: string | boolean}) => Promise<void>;
}

export interface IBaseJson {
  [key: string]: any;
}

export interface IPostJson {
  id: string;
  type: string;
  createdDate: Date;
  updatedDate: Date;
  content: IBaseJson;
}
