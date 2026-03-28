import { UserRole } from ".";

export type ErrorActionState = ActionStateBaseWithoutSuccess & {};

export type AuthActionState = ActionStateBase & {
  email: string;
  password: string;
}

export type RequestPasswordResetActionState = ActionStateBase & {
  email: string;
};

export type ResetPasswordActionState = ActionStateBase & {
  password: string;
  confirmPassword: string;
};

export type CreateOrganizationrActionState = ActionStateBaseWithoutSuccess & {
  name: string;
};

export type InviteMemberActionState = ActionStateBase & {
  email: string;
  role: Exclude<UserRole, "owner">;
};

export type EditAvatarActionState = ActionStateBase & {
  avatarUrl: string | null;
};

export type ActionStateBase = {
  isSuccess: boolean;
  error: string | null;
}

export type ActionStateBaseWithoutSuccess = {
  error: string | null;
}
