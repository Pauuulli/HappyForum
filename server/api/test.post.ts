import { pool } from "../utils/database/client";
import path from "node:path"
import { objectKeySnakeToCamel } from "../utils/key-transformer";

export default eventHandler(async (evt) => {
  

  return objectKeySnakeToCamel({_happy_at_123_: 1})
});
