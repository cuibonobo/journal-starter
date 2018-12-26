import { Repository, Settings } from "../models";

export default class BaseApp {
  private repository?: Repository;

  constructor(repository?: Repository) {
    this.repository = repository;
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
}
