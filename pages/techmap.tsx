import { dehydrate, QueryClient } from '@tanstack/react-query';
import type { NextPage } from 'next';
import { Layout } from '@/components/layout/Layout';
import { fetchOrganizations } from '@/fetch/organizations';
import { TechMapScene } from '@/scenes/TechMapScene/TechMapScene';
import { generateQueryKey } from '@/utils/generateQueryKey';

const TechMapPage: NextPage = () => {
  return (
    <Layout title="Tech Map - HackRegina">
      <TechMapScene />
    </Layout>
  );
};

export async function getServerSideProps() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: generateQueryKey({ key: 'organizations', query: {} }),
    queryFn: () => fetchOrganizations(),
  });
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default TechMapPage;
