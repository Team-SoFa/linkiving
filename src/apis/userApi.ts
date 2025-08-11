// src/apis/userApi.ts
import apiClient from '@/apis/apiClient';

export interface User {
  id: number;
  name: string;
  email: string;
}

/** 전체 사용자 조회 */
export const fetchUsers = async (): Promise<User[]> => {
  // JSONPlaceholder는 User[]를 바로 반환합니다.
  const { data } = await apiClient.get<User[]>('/users');
  return data; // ← .users 가 아니라 response.data 자체가 배열
};

/** 사용자 생성 */
export const createUser = async (payload: Pick<User, 'name' | 'email'>): Promise<User> => {
  // 서버가 단일 User 객체를 반환한다고 가정
  const response = await apiClient.post<User>('/users', payload);
  return response.data;
};
