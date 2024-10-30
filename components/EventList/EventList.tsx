import {
  Card,
  CardBody,
  Center,
  Container,
  Divider,
  Flex,
  Heading,
  Image,
  Link,
  Stack,
  Text,
  useColorModeValue,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import { DateTime } from 'luxon'
import React from 'react'
import { IDraftEvent, IEvent, ILiveEvent } from '../../interfaces/event'

interface IProps {
  events: IEvent[]
}

export const EventList = ({ events = [] }: React.PropsWithChildren<IProps>) => {
  const textBackground = useColorModeValue('brand_red.300', 'brand_red.700')
  if (events.length === 0) return null
  return (
    <Container maxW={'7xl'} mb={60}>
      <Stack
        flex={1}
        spacing={{ base: 5, md: 10 }}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Heading
          lineHeight={1.1}
          fontWeight={600}
          fontSize={{ base: '2xl', sm: '3xl', lg: '5xl' }}
          width="auto"
        >
          <Text
            position={'relative'}
            _after={{
              content: "''",
              width: 'full',
              height: '30%',
              position: 'absolute',
              bottom: 1,
              left: 0,
              bg: textBackground,
              zIndex: -1,
            }}
          >
            Upcoming Events
          </Text>
        </Heading>
      </Stack>
      <Wrap justify="center" spacingX={40} spacingY={20} mt="20">
        {events.map((event: IEvent) => (
          <WrapItem key={event.id} w={{ base: '100%', md: '33.3%' }} justifyContent="center">
            <Center>
              {event.status === 'live' && <UpcomingEventCard event={event} />}
              {event.status === 'draft' && <DraftEventCard event={event} />}
            </Center>
          </WrapItem>
        ))}
      </Wrap>
    </Container>
  )
}
const UpcomingEventCard = ({ event }: { event: ILiveEvent }) => {
  const { name, image, url, venue } = event
  const [lightBg, darkBg] = getEventColor(name)
  const bgColor = useColorModeValue(lightBg, darkBg)
  return (
    <Link href={url} display={'block'}>
      <Card maxW="sm" bgColor={bgColor}>
        <EventImage src={image} alt={name} />
        <CardBody>
          <Stack spacing="3">
            <Heading size="md">{name}</Heading>
            {DateTime.fromMillis(event.start).toLocaleString(DateTime.DATETIME_FULL)}
            {!!venue?.place_name && <Text>{venue?.place_name}</Text>}
          </Stack>
        </CardBody>
      </Card>
    </Link>
  )
}

const getEventColor = (name: string) => {
  if (name.includes('Code Together')) return ['brand_red.300', 'brand_red.700']
  if (name.includes('Lunch n Learn')) return ['brand_blue.300', 'brand_blue.700']
  return ['gray.300', 'gray.700']
}

const DraftEventCard = ({ event }: { event: IDraftEvent }) => {
  const { name, image, venue } = event
  const [lightBg, darkBg] = getEventColor(name)
  const bgColor = useColorModeValue(lightBg, darkBg)
  return (
    <Card maxW="sm" bgColor={bgColor}>
      <EventImage src={image} alt={name} />
      <CardBody>
        <Stack spacing="3">
          <Heading size="md">{name}</Heading>
          {DateTime.fromMillis(event.start).toLocaleString(DateTime.DATETIME_FULL)}
          {!!venue?.place_name && <Text>{venue?.place_name}</Text>}
        </Stack>
      </CardBody>
    </Card>
  )
}

const EventImage = ({ src, alt }: { src: string; alt: string }) => (
  <Image
    src={src}
    alt={alt}
    borderRadius="lg"
    style={{
      width: '100%',
      objectFit: 'cover',
    }}
  />
)
