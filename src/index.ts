const CHARACTERS = "0123456789abcdefghjkmnpqrstvwxyz";
const BASE = 32;
const RAND_SUFFIX = 3;

const intToCrockford32 = function(n: number) {
  let crock32 = "";
  while(n > 0) {
    const remainder = n % BASE;
    n = Math.floor(n / BASE);
    crock32 = CHARACTERS[remainder] + crock32;
  }
  return crock32;
}

const generateId = function() {
  const now = new Date();
  const time = now.getTime();
  const now_id = intToCrockford32(time);
  let rand_chars = "";
  for (let i = 0; i < RAND_SUFFIX; i++) {
    rand_chars += intToCrockford32(Math.floor(Math.random() * BASE))
  }
  return now_id + rand_chars;
}

export default generateId;
