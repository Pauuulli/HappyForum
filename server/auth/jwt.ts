import { SignJWT } from "jose";
import { secret } from "./secret";
import type { H3Event } from "~/models/server";

export const jwtConfig = {
  issuer: "https://plgor-forum.com",
  audience: "https://plgor-forum.com/api",
};

export async function setJwtCookies(event: H3Event, userId: string) {
  const token = await generateToken(userId);

  const weekInSec = 7 * 24 * 60 * 60;
  setCookie(event, "jwt", token, {
    path: "/",
    maxAge: weekInSec,
    httpOnly: true,
  });

  return { exp: Date.now() + weekInSec * 1000 };
}

async function generateToken(userId: string) {
  const jwt = await new SignJWT()
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(userId)
    .setIssuedAt()
    .setIssuer(jwtConfig.issuer)
    .setAudience(jwtConfig.audience)
    .setExpirationTime("7d")
    .sign(secret);

  return jwt;
}
