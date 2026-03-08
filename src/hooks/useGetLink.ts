import { fetchLink } from '@/apis/linkApi';
import type { Link } from '@/types/link';
import { useQuery } from '@tanstack/react-query';

export function useGetLink(id: number | null) {
  return useQuery<Link, Error>({
    queryKey: ['link', id],
    queryFn: () => fetchLink(id!),
    enabled: !!id,
  });
}
