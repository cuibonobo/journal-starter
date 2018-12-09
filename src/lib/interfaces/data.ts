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

export interface ISettingsJSON {
  repositoryDir: string;
}
