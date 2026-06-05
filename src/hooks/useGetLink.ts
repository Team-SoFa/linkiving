import { fetchLink } from '@/apis/linkApi';
import type { EntityId } from '@/types/id';
import type { Link } from '@/types/link';
import { useQuery } from '@tanstack/react-query';

export function useGetLink(id: EntityId | null) {
  return useQuery<Link, Error>({
    queryKey: ['link', id],
    queryFn: () => fetchLink(id!),
    enabled: !!id,
  });
}
