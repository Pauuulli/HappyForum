import { isDuplicateKeyErr } from "../../database/error-indentifier";

export function handleQueryError(err: unknown) {
  console.error("Error executing query", err);

  if (isDuplicateKeyErr(err)) {
    throw createError({
      statusCode: 409,
      statusMessage: "Duplicate Key.",
    });
  }

  throw err;
}
