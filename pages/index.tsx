import { Text } from '@chakra-ui/react'
import type { NextPage } from 'next'
import { Benefits } from '../components/Benefits/Benefits'
import { CallToAction } from '../components/CallToAction/CallToAction'
import { Footer } from '../components/Footer/Footer'
import { Members } from '../components/Members/Members'
import { Navbar } from '../components/Navbar/Navbar'
import { Organizations } from '../components/Organizations/Organizations'
import { CommunityMembers } from '../constants/members'
import { HackReginaPartners } from '../constants/partners'
import { HackReginaSponsors } from '../constants/sponsors'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Navbar />
      <CallToAction />
      <Benefits />
      <Organizations title="Partners" organizations={HackReginaPartners}>
        <Text w={{ base: 'auto', lg: '2xl' }} textAlign="center">
          We wouldn&apos;t be able to offer any of the events or services without support from our
          partners. We are truly lucky to work with the folowing organizations in order to help
          maintain a strong community.
        </Text>
      </Organizations>
      <Organizations title="Sponsors" organizations={HackReginaSponsors}>
        <Text w={{ base: 'auto', lg: '2xl' }} textAlign="center">
          We are thankful for the organizations that help HackRegina and provide us with the support
          to continue to provide services to our community.‰
        </Text>
      </Organizations>
      <Members members={CommunityMembers} />
      <Footer />
    </div>
  )
}

export default Home
