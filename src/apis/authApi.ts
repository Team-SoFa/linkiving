import { clientApiClient } from '@/lib/client/apiClient';
import { ApiError } from '@/lib/errors/ApiError';
import { UserInfoResponse } from '@/types/api/authApi';
import { User } from '@/types/user';

export const fetchUserInfo = async (): Promise<User> => {
  const response = await clientApiClient<UserInfoResponse>('/api/member/me');

  if (!response.success || !response.data) {
    throw new ApiError(200, response.message || 'Failed to fetch user info', response);
  }

  return response.data;
};

export const logout = async (): Promise<void> => {
  await clientApiClient('/api/member/logout', {
    method: 'POST',
  });
};
