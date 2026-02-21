import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import type { MemberResponse } from '@/fetch/members';
import { generateQueryKey } from '@/utils/generateQueryKey';

export const useMembers = () => {
  const {
    data,
    isFetching,
    isFetchingNextPage,
    isLoading,
    fetchNextPage,
    hasNextPage = false,
  } = useInfiniteQuery<MemberResponse>({
    queryKey: generateQueryKey({ key: 'members', query: { cursor: null } }),
    queryFn: async ({ pageParam = null }) => {
      const cursor = pageParam as string | null;
      const query = cursor
        ? new URLSearchParams({
            cursor: cursor,
          })
        : undefined;
      const response = await fetch(`/api/members${query ? `?${query}` : ''}`);
      return await response.json();
    },
    getNextPageParam: (resp: MemberResponse) => {
      return resp.cursor || undefined;
    },
    getPreviousPageParam: (resp: MemberResponse) => {
      return resp.cursor || undefined;
    },
    initialPageParam: null,
  });

  if (!(isFetching || isFetchingNextPage || isLoading) && hasNextPage) {
    fetchNextPage();
  }

  const members = useMemo(() => {
    const seen = new Set();
    return (
      data?.pages
        ?.flatMap(({ members }) => members)
        .filter((item) => {
          const k = item.user_id;
          return seen.has(k) ? false : seen.add(k);
        }) || []
    );
  }, [data?.pages]);

  return { data: members, isLoading };
};
