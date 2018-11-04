import { generateId, intToCrockford32 } from "./id";

test("Generate Crockford base 32 for single digits", () => {
  expect(intToCrockford32(0)).toBe("0");
  expect(intToCrockford32(1)).toBe("1");
  expect(intToCrockford32(10)).toBe("a");
  expect(intToCrockford32(18)).toBe("j");
  expect(intToCrockford32(20)).toBe("m");
  expect(intToCrockford32(22)).toBe("p");
  expect(intToCrockford32(27)).toBe("v");
  expect(intToCrockford32(31)).toBe("z");
});

test("Crockford base 32 generates the correct number of digits", () => {
  expect(intToCrockford32(32)).toBe("10");
  expect(intToCrockford32(1024)).toBe("100");
  expect(intToCrockford32(32768)).toBe("1000");
  expect(intToCrockford32(1048576)).toBe("10000");
  expect(intToCrockford32(33554432)).toBe("100000");
  expect(intToCrockford32(1073741824)).toBe("1000000");
  expect(intToCrockford32(34359738368)).toBe("10000000");
  expect(intToCrockford32(1099511627776)).toBe("100000000");
  expect(intToCrockford32(35184372088832)).toBe("1000000000");
});

test("ID contains 12 characters", () => {
  const id = generateId();
  expect(typeof id).toBe("string");
  expect(id.length).toBe(12);
});

test("ID reflects current time", () => {
  const now = Math.floor(Date.now());
  const id = generateId();
  const timestamp = id.substr(0, 9);
  expect(timestamp).toBe(intToCrockford32(now));
});
