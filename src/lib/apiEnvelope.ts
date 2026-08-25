import axios from "axios";

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: {
    field: string;
    message: string;
  }[];
}

export const extractErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiEnvelope<unknown> | undefined;

    return (
      data?.message ||
      error.message ||
      "Something went wrong. Please try again."
    );
  }

  return "Something went wrong. Please try again.";
};
