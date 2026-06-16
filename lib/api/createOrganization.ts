import { post } from "./client";

export interface CreateOrganizationResponse {
  organization: {
    id: string;
    name: string;
    role: string;
  };
}

export async function createOrganization(
  name: string,
): Promise<CreateOrganizationResponse> {
  return post<CreateOrganizationResponse>("organizations", { name });
}
