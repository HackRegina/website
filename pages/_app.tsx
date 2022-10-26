import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles/globals.css'

const colors = {
  brand_red: {
    100: '#eec4c8',
    200: '#e29ca3',
    300: '#d6757e',
    400: '#cb4e5a',
    500: '#b13440',
    600: '#8a2932',
    700: '#77232b', // primary
    800: '#631d24',
    900: '#3b1115',
  },
  brand_blue: {
    100: '#c3d5ee',
    200: '#9bb9e3',
    300: '#749ed8',
    400: '#4c82cd',
    500: '#3268b3',
    600: '#27518b',
    700: '#1a365d', // primary
    800: '#11233c',
    900: '#060c14',
  },
}

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: true,
}

const theme = extendTheme({ colors, config })

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>HackRegina</title>
        <meta
          name="description"
          content="HackRegina is the beginning of a strong and well-known tech community for Regina, SK. The non-profit organization started as a small Slack channel but has begun to grow into a community for software developers to share knowledge and get to know one another."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp
