import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Icon,
  IconProps,
  Image,
  Stack,
  Text,
  useColorModeValue
} from '@chakra-ui/react'
import { DateTime } from 'luxon'
import { ILiveEvent } from '../../interfaces/event'

interface IProps {
  event: ILiveEvent
}

export const FeaturedEvent = ({ event }: IProps) => {
  const { name, image, url, summary, venue } = event
  return (
    <Container maxW={'7xl'} pt={{ md: 40 }} id="feature-event">
      <Stack
        align={'center'}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 20, md: 28 }}
        direction={{ base: 'column', md: 'row' }}
      >
        <Stack flex={1} spacing={{ base: 5, md: 10 }}>
          <Heading
            lineHeight={1.1}
            fontWeight={600}
            fontSize={{ base: '3xl', sm: '4xl', lg: '6xl' }}
          >
            <Text
              as={'span'}
              position={'relative'}
              _after={{
                content: "''",
                width: 'full',
                height: '30%',
                position: 'absolute',
                bottom: 1,
                left: 0,
                bg: useColorModeValue('brand_red.300', 'brand_red.700'),
                zIndex: -1,
              }}
            >
              Join us at our next
            </Text>
            <br />
            <Text as={'span'} color={useColorModeValue('brand_red.700', 'brand_red.300')}>
              {event.name}
            </Text>
          </Heading>
          <Box marginBottom={4} color={'gray.500'}>
            <Text fontSize={'xl'} fontWeight={'bold'}>
              {DateTime.fromMillis(event.start).toLocaleString(DateTime.DATETIME_FULL)}
            </Text>
            {!!venue?.place_name && <Text>{venue?.place_name}</Text>}
            {!!venue?.localized_address_display && (
              <Text>{venue?.localized_address_display}</Text>
            )}
          </Box>
          <Box marginBottom={4}>{summary}</Box>
          <Stack spacing={{ base: 4, sm: 6 }} direction={{ base: 'column', sm: 'row' }}>
            <Button
              as={'a'}
              rounded={'full'}
              size={'lg'}
              fontWeight={'normal'}
              px={6}
              colorScheme={'brand_red'}
              bg={useColorModeValue('brand_red.700', 'brand_red.300')}
              _hover={{ bg: 'brand_red.500' }}
              href={url}
            >
              Register
            </Button>
          </Stack>
        </Stack>
        <Flex flex={1} justify={'center'} align={'center'} position={'relative'} w={'full'}>
          <Blob
            w={'150%'}
            h={'150%'}
            position={'absolute'}
            top={'-20%'}
            left={0}
            zIndex={-1}
            color={useColorModeValue('brand_red.50', 'brand_red.400')}
          />
          {image && <Image src={image} alt={name} rounded={'md'} />}
        </Flex>
      </Stack>
    </Container>
  )
}

export const Blob = (props: IconProps) => {
  return (
    <Icon
      width={'100%'}
      viewBox="0 0 578 440"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M239.184 439.443c-55.13-5.419-110.241-21.365-151.074-58.767C42.307 338.722-7.478 282.729.938 221.217c8.433-61.644 78.896-91.048 126.871-130.712 34.337-28.388 70.198-51.348 112.004-66.78C282.34 8.024 325.382-3.369 370.518.904c54.019 5.115 112.774 10.886 150.881 49.482 39.916 40.427 49.421 100.753 53.385 157.402 4.13 59.015 11.255 128.44-30.444 170.44-41.383 41.683-111.6 19.106-169.213 30.663-46.68 9.364-88.56 35.21-135.943 30.551z"
        fill="currentColor"
      />
    </Icon>
  )
}
