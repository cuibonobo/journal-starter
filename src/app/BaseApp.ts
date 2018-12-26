import { Repository, Settings } from "../models";

export default class BaseApp {
  public readonly settings: Settings;
  public readonly repository: Repository;

  constructor(settings: Settings, repository: Repository) {
    this.settings = settings;
    this.repository = repository;
  }
}
