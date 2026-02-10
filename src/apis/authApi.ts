import { clientApiClient } from '@/lib/client/apiClient';
import { ApiError } from '@/lib/errors/ApiError';
import { User } from '@/types/user';

interface UserInfoResponse {
  success: boolean;
  data?: User;
  message?: string;
}

export const fetchUserInfo = async (): Promise<User> => {
  const response = await clientApiClient<UserInfoResponse>('/api/auth/me');

  if (!response.success || !response.data) {
    throw new ApiError(200, response.message || 'Failed to fetch user info', response);
  }

  return response.data;
};

export const logout = async (): Promise<void> => {
  await clientApiClient('/api/auth/logout', {
    method: 'POST',
  });
};
