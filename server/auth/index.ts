import { jwtVerify } from "jose";
import type { H3Event } from "~/models/server";
import { jwtConfig } from "~/server/auth/jwt";
import { secret } from "~/server/auth/secret";

async function checkIsAuthed(event: H3Event) {
  const { jwt } = parseCookies(event);
  if (!jwt) throw unauthErr;

  const {
    payload: { exp, userId },
  } = await jwtVerify<{ exp: number; userId: string }>(jwt, secret, {
    issuer: jwtConfig.issuer,
    audience: jwtConfig.audience,
  });
  const expired = exp - Date.now() < 0;
  if (expired) throw unauthErr;

  return userId;
}

const unauthErr = createError({
  statusCode: 401,
  statusMessage: "Unauthorized",
});

export { checkIsAuthed };
export { secret } from "~/server/auth/secret";
export { jwtConfig, setJwtCookies } from "~/server/auth/jwt";
