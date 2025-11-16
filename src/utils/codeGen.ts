import crypto from "crypto";

export function codeGen(length: number = 6): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return [...Array(length)]
    .map(() => chars[crypto.randomInt(chars.length)])
    .join("");
}
