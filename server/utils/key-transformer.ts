export function objectKeySnakeToCamel(obj: Record<string, any>) {
  const result = {} as Record<string, any>;
  for (const key in obj) {
    result[snakeToCamel(key)] = obj[key];
  }
  return result;
}

function snakeToCamel(str: string) {
  return str.replace(/(?<=[a-z0-9])_([a-z0-9])/gi, (_, p1) =>
    (p1 as string).toUpperCase(),
  );
}
