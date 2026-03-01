import { SearchParams } from "@/types";

export function isEmailValid(email: string) {
  const trimmedEmail = email.trim();
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(trimmedEmail);
}

export function isSafeRedirect(path: string) {
  return path?.startsWith('/') && !path.startsWith('//')
}

// TODO: check if used
export function getTextSearchParams(searchParams: SearchParams) {
  let stringParams = "?"
  for (const param in searchParams) {
    stringParams += param + "=" + encodeURIComponent(searchParams[param])
  }
  return stringParams
}

export function getRandomPrefix() {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789_";
  let prefix = "";
  
  for (let i = 0; i < 6; i++) {
    const randomCharacter = characters[Math.floor(Math.random() * characters.length)];
    prefix += randomCharacter;
  }

  return prefix;
}
