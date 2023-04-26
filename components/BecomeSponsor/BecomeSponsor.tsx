import {
  useColorModeValue,
  Container,
  SimpleGrid,
  Heading,
  Flex,
  Button,
  Box,
  Text,
  Link,
} from '@chakra-ui/react'
import React from 'react'

interface IProps {}

export const BecomeSponsor = ({}: IProps) => {
  return (
    <Container maxW={'7xl'} py={{ base: 14, sm: 20, md: 32 }}>
      <Box
        bg={useColorModeValue('brand_red.300', 'brand_red.700')}
        rounded={'xl'}
        color={useColorModeValue('white', 'gray.100')}
        px={{ base: 4, md: 10 }}
        py={10}
      >
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          <Box>
            <Heading as={'h3'} mb={2}>
              Look how you can help
            </Heading>
            <Text fontSize={'lg'}>and start creating an impact in the community today!</Text>
          </Box>
          <Flex w={'full'} align={'center'} justify={{ base: 'center', md: 'end' }}>
            <Button
              as={'a'}
              bg={'brand_red.600'}
              color={'white'}
              href="https://github.com/sponsors/HackRegina"
              px={8}
              size={'lg'}
              fontSize={'md'}
              rounded={'md'}
              _hover={{
                bg: 'brand_red.900',
              }}
            >
              Become a Sponsor
            </Button>
          </Flex>
        </SimpleGrid>
      </Box>
    </Container>
  )
}

export default BecomeSponsor
