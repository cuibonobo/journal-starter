export interface ISettingsJSON {
  repositoryDir: string;
}

export interface ICommands {
  [key: string]: () => Promise<void>;
}