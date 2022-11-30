import {
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
} from '@chakra-ui/react'
import React from 'react'
import { IOrganization } from '../../interfaces/organization'

interface IProps {
  title: string
  organizations?: IOrganization[]
}

export const Organizations = ({
  title,
  organizations = [],
  children,
}: React.PropsWithChildren<IProps>) => {
  const { colorMode } = useColorMode()
  const textBackground = useColorModeValue('brand_red.300', 'brand_red.700')
  if (organizations.length === 0) return null
  return (
    <Container maxW={'7xl'} id="partners" mb={60}>
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
      <SimpleGrid columns={{ base: 1, md: 3 }} spacingX={40} spacingY={20} mt="20">
        {organizations.map(({ name, url, image }) => (
          <GridItem key={name}>
            <Flex align="center" justify="center" verticalAlign="center" height="100%">
              <Link href={url} display={'block'}>
                {image && (
                  <Image
                    src={(colorMode === 'light' ? image.dark : image.light) || image.light}
                    alt={name}
                    style={{
                      maxHeight: 200,
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
          </GridItem>
        ))}
      </SimpleGrid>
    </Container>
  )
}
