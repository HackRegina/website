import { QueryClient, dehydrate } from '@tanstack/react-query'
import type { NextPage } from 'next'
import { EventList } from '../components/EventList/EventList'
import { FeaturedEvent } from '../components/FeaturedEvent/FeaturedEvent'
import { Footer } from '../components/Footer/Footer'
import { Navbar } from '../components/Navbar/Navbar'
import { fetchEvents } from '../fetch/events'
import { useEvents } from '../hooks/useEvents'
import { IEventResponse } from '../interfaces/event'
import styles from '../styles/Home.module.css'
import { generateQueryKey } from '../utils/generateQueryKey'

interface IProps {
  events: IEventResponse
}

const Events: NextPage<IProps> = ({}: IProps) => {
  const { events } = useEvents()
  const [featuredEvent, ...remainingEvents] = events
  return (
    <div className={styles.container}>
      <Navbar />
      {featuredEvent?.status === 'live' && <FeaturedEvent event={featuredEvent} />}
      <EventList events={remainingEvents} />
      <Footer /> 
    </div>
  )
}

export async function getServerSideProps() {
  const queryClient = new QueryClient()
  const query = { time_filter: 'current_future' } as const
  await queryClient.prefetchQuery({
    queryKey: generateQueryKey({ key: 'events', query }),
    queryFn: async () => {
      const { data } = await fetchEvents(query)
      return data
    },
  })
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

export default Events
