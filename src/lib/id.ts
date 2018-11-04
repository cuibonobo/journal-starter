const CHARACTERS = "0123456789abcdefghjkmnpqrstvwxyz";
const BASE = 32;
const RAND_SUFFIX = 3;

export const intToCrockford32 = (n: number) => {
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

export const generateId = () => {
  const now = Date.now()
  const nowId = intToCrockford32(now);
  let randChars = "";
  for (let i = 0; i < RAND_SUFFIX; i++) {
    randChars += intToCrockford32(Math.floor(Math.random() * BASE))
  }
  return nowId + randChars;
};
