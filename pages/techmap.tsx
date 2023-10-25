import { QueryClient, dehydrate } from '@tanstack/react-query'
import type { NextPage } from 'next'
import { Navbar } from '../components/Navbar/Navbar'
import { TechMap } from '../components/TechMap/TechMap'
import { fetchOrganizations } from '../fetch/organizations'
import { useOrganizations } from '../hooks/useOrganizations'
import styles from '../styles/Home.module.css'
import { generateQueryKey } from '../utils/generateQueryKey'


const TechMapPage: NextPage = () => {
  const { organizations } = useOrganizations()
  return (
    <div className={styles.container}>
      <Navbar />
      <TechMap organizations={organizations} />
    </div>
  )
}

export async function getServerSideProps() {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    queryKey: generateQueryKey({ key: 'organizations', query: {} }),
    queryFn: () => fetchOrganizations(),
  })
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

export default TechMapPage
