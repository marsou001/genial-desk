import { post } from "./client";

export interface CreateOrganizationResponse {
  success: boolean;
  plan: string;
  organization: {
    id: string;
    name: string;
    role: string;
  };
}

export async function createOrganization(
  name: string,
  plan: string,
): Promise<CreateOrganizationResponse> {
  return post<CreateOrganizationResponse>("organizations", { name, plan });
}
