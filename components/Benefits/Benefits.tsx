import { ReactElement } from 'react'
import { Box, SimpleGrid, Icon, Text, Stack, Flex } from '@chakra-ui/react'

interface FeatureProps {
  title: string
  text: string
  icon: ReactElement
}

const Benefit = ({ title, text, icon }: FeatureProps) => {
  return (
    <Stack>
      <Flex
        w={16}
        h={16}
        align={'center'}
        justify={'center'}
        color={'gray.800'}
        rounded={'full'}
        bg={'gray.100'}
        mb={1}
      >
        {icon}
      </Flex>
      <Text fontWeight={600}>{title}</Text>
      <Text color={'gray.600'}>{text}</Text>
    </Stack>
  )
}

export const Benefits = () => {
  return (
    <Box px={4} py={60}>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
        <Benefit
          icon={
            <Icon w={10} h={10} viewBox="0 0 448 512">
              <defs>
                <style>{`.fa-secondary{opacity:.4}`}</style>
              </defs>
              <path
                className="fa-primary"
                fill="currentColor"
                d="M160 32V64H288V32C288 14.33 302.3 0 320 0C337.7 0 352 14.33 352 32V64H400C426.5 64 448 85.49 448 112V192H0V112C0 85.49 21.49 64 48 64H96V32C96 14.33 110.3 0 128 0C145.7 0 160 14.33 160 32zM256.9 298.7L309.7 306.4C318.2 307.6 321.6 318.1 315.4 324.1L277.3 361.3L286.3 413.8C287.7 422.3 278.8 428.8 271.2 424.8L224 400L176.8 424.8C169.2 428.8 160.3 422.3 161.7 413.8L170.7 361.3L132.6 324.1C126.4 318.1 129.8 307.6 138.3 306.4L191.1 298.7L214.7 250.9C218.5 243.2 229.5 243.2 233.3 250.9L256.9 298.7z"
              />
              <path
                className="fa-secondary"
                fill="currentColor"
                d="M448 464C448 490.5 426.5 512 400 512H48C21.49 512 0 490.5 0 464V192H448V464zM233.3 250.9C229.5 243.2 218.5 243.2 214.7 250.9L191.1 298.7L138.3 306.4C129.8 307.6 126.4 318.1 132.6 324.1L170.7 361.3L161.7 413.8C160.3 422.3 169.2 428.8 176.8 424.8L223.1 400L271.2 424.8C278.8 428.8 287.7 422.3 286.3 413.8L277.3 361.3L315.4 324.1C321.6 318.1 318.2 307.6 309.7 306.4L256.9 298.7L233.3 250.9z"
              />
            </Icon>
          }
          title={'Events'}
          text={
            'Code together nights, hackathons and educational talks from tech leaders in Regina.'
          }
        />
        <Benefit
          icon={
            <Icon w={10} h={10} viewBox="0 0 640 512">
              <defs>
                <style>{`.fa-secondary{opacity:.4}`}</style>
              </defs>
              <path
                className="fa-primary"
                fill="currentColor"
                d="M637.9 499c2.1 2.205 2.67 5.475 1.441 8.354C638.1 510.3 635.4 512 632.3 512c-36.25 0-67.1-9.98-91.49-21.98C513.3 503.1 481.7 512 448 512c-90.01 0-165.3-56.86-186.1-133.5C368.3 357.2 448 274.6 448 176c0-5.387-.4668-10.67-.9336-15.96C447.4 160 447.7 160 448 160c106 0 192 78.8 192 176c0 40.63-15.17 77.95-40.41 107.7C615.9 475.3 637.6 498.7 637.9 499z"
              />
              <path
                className="fa-secondary"
                fill="currentColor"
                d="M208 0C93.13 0 0 78.8 0 176c0 39.57 15.62 75.96 41.67 105.4c-16.39 32.76-39.23 57.32-39.59 57.68c-2.1 2.205-2.67 5.475-1.441 8.354C1.9 350.3 4.602 352 7.66 352c38.35 0 70.76-11.12 95.74-24.04C134.2 343.1 169.8 352 208 352c114.9 0 208-78.8 208-176C416 78.8 322.9 0 208 0z"
              />
            </Icon>
          }
          title={'Connections'}
          text={
            'Talk tech, meet people, get help, learn something new. Join the discussion on Slack below!'
          }
        />
        <Benefit
          icon={
            <Icon w={10} h={10} viewBox="0 0 640 512">
              <defs>
                <style>{`.fa-secondary{opacity:.4}`}</style>
              </defs>
              <path
                className="fa-primary"
                fill="currentColor"
                d="M384 96C384 131.3 355.3 160 320 160C284.7 160 256 131.3 256 96C256 60.65 284.7 32 320 32C355.3 32 384 60.65 384 96zM384 448C384 465.7 369.7 480 352 480H288C270.3 480 256 465.7 256 448V405.2C218.2 387.2 192 348.7 192 304C192 242.1 242.1 192 304 192H336C397.9 192 448 242.1 448 304C448 348.7 421.8 387.2 384 405.2V448zM256 261.7C246 272.9 240 287.8 240 304C240 320.2 246 335.1 256 346.3V261.7zM400 304C400 287.8 393.1 272.9 384 261.7V346.3C393.1 335 400 320.2 400 304z"
              />
              <path
                className="fa-secondary"
                fill="currentColor"
                d="M64 96C64 60.65 92.65 32 128 32C163.3 32 192 60.65 192 96C192 131.3 163.3 160 128 160C92.65 160 64 131.3 64 96zM192 394.5V448C192 465.7 177.7 480 160 480H96C78.33 480 64 465.7 64 448V405.2C26.16 387.2 0 348.7 0 304C0 242.1 50.14 192 112 192H144C163.7 192 182.3 197.1 198.4 206.1C174.6 231.8 160 266.2 160 304C160 338.3 171.1 369.8 192 394.5zM64 346.3V261.7C54.04 272.9 48 287.8 48 304C48 320.2 54.04 335.1 64 346.3zM448 394.5C468 369.8 480 338.3 480 304C480 266.2 465.4 231.8 441.6 206.1C457.7 197.1 476.3 192 496 192H528C589.9 192 640 242.1 640 304C640 348.7 613.8 387.2 576 405.2V448C576 465.7 561.7 480 544 480H480C462.3 480 448 465.7 448 448V394.5zM592 304C592 287.8 585.1 272.9 576 261.7V346.3C585.1 335 592 320.2 592 304zM448 96C448 60.65 476.7 32 512 32C547.3 32 576 60.65 576 96C576 131.3 547.3 160 512 160C476.7 160 448 131.3 448 96z"
              />{' '}
            </Icon>
          }
          title={'Community'}
          text={
            'A network of Regina tech companies to share knowledge and help Regina stay ahead of the latest technologies.'
          }
        />
      </SimpleGrid>
    </Box>
  )
}
