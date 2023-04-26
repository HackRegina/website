import { Text } from '@chakra-ui/react'
import { QueryClient, dehydrate } from '@tanstack/react-query'
import type { NextPage } from 'next'
import BecomeSponsor from '../components/BecomeSponsor/BecomeSponsor'
import { Benefits } from '../components/Benefits/Benefits'
import { CallToAction } from '../components/CallToAction/CallToAction'
import { Footer } from '../components/Footer/Footer'
import { Members } from '../components/Members/Members'
import { Navbar } from '../components/Navbar/Navbar'
import { Organizations } from '../components/Organizations/Organizations'
import { fetchMembers } from '../fetch/members'
import { useMembers } from '../hooks/useMembers'
import { useOrganizations } from '../hooks/useOrganizations'
import { ICommunityMember } from '../interfaces/community-member'
import styles from '../styles/Home.module.css'
import { generateQueryKey } from '../utils/generateQueryKey'
import { fetchOrganizations } from '../fetch/organizations'

interface IProps {
  members: ICommunityMember[]
  cursor: string
}

const Home: NextPage<IProps> = ({}: IProps) => {
  const { members } = useMembers()
  const { sponsors, partners } = useOrganizations()
  return (
    <div className={styles.container}>
      <Navbar />
      <CallToAction />
      <Benefits />
      <Organizations title="Partners" organizations={partners}>
        <Text w={{ base: 'auto', lg: '2xl' }} textAlign="center">
          We wouldn&apos;t be able to offer any of the events or services without support from our
          partners. We are truly lucky to work with the folowing organizations in order to help
          maintain a strong community.
        </Text>
      </Organizations>
      <Organizations title="Sponsors" organizations={sponsors}>
        <Text w={{ base: 'auto', lg: '2xl' }} textAlign="center">
          We are thankful for the organizations that help HackRegina and provide us with the support
          to continue to provide services to our community.
        </Text>
      </Organizations>
      <BecomeSponsor />
      <Members members={members} />
      <Footer />
    </div>
  )
}

export async function getServerSideProps() {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    queryKey: generateQueryKey({ key: 'members', query: { cursor: null } }),
    queryFn: () => fetchMembers(),
  })
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

export default Home
