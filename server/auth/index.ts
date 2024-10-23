import { jwtVerify, errors } from "jose";
import type { H3Event } from "~/models/server";
import { jwtConfig } from "~/server/auth/jwt";
import { secret } from "~/server/auth/secret";

async function checkIsAuthed(event: H3Event) {
  const { jwt } = parseCookies(event);
  if (!jwt) {
    return { isAuthed: false };
  }

  try {
    const {
      payload: { sub: userId },
    } = await jwtVerify<{ sub: string }>(jwt, secret, {
      issuer: jwtConfig.issuer,
      audience: jwtConfig.audience,
    });
    return { isAuthed: true, userId };
  } catch (e) {
    return { isAuthed: false };
  }
}

export { checkIsAuthed };
export { secret } from "~/server/auth/secret";
export { jwtConfig, setJwtCookies } from "~/server/auth/jwt";
