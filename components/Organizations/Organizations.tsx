import {
  Center,
  Container,
  Flex,
  GridItem,
  Heading,
  Image,
  Link,
  SimpleGrid,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import React, { Fragment } from 'react'
import { IOrganization, SponsorTier, SponsorTierEnum } from '../../interfaces/organization'

interface IProps {
  title: string
  organizations?: IOrganization[]
}

export const Organizations = ({
  title,
  organizations = [],
  children,
}: React.PropsWithChildren<IProps>) => {
  const textBackground = useColorModeValue('brand_red.300', 'brand_red.700')
  if (organizations.length === 0) return null
  const organizationsByTiers = organizations.reduce((groupBy, org) => {
    if (!org.sponsor_tier) return groupBy
    if (!groupBy[org.sponsor_tier]) groupBy[org.sponsor_tier] = []
    groupBy[org.sponsor_tier].push(org)
    return groupBy
  }, {} as Record<SponsorTier, IOrganization[]>)
  const tiers: SponsorTier[] = organizationsByTiers
    ? (Object.keys(organizationsByTiers) as SponsorTier[])
    : []
  const hasTiers = tiers.length > 0
  const id = title.toLowerCase().replace(/ /g, '-')
  return (
    <Container maxW={'7xl'} id={id} mb={60}>
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
            {title}
          </Text>
        </Heading>
      </Stack>
      <Stack
        flex={1}
        spacing={{ base: 5, md: 10 }}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        {children}
      </Stack>
      {!hasTiers && (
        <Wrap justify="center" spacingX={40} spacingY={20} mt="20">
          {organizations
            .filter((org) => !org.is_hidden)
            .map(({ name, url, image }: IOrganization) => (
              <WrapItem key={name} w={{ base: '100%', md: '33.3%' }} justifyContent="center">
                <Center>
                  <OrganizationCard name={name} url={url} image={image} />
                </Center>
              </WrapItem>
            ))}
        </Wrap>
      )}
      {hasTiers &&
        tiers
          .sort((a, b) => SponsorTierEnum[b] - SponsorTierEnum[a])
          .map((tier) => (
            <Fragment key={tier}>
              <Heading
                fontSize={{ base: 'xl', sm: '2xl', lg: '3xl' }}
                width="auto"
                textAlign="center"
                mt="20"
                mb="10"
              >
                <TierIcon tier={tier} /> {tier.charAt(0).toUpperCase() + tier.slice(1)}s
              </Heading>
              <Wrap justify="center" spacingX={40} spacingY={10} mb="20">
                {organizationsByTiers[tier]
                  .filter((org) => !org.is_hidden)
                  .map(({ name, url, image }: IOrganization) => (
                    <WrapItem key={name} w={getColumnWidth({ tier })} justifyContent="center">
                      <Center>
                        <OrganizationCard name={name} url={url} image={image} />
                      </Center>
                    </WrapItem>
                  ))}
              </Wrap>
            </Fragment>
          ))}
    </Container>
  )
}

const TierIcon = ({ tier }: { tier: SponsorTier }) => {
  switch (tier) {
    case 'champion':
      return <>🙌</>
    case 'promotor':
      return <>📣</>
    case 'supporter':
      return <>🎗</>
    case 'fan':
      return <>🤘 </>
    default:
      return null
  }
}

const getColumnWidth = ({ tier }: { tier: SponsorTier }) => {
  switch (tier) {
    case 'champion':
      return { base: 'calc(100% - 20px)', md: 'calc(33.3% - 20px)' }
    case 'promotor':
      return { base: 'calc(50% - 20px)', md: 'calc(16.6% - 20px)' }
    case 'supporter':
    default:
      return { base: 'calc(33.3% - 20px)', md: 'calc(10% - 20px)' }
  }
}

const OrganizationCard = ({ name, url, image }: Pick<IOrganization, 'name' | 'url' | 'image'>) => {
  const { colorMode } = useColorMode()
  return (
    <Flex align="center" justify="center" verticalAlign="center" height="100%">
      <Link href={url} display={'block'}>
        {image && (
          <Image
            src={(colorMode === 'light' ? image.dark : image.light) || image.light}
            alt={name}
            style={{
              maxHeight: 200,
              width: '100%',
              filter:
                colorMode === 'dark' && !image.dark
                  ? 'brightness(0.7) invert(1) grayscale(1)'
                  : undefined,
            }}
          />
        )}
        {!image && (
          <Heading
            lineHeight={1.1}
            fontWeight={600}
            fontSize={{ base: '1xl', sm: '2xl', lg: '4xl' }}
            width="auto"
            textAlign={'center'}
          >
            {name}
          </Heading>
        )}
      </Link>
    </Flex>
  )
}
