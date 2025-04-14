import { AxiosError } from "axios";

export const getErrorMessage = (error: unknown): string => {
  debugger
  if (error instanceof AxiosError && error.response?.data) {
    const { data } = error.response;
    
    if (data.message && typeof data.message === 'object' && data.message.message && Array.isArray(data.message.message)) {
      return data.message.message[0] || 'An error occurred';
    }

    if (data.message && typeof data.message === 'string') {
      return data.message;
    }

    if (data.message.message && typeof data.message.message === 'string') {
      return data.message.message;
    }
    
    return 'Server error';
  }
  return error instanceof Error ? error.message : 'An error occurred';
};
