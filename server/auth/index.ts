import { jwtVerify, errors } from "jose";
import type { H3Event } from "~/models/server";
import { jwtConfig } from "~/server/auth/jwt";
import { secret } from "~/server/auth/secret";

type UnAuthed = { isAuthed: false; userId: undefined };
type Authed = { isAuthed: true; userId: string };

async function checkIsAuthed(event: H3Event): Promise<UnAuthed | Authed> {
  const { jwt } = parseCookies(event);
  if (!jwt) {
    return { isAuthed: false, userId: undefined };
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
    return { isAuthed: false, userId: undefined };
  }
}

export { checkIsAuthed };
export { secret } from "~/server/auth/secret";
export { jwtConfig, setJwtCookies } from "~/server/auth/jwt";
