import minimist = require("minimist");
import { generateId } from "./lib/id";


const main = () => {
  const args = minimist(process.argv.slice(2));
  if (args._.indexOf('generate-id') > -1) {
    process.stdout.write(generateId());
    return;
  }
  process.stdout.write(args._.toString());
};

export default main;
