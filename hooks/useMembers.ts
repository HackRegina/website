import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { MemberResponse } from '../fetch/members'
import { generateQueryKey } from '../utils/generateQueryKey'

export const useMembers = () => {
  const {
    data,
    isFetching,
    isFetchingNextPage,
    isLoading,
    fetchNextPage,
    hasNextPage = false,
  } = useInfiniteQuery<MemberResponse>(
    generateQueryKey({ key: 'members', query: { cursor: null } }),
    async ({ pageParam: { cursor = null } = {} }) => {
      const query = cursor
        ? new URLSearchParams({
            cursor: cursor,
          })
        : undefined
      const response = await fetch('/api/members' + (query ? `?${query}` : ''))
      return await response.json()
    },

    {
      getNextPageParam: (resp: MemberResponse): { cursor?: string | null } => {
        return { cursor: resp.cursor }
      },
      getPreviousPageParam: (resp: MemberResponse): { cursor?: string | null } => {
        return { cursor: resp.cursor }
      },
    },
  )
  if (!(isFetching || isFetchingNextPage || isLoading) && hasNextPage) {
    fetchNextPage()
  }
  const members = useMemo(() => {
    let seen = new Set()
    return (
      data?.pages
        ?.map(({ members }) => members)
        ?.flat()
        .filter((item) => {
          let k = item.user_id
          return seen.has(k) ? false : seen.add(k)
        }) || []
    )
  }, [data?.pages])
  return { members }
}
