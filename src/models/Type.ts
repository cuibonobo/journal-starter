import { ValidationError } from "../lib/errors";
import { IBaseJson, ITypeJson } from "../lib/interfaces";

export default class Type {
  public static validateName = (name: string): string => {
    // Make sure this is a domain-safe name. Regex from https://thekevinscott.com/emojis-in-javascript/#writing-a-regular-expression
    const r = new RegExp(/(?:[\w\-\.]|(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*)+/);
    const match = r.exec(name);
    if (match === null) {
      throw new ValidationError("This is not a valid type name");
    }
    if (match.index > 0) {
      throw new ValidationError(`Can't use that type name. Try again with '${match[0]}'.`);
    }
    if (name.startsWith('-') || name.endsWith('-')) {
      throw new ValidationError("A type name can't start or end with a hyphen.");
    }
    if (name.startsWith('.') || name.endsWith('.')) {
      throw new ValidationError("A type name can't start or end with a period.");
    }
    if ((name.length > 3 && name[2] === '-') || (name.length > 4 && name[3] === '-')) {
      throw new ValidationError("The 3rd or 4th characters in a type name cannot be hyphens.");
    }
    if (match[0] !== match.input) {
      throw new ValidationError(`Illegal characters in type name. Only the '${match[0]}' portion is permitted.`);
    }
    return name.toLowerCase();
  };

  public readonly name: string;
  public definition: IBaseJson;

  constructor(typeData: ITypeJson) {
    this.name = Type.validateName(typeData.name.toLowerCase());
    this.definition = typeData.definition;
  }
}
