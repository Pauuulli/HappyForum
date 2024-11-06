type QueryValue = ReturnType<typeof useRoute>["query"][string];

export function getSingleQueryValue(queryVal: QueryValue) {
  return queryVal instanceof Array ? queryVal[0] : queryVal;
}
