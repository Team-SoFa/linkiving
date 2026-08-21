import { getGaClientId } from '@/lib/client/analytics';
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

export type MemberDeleteReason =
  | 'NO_USEFUL_LINKS'
  | 'POOR_SEARCH'
  | 'NO_REVISIT'
  | 'SWITCHED_SERVICE'
  | 'PRIVACY_CONCERN'
  | 'OTHER';

const createFallbackClientId = () => `${Date.now()}.${Math.floor(Math.random() * 1_000_000_000)}`;

export const deleteAccount = async (deleteReason: MemberDeleteReason): Promise<void> => {
  const clientId = (await getGaClientId().catch(() => null)) ?? createFallbackClientId();

  await clientApiClient('/api/member', {
    method: 'DELETE',
    body: JSON.stringify({ confirmed: true, deleteReason, clientId }),
  });
};
