// src/hooks/useUsers.ts
import { User, createUser, fetchUsers } from '@/apis/userApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useUsers() {
  return useQuery<User[], Error, User[], ['users']>({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation<User, Error, Pick<User, 'name' | 'email'>>({
    mutationFn: createUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
