import { AxiosError } from "axios";

export const getErrorMessage = (error: unknown): string => {
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

export const getUserNameById = <T extends { id: string; name: string }>(
  userId: string,
  users: T[]
): string => {
  const user = users.find(u => u.id === userId);
  return user ? user.name : userId;
};

export const getUserFriendlyErrorMessage = <T extends { id: string; name: string }>(
  error: unknown,
  users?: T[]
): string => {
  const errorMsg = getErrorMessage(error);

  if (!users) {
    return errorMsg;
  }

  if (errorMsg.includes("already exists") && errorMsg.includes("ObjectId")) {
    const match = errorMsg.match(/ObjectId\('([^']+)'\)/);
    if (match) {
      const userId = match[1];
      const userName = getUserNameById(userId, users);
      return `Attendance already exists for ${userName} on this date`;
    }
  }

  return errorMsg;
};
