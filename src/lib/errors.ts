export class ValidationError extends Error {
  public name: string = "ValidationError";
};

export class RepositoryError extends Error {
  public name: string = "RepositoryError";
};