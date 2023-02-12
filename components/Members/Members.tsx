import { Box, Container, Flex, Heading, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import { hierarchy, Pack } from '@visx/hierarchy'
import { ParentSize } from '@visx/responsive'
import React from 'react'
import { ICommunityMember } from '../../interfaces/community-member'

const hackerScore = (d: ICommunityMember): number => {
  let multiplier = 1
  if (!d) return 0
  if (d.is_primary_owner) multiplier += 8
  if (d.is_owner) multiplier += 4
  if (d.is_admin) multiplier += 2
  return multiplier * 5
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
                z-index: 10 !important;
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
                            <picture >
                              <source media="(max-width: 24px)" srcSet={circle.data?.image_24} />
                              <source media="(min-width: 25px) and (max-width: 32px)" srcSet={circle.data?.image_32} />
                              <source media="(min-width: 33px) and (max-width: 48px)" srcSet={circle.data?.image_48} />
                              <source media="(min-width: 49px) and (max-width: 72px)" srcSet={circle.data?.image_72} />
                              <source media="(min-width: 73px) and (max-width: 192px)" srcSet={circle.data?.image_192} />
                              <source media="(min-width: 193px) and (max-width: 512px)" srcSet={circle.data?.image_512} />
                              <source media="(min-width: 513px) and (max-width: 1024px)" srcSet={circle.data?.image_1024} />
                              <img
                                src={circle.data?.image_original || circle.data?.image_1024 || circle.data?.image_512 || circle.data?.image_192 || circle.data?.image_72 || circle.data?.image_48 || circle.data?.image_32 || circle.data?.image_24}
                                alt={circle.data?.display_name || 'Member'}
                                style={{
                                  position: 'absolute',
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
                            </picture>
                            <div
                              
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
