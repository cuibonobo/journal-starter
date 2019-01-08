import { Repository, Settings } from "../models";

export default abstract class BaseApp {
  public readonly appName: string;
  private repository?: Repository;

  constructor(appName: string) {
    this.appName = appName;
  }

  get Repository(): Repository {
    if (this.repository === undefined) {
      throw new Error("Repository not defined!");
    }
    return this.repository;
  };

  set Repository(repository: Repository) {
    this.repository = repository;
  }

  public createRepo = async (repositoryDir: string) => {
    await Settings.createSettings(this.appName, repositoryDir)
    this.repository = await Repository.createRepository(repositoryDir);
  }

  public init = async () => {
    const settings = await Settings.getSettings(this.appName);
    this.repository = new Repository(settings.repositoryDir);
  }
}
