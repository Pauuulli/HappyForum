type $Fetch<T = any> = typeof $fetch<T>;
type PR<T> = ReturnType<$Fetch<T>>;
type Request = Parameters<$Fetch>[0];
type MethodWithBody = "POST" | "DELETE";

async function api<T = any>(url: Request): PR<T>;
async function api<T = any>(
  url: Request,
  method: "GET",
  query?: Record<string, any>,
): PR<T>;
async function api<T = any>(
  url: Request,
  method: MethodWithBody,
  body?: Record<string | number, any>,
  query?: Record<string, any>,
): PR<T>;
async function api<T = any>(
  url: Request,
  method?: "GET" | MethodWithBody,
  body?: Record<string | number, any>,
  query?: Record<string, any>,
): PR<T> {
  const _method = method ? method : "GET";

  try {
    return await $fetch<T>(url, {
      method: _method,
      body: method == "GET" ? undefined : body,
      query,
    });
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
