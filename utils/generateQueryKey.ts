type KeyType = 'members' | 'organizations' | 'website' | 'events' | 'admin-events' | 'admin-attendees';

export const generateQueryKey = ({
  key,
  id = null,
  query = null,
}: {
  key: KeyType;
  id?: string | null;
  query?: unknown | null;
}): readonly unknown[] => [key, id, query];
