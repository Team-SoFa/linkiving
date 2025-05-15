// src/hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUsers, createUser, User } from "@/apis/userApi";

export function useUsers() {
  return useQuery<User[], Error, User[], ["users"]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation<User, Error, Pick<User, "name" | "email">>({
    mutationFn: createUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
