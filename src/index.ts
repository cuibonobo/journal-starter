import minimist = require("minimist");

const CHARACTERS = "0123456789abcdefghjkmnpqrstvwxyz";
const BASE = 32;
const RAND_SUFFIX = 3;

const intToCrockford32 = function(n: number) {
  let crock32 = "";
  if (n === 0) {
    return CHARACTERS[n];
  }
  while(n > 0) {
    const remainder = n % BASE;
    n = Math.floor(n / BASE);
    crock32 = CHARACTERS[remainder] + crock32;
  }
  return crock32;
};

const generateId = function() {
  const now = Date.now()
  const now_id = intToCrockford32(now);
  let rand_chars = "";
  for (let i = 0; i < RAND_SUFFIX; i++) {
    rand_chars += intToCrockford32(Math.floor(Math.random() * BASE))
  }
  return now_id + rand_chars;
};

const main = function() {
  const args = minimist(process.argv.slice(2));
  if (args['_'].indexOf('generate-id') > -1) {
    console.log(generateId());
    return;
  }
  console.log(args);
};

export default main;
