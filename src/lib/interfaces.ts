export interface ISettingsJSON {
  repositoryDir: string;
}

export interface ICommands {
  [key: string]: () => Promise<void>;
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
