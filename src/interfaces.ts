export interface IArgs {
  args: string[];
  kwargs: {[key: string]: string | boolean};
}

export interface ICommandArgs extends IArgs {
  command: string;
}
