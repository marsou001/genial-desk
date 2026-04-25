export const TOAST_FLASH_KEYS = {
  ORG_NO_ACCESS: "org_no_access",
  ORG_NOT_FOUND: "org_not_found",
  NO_REQUIRED_ROLE_FOR_ORG: "no_required_org_for_role",
};

export const TOAST_FLASH_MESSAGES = {
  [TOAST_FLASH_KEYS.ORG_NO_ACCESS]: "You don't have access to this organization",
  [TOAST_FLASH_KEYS.ORG_NOT_FOUND]: "Organization not found",
  [TOAST_FLASH_KEYS.NO_REQUIRED_ROLE_FOR_ORG]: "Your role doesn't allow you to do this",
}