import { useQuery } from '@tanstack/react-query';
import type { OrganizationResponse } from '@/fetch/organizations';
import { generateQueryKey } from '@/utils/generateQueryKey';

export const useOrganizations = () => {
  const { data, isLoading } = useQuery<OrganizationResponse>({
    queryKey: generateQueryKey({ key: 'organizations', query: {} }),
    queryFn: async () => {
      const response = await fetch('/api/organizations');
      return await response.json();
    },
  });

  return {
    data: data?.organizations || [],
    partners: data?.partners || [],
    sponsors: data?.sponsors || [],
    isLoading,
  };
};
