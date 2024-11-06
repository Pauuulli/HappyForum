import { object } from "yup";

export function objectKeyToCamel(obj: Record<string, any>) {
  return object().camelCase().cast(obj);
}
