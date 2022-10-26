import { Image, ImageProps, useColorMode } from '@chakra-ui/react'
import React from 'react'

export const Logo = (props: ImageProps) => {
  const { colorMode } = useColorMode()
  return (
    <Image
      {...props}
      src={colorMode === 'light' ? '/images/hackregina-logo.png' : '/images/hackregina-white.png'}
      alt="HackRegina"
      height={50}
      width={243}
    />
  )
}
