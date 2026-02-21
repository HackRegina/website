import { useQuery } from '@tanstack/react-query';
import { generateQueryKey } from '@/utils/generateQueryKey';

export interface WebsiteDetails {
  title?: string;
  description?: string;
  image?: string;
  icon?: string;
}

export const useWebsiteDetails = ({ url }: { url: string }) => {
  const { data, isLoading, isError } = useQuery<WebsiteDetails>({
    queryKey: generateQueryKey({ key: 'website', query: { url } }),
    queryFn: async () => {
      const query = url
        ? new URLSearchParams({
            url,
          })
        : undefined;
      const response = await fetch(`/api/website${query ? `?${query}` : ''}`);
      return await response.json();
    },
  });
  return { data, isLoading, isError };
};
