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

export interface ISettingsJson {
  repositoryDir: string;
}

export interface ITypeJson {
  name: string;
  definition: IBaseJson;
}
