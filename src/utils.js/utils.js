export const parseStringify = (value) => {
  const replacer = (key, val) => {
    if (typeof val === "bigint") {
      return val.toString(); // Convert BigInt to string
    }
    return val;
  };
  return JSON.parse(JSON.stringify(value, replacer));
};
