import { object, string, number, array, tuple } from "yup";

export const querySchema = object({
  page: number().default(0),
  sort: array(tuple([string(), string()])).transform((v: string | string[]) => {
    const sortArr = typeof v == "string" ? v.split(",") : v;
    return sortArr.map((elem) =>
      elem[0] == "-" ? [elem.slice(1), "DESC"] : [elem, "ASC"],
    );
  }),
});
