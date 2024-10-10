function isDuplicateKeyErr(e: unknown) {
  return e != null && typeof e == "object" && "code" in e && e.code === "23505";
}

export { isDuplicateKeyErr };
