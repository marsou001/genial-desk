import type { OrganizationMember, SearchParams, UserRole } from "@/types";

export function isEmailValid(email: string) {
  const trimmedEmail = email.trim();
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(trimmedEmail);
}

export function isSafeRedirect(path: string) {
  return path?.startsWith("/") && !path.startsWith("//");
}

// TODO: check if used
export function getTextSearchParams(searchParams: SearchParams) {
  let stringParams = "?";
  for (const param in searchParams) {
    stringParams += param + "=" + encodeURIComponent(searchParams[param]);
  }
  return stringParams;
}

export function generateToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function hashToken(token: string) {
  const data = new TextEncoder().encode(token);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

export function getRandomPrefix() {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789_";
  let prefix = "";

  for (let i = 0; i < 6; i++) {
    const randomCharacter =
      characters[Math.floor(Math.random() * characters.length)];
    prefix += randomCharacter;
  }

  return prefix;
}

export function prepareFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9_]/g, "_");
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getRoleColor(role: UserRole) {
  switch (role.toLowerCase()) {
    case "owner":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
    case "admin":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    case "analyst":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    default:
      return "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300";
  }
}

export function getAvatarPlaceholderInitial(member: OrganizationMember) {
  return (member.fullName ?? member.email).charAt(0).toUpperCase();
}

export function reload(ms = 1000) {
  setTimeout(() => window.location.reload(), ms);
}
