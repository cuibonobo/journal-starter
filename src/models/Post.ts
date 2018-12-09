import { generateId } from "../lib/id";
import { IBaseJson, IPostJson } from "../lib/interfaces/data";

export default class Post {
  public static generatePost(type: string, content: IBaseJson) {
    return new Post({
      content,
      createdDate: new Date(),
      id: generateId(),
      type,
      updatedDate: new Date()
    });
  }

  public readonly id: string;
  public readonly type: string;
  public createdDate: Date;
  public updatedDate: Date;
  public content: IBaseJson;

  constructor(postData: IPostJson) {
    this.id = postData.id;
    this.type = postData.type;
    this.createdDate = postData.createdDate;
    this.updatedDate = postData.updatedDate;
    this.content = postData.content;
  }
}
