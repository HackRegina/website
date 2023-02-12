type KeyType = 'members'
export const generateQueryKey = ({
  key,
  id = null,
  query = null,
}: {
  key: KeyType
  id?: string | null
  query?: unknown | null
}): readonly unknown[] => [key, id, query]
