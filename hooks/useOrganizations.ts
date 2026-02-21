import { useQuery } from '@tanstack/react-query';
import { fetchOrganizations } from '@/fetch/organizations';
import { generateQueryKey } from '@/utils/generateQueryKey';

export const useOrganizations = () => {
  const { data, isLoading } = useQuery({
    queryKey: generateQueryKey({ key: 'organizations', query: {} }),
    queryFn: fetchOrganizations,
  });

  return {
    data: data?.organizations || [],
    isLoading,
  };
};
