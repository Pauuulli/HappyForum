import { pool } from "../utils/database/client";
import path from "node:path";
import { objectKeyToCamel } from "../utils/key-transformer";
import { object, string, number, array } from "yup";

export default eventHandler(async (evt) => {
  const schema = object({
    a: string().matches(/^-?(abc|123)$/),
    b: array(string()).transform((v: string | string[]) => {
      const sortArr = typeof v == "string" ? v.split(",") : v;
      return sortArr.map((elem) => (elem[0] == "-" ? `${elem.slice(1)} DESC` : elem));
    }),
  });
  return schema.cast(null);
});
