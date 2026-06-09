import { get, post, postFormData } from "./client";
import { Feedback } from "@/types/database";

export interface FeedbackResponse {
  success: boolean;
  error?: string;
}

export interface UploadResponse {
  success: boolean;
  processed: number;
  errors?: string[];
  feedbacks?: unknown[];
}

export async function getFeedbacks(
  organizationId: string,
  days: number = 30,
): Promise<Feedback[]> {
  const response = await get<{ data: Feedback[] }>(
    `organizations/${organizationId}/feedback?days=${days}`,
  );
  return response.data;
}

export async function createFeedback(
  organizationId: string,
  text: string,
  source: string,
): Promise<FeedbackResponse> {
  return post(`/organizations/${organizationId}/feedback`, {
    text,
    source,
  });
}

export async function uploadCSV(
  organizationId: string,
  file: File,
  source: string,
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("source", source);
  return postFormData<UploadResponse>(
    `/organizations/${organizationId}/upload`,
    formData,
  );
}
