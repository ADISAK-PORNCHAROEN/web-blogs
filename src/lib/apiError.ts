import axios from "axios";

interface ApiErrorResponse {
  error?: {
    message?: string;
  };
  message?: string;
}

export const getApiErrorMessage = (error: unknown, fallbackMessage: string): string => {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return fallbackMessage;
  }

  return error.response?.data?.message ?? error.response?.data?.error?.message ?? fallbackMessage;
};
