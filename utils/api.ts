type FetchParams = Parameters<typeof $fetch>;

async function api<T = any>(...args: FetchParams) {
  const [req, opt] = args;

  try {
    return await $fetch<T>(req, opt);
  } catch (e) {
    if (isUnauthErr(e)) {
      const { loginDialogVisible } = storeToRefs(useAppStore());
      loginDialogVisible.value = true;
    }
    throw e;
  }
}

function isUnauthErr(e: unknown) {
  return (
    e != null &&
    typeof e == "object" &&
    "statusCode" in e &&
    e.statusCode == 401
  );
}

export { api };
