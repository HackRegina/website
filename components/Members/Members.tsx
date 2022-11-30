import { Box, Container, Flex, Heading, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import { hierarchy, Pack } from '@visx/hierarchy'
import { ParentSize } from '@visx/responsive'
import React from 'react'
import { ICommunityMember } from '../../interfaces/community-member'

const hackerScore = (d: ICommunityMember): number => {
  let multiplier = 1
  if (!d) return 0
  if (d.is_primary_owner) multiplier += 8
  if (d.is_owner) multiplier += 2
  if (d.is_admin) multiplier += 0.5
  if (d.days_active) multiplier *= d.days_active / 20
  return multiplier * (d.messages_posted + d.reactions_added)
}

interface IProps {
  members: ICommunityMember[]
}

export const Members = ({ members }: IProps) => {
  const background = useColorModeValue('brand_red.300', 'brand_red.700')
  const pack: any = React.useMemo(
    () => ({
      children: members,
      name: 'root',
      radius: 0,
      distance: 0,
    }),
    [members],
  )

  const root = React.useMemo(
    () =>
      hierarchy<ICommunityMember>(pack)
        .sum((d) => 1 + hackerScore(d))
        .sort((a, b) => hackerScore(b.data) - hackerScore(a.data)),
    [pack],
  )
  console.log(background)
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
              bg: background,
              zIndex: -1,
            }}
          >
            Community
          </Text>
        </Heading>
      </Stack>
      <ParentSize>
        {({ width = 800 }) => {
          return width < 10 ? null : (
            <div
              style={{
                width,
                height: width,
                position: 'relative',
              }}
            >
              <style
                dangerouslySetInnerHTML={{
                  __html: `

              .member-link {
                transition: all .2s ease;
                transform: translate(-50%, -50%);
              }

              .member-link:hover {
                z-index: 10;
                transform: translate(-50%, -50%) scale(1.1);
              }

              .member-link .member-tooltip {
                opacity: 0;
              }

              .member-link:hover .member-tooltip {
                opacity: 1;
              }
            `,
                }}
              />
              <Pack root={root} size={[width, width]} padding={width * 0.005}>
                {(packData) => {
                  const circles = packData.descendants().slice(1) // skip first layer
                  return (
                    <div>
                      {[...circles].reverse().map((circle, i) => {
                        return (
                          <Box
                            key={`circle-${circle.data.user_id}`}
                            className={`member-link`}
                            bg={background}
                            style={{
                              left: circle.x,
                              top: circle.y,
                              width: circle.r * 2,
                              height: circle.r * 2,
                              position: 'absolute',
                              zIndex: '0',
                              borderRadius: '9999px',
                              boxShadow:
                                '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                            }}
                          >
                            <div
                              key={`circle-${circle.data.user_id}`}
                              style={{
                                backgroundImage:
                                  circle.data.image_original &&
                                  `url(${circle.data.image_original})`,
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: 'contain',
                                transform: 'translate(-50%)',
                                borderRadius: '9999px',
                                width: '95%',
                                height: '95%',
                              }}
                            />
                            <Flex
                              align="center"
                              justify="center"
                              verticalAlign="center"
                              height="100%"
                              className="member-tooltip"
                              style={{
                                display: 'flex',
                                position: 'absolute',
                                padding: '0.5rem',
                                backgroundColor: '#1F2937',
                                color: '#ffffff',
                                fontSize: '0.875rem',
                                lineHeight: '1.25rem',
                                flexDirection: 'column',
                                alignItems: 'center',
                                borderRadius: '0.5rem',
                                pointerEvents: 'none',
                                boxShadow:
                                  '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                                height: 'auto',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%)',
                              }}
                            >
                              <p
                                style={{
                                  fontWeight: '700',
                                  whiteSpace: 'nowrap',
                                  color: '#ffffff',
                                }}
                              >
                                {circle.data.display_name || circle.data.username}
                              </p>
                            </Flex>
                          </Box>
                        )
                      })}
                    </div>
                  )
                }}
              </Pack>
            </div>
          )
        }}
      </ParentSize>
    </Container>
  )
}
