import { jwtVerify, errors } from "jose";
import type { H3Event } from "~/models/server";
import { jwtConfig } from "~/server/auth/jwt";
import { secret } from "~/server/auth/secret";

async function checkIsAuthed(event: H3Event) {
  const { jwt } = parseCookies(event);
  if (!jwt) {
    throw unauthErr;
  }

  try {
    const {
      payload: { userId },
    } = await jwtVerify<{ exp: number; userId: string }>(jwt, secret, {
      issuer: jwtConfig.issuer,
      audience: jwtConfig.audience,
    });
    return userId;
  } catch (e) {
    if (e instanceof errors.JWTExpired) throw unauthErr;
    throw e;
  }
}

const unauthErr = createError({
  statusCode: 401,
  statusMessage: "Unauthorized",
});

export { checkIsAuthed };
export { secret } from "~/server/auth/secret";
export { jwtConfig, setJwtCookies } from "~/server/auth/jwt";
