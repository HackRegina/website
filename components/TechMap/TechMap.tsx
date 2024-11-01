import { ArrowBackIcon, SearchIcon, SmallCloseIcon } from '@chakra-ui/icons'
import {
  Badge,
  Box,
  Button,
  ColorMode,
  Heading,
  Image,
  Progress,
  Text,
  useColorMode,
} from '@chakra-ui/react'
import 'mapbox-gl/dist/mapbox-gl.css'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import { useRef, useState } from 'react'
import Map, { Marker, ViewState } from 'react-map-gl'
import { useWebsiteDetails } from '../../hooks/useWebsiteDetails'
import { IOrganization } from '../../interfaces/organization'

const { MAPBOX_ACCESS_TOKEN } = process.env

type View = 'technologies' | 'companies'
interface Technology {
  name: string
  amount_of_organizations: number
}

const DefaultState: Partial<ViewState> = {
  latitude: 50.44186286707077,
  longitude: -104.67922921715218,
  zoom: 11,
}

// create a slug from the name (replace spaces and other special characters with dashes)
const createTechnologySlug = (technology: string) => technology.replace(/\W/g, '-').toLowerCase()
const createCompanySlug = (company: IOrganization) => company.url.split('.').at(-2)

export const TechMap = ({ organizations }: { organizations: IOrganization[] }) => {
  const { query } = useRouter()
  const { colorMode } = useColorMode()
  const [isShowingMenu, setIsShowingMenu] = useState(true)
  const rawView = Array.isArray(query.view) ? query.view[0] : query.view
  const view: View | undefined =
    rawView === 'technologies' || rawView === 'companies' ? rawView : undefined
  const filteredTechnologies: string[] = Array.isArray(query.technologies)
    ? query.technologies
    : typeof query.technologies === 'string'
    ? [query.technologies]
    : []
  const selectedCompanySlug: string | undefined = Array.isArray(query.company)
    ? query.company[0]
    : query.company
  const companies: IOrganization[] = organizations
    .filter((o) => !!o.geometry)
    .sort((a, b) => (a.name > b.name ? 1 : -1))
  const selectedCompany: IOrganization | undefined = organizations.find(
    (o) => createCompanySlug(o) === selectedCompanySlug,
  )
  const technologies: Technology[] = organizations.reduce<Technology[]>((list, organization) => {
    for (const technology of organization.technologies) {
      const existing = list.find((t) => t.name === technology)
      if (existing) {
        existing.amount_of_organizations += 1
      } else {
        list.push({ name: technology, amount_of_organizations: 1 })
      }
    }
    return list
  }, [])
  const filteredCompanies: IOrganization[] = companies.filter(
    (c) =>
      filteredTechnologies.length === 0 ||
      c.technologies.some((t) => filteredTechnologies.includes(t)),
  )

  if (!MAPBOX_ACCESS_TOKEN) return null

  return (
    <Map
      mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
      initialViewState={DefaultState}
      style={{ width: '100%', height: '90vh', borderRadius: '1rem' }}
      maxBounds={[
        [-104.7694406, 50.3431865], // Southwest coordinates
        [-104.457503, 50.5717905], // Northeast coordinates
      ]}
      mapStyle={
        colorMode === 'dark'
          ? 'mapbox://styles/hackregina/cllwzo7vm01bq01qib26b5i0r'
          : 'mapbox://styles/mapbox/light-v11'
      }
    >
      <Button
        position="absolute"
        top={0}
        right={isShowingMenu ? 0 : undefined}
        margin={'1rem'}
        zIndex={1}
        onClick={() => setIsShowingMenu((prev) => !prev)}
        display={{
          base: 'block',
          md:isShowingMenu ? 'none' : 'block',
        }}
      >
        {isShowingMenu ? <SmallCloseIcon /> : <SearchIcon />}
      </Button>
      {!!selectedCompany && isShowingMenu && (
        <CompanyView colorMode={colorMode} query={query} company={selectedCompany} />
      )}
      {!selectedCompany && isShowingMenu && (
        <>
          {!view && <SelectView colorMode={colorMode} />}
          {view === 'technologies' && (
            <TechnologiesSelect
              colorMode={colorMode}
              companies={companies}
              technologies={technologies}
            />
          )}
          {view === 'companies' && (
            <CompaniesSelect
              colorMode={colorMode}
              companies={companies}
              technologies={technologies.filter(
                (t) => filteredTechnologies.length === 0 || filteredTechnologies.includes(t.name),
              )}
            />
          )}
        </>
      )}
      {filteredCompanies.map(
        (company) =>
          company.geometry?.coordinates[0] &&
          company.geometry?.coordinates[1] && (
            <Marker
              key={`marker.${createCompanySlug(company)}`}
              latitude={company.geometry?.coordinates[0]}
              longitude={company.geometry?.coordinates[1]}
            >
              <CompanyMarker company={company} />
            </Marker>
          ),
      )}
    </Map>
  )
}

const CompanyMarker = ({ company }: { company: IOrganization }) => {
  const ref = useRef<HTMLImageElement>(null)
  const { data, isLoading } = useWebsiteDetails({ url: company.url })
  const isDefaultIcon = ref.current?.src.includes('/images/location-dot-solid.svg')
  return (
    <Link
      key={createCompanySlug(company)}
      color={'brand_red.600'}
      href={{
        pathname: '/techmap',
        query: { view: 'companies', company: createCompanySlug(company) },
      }}
      shallow={true}
    >
      <Image
        ref={ref}
        src={data?.icon || '/images/location-dot-solid.svg'}
        width="1rem"
        height="auto"
        alt={company.name}
        boxShadow={!isDefaultIcon && !isLoading ? '0 0 0 1px white' : undefined}
        borderRadius={!isDefaultIcon && !isLoading ? '50%' : undefined}
        background={!isDefaultIcon && !isLoading ? 'white' : undefined}
        onError={(e) => {
          e.currentTarget.onerror = null
          e.currentTarget.src = '/images/location-dot-solid.svg'
        }}
      />
    </Link>
  )
}

const SelectView = ({ colorMode }: { colorMode: ColorMode }) => (
  <Box
    position="relative"
    height="100%"
    bg={colorMode === 'dark' ? 'brand_blue.900' : 'gray.100'}
    top={0}
    bottom={0}
    left={0}
    width={{
      base: '100%',
      md: '33%',
    }}
    borderRadius={'1rem'}
    paddingX={'1rem'}
    paddingY={'1.5rem'}
  >
    <Heading as="h4" size="md" marginBottom={'1rem'}>
      <SearchIcon marginX={'0.5rem'} />
      Tech map
    </Heading>
    <Button
      as={Link}
      bg={'brand_red.600'}
      color={'white'}
      href={{
        pathname: '/techmap',
        query: { view: 'technologies' },
      }}
      size={'lg'}
      fontSize={'md'}
      rounded={'md'}
      width={'100%'}
      marginBottom={'0.5rem'}
      shallow={true}
      _hover={{
        bg: 'brand_red.900',
      }}
    >
      Search by technology
    </Button>
    <Button
      as={Link}
      bg={'brand_red.600'}
      color={'white'}
      href={{
        pathname: '/techmap',
        query: { view: 'companies' },
      }}
      size={'lg'}
      fontSize={'md'}
      rounded={'md'}
      width={'100%'}
      marginBottom={'0.5rem'}
      shallow={true}
      _hover={{
        bg: 'brand_red.900',
      }}
    >
      Search by company
    </Button>
  </Box>
)

interface SelectViewProps {
  colorMode: ColorMode
  companies: IOrganization[]
  technologies?: Technology[]
  query?: ParsedUrlQuery
}

const TechnologiesSelect = ({ colorMode, companies, technologies, query }: SelectViewProps) => {
  const [hoveringOn, setHoveringOn] = useState<string>()
  return (
    <Box
      position="relative"
      height="100%"
      bg={colorMode === 'dark' ? 'brand_blue.900' : 'gray.100'}
      top={0}
      bottom={0}
      left={0}
      width={{
        base: '100%',
        md: '33%',
      }}
      borderRadius={'1rem'}
      paddingX={'1rem'}
      paddingY={'1.5rem'}
    >
      <Heading as="h4" size="md" marginBottom={'1rem'}>
        <Link
          href={{
            pathname: '/techmap',
            query: {},
          }}
        >
          <ArrowBackIcon marginX={'0.5rem'} />
        </Link>
        Technologies
      </Heading>
      <div style={{ height: 'calc(100% - 3rem)', overflowY: 'scroll' }}>
        {technologies
          ?.map((t) => ({
            ...t,
            percentage: Math.round((t.amount_of_organizations / companies?.length) * 100),
          }))
          .sort((a, b) => (a.percentage > b.percentage ? -1 : 1))
          .map((technology) => (
            <Button
              key={createTechnologySlug(technology.name)}
              as={Link}
              bg={'brand_red.600'}
              color={'white'}
              href={{
                pathname: '/techmap',
                query: { view: 'companies', technologies: technology.name },
              }}
              size={'lg'}
              fontSize={'md'}
              rounded={'md'}
              width={'100%'}
              marginBottom={'0.5rem'}
              shallow={true}
              _hover={{
                bg: 'brand_red.900',
              }}
              onMouseOver={() => setHoveringOn(createTechnologySlug(technology.name))}
              onMouseLeave={() =>
                setHoveringOn((prev) =>
                  prev === createTechnologySlug(technology.name) ? undefined : prev,
                )
              }
            >
              {technology.name}
              <Progress
                value={technology.percentage}
                position="absolute"
                size={hoveringOn === createTechnologySlug(technology.name) ? 'md' : 'xs'}
                bottom={0}
                left={0}
                right={0}
                colorScheme={'brand_red'}
                borderBottomRadius={'2.5rem'}
              >
                {hoveringOn === createTechnologySlug(technology.name) && (
                  <Box position="absolute" top={0} width="100%" textAlign="center" fontSize="xs">
                    {technology.percentage}%
                  </Box>
                )}
              </Progress>
            </Button>
          ))}
      </div>
    </Box>
  )
}

const CompaniesSelect = ({ colorMode, companies, technologies }: SelectViewProps) => (
  <Box
    position="relative"
    height="100%"
    bg={colorMode === 'dark' ? 'brand_blue.900' : 'gray.100'}
    top={0}
    bottom={0}
    left={0}
    width={{
      base: '100%',
      md: '33%',
    }}
    borderRadius={'1rem'}
    paddingX={'1rem'}
    paddingY={'1.5rem'}
  >
    <Heading as="h4" size="md" marginBottom={'1rem'}>
      <Link
        href={{
          pathname: '/techmap',
          query: { view: 'technologies' },
        }}
      >
        <ArrowBackIcon marginX={'0.5rem'} />
      </Link>
      Companies
    </Heading>
    <div style={{ height: 'calc(100% - 3rem)', overflowY: 'scroll' }}>
      {companies.map((company) => (
        <Button
          as={Link}
          key={createCompanySlug(company)}
          bg={'brand_red.600'}
          color={'white'}
          href={{
            pathname: '/techmap',
            query: { view: 'companies', company: createCompanySlug(company) },
          }}
          size={'lg'}
          fontSize={'md'}
          rounded={'md'}
          width={'100%'}
          marginBottom={'0.5rem'}
          shallow={true}
          _hover={{
            bg: 'brand_red.900',
          }}
        >
          {company.name}
        </Button>
      ))}
    </div>
  </Box>
)

const CompanyView = ({
  colorMode,
  query,
  company,
}: Omit<SelectViewProps, 'companies'> & {
  company: IOrganization
}) => {
  const { data, isLoading } = useWebsiteDetails({ url: company.url })
  return (
    <Box
      position="relative"
      height="100%"
      bg={colorMode === 'dark' ? 'brand_blue.900' : 'gray.100'}
      top={0}
      bottom={0}
      left={0}
      width={{
        base: '100%',
        md: '33%',
      }}
      borderRadius={'1rem'}
      paddingX={'1rem'}
      paddingY={'1.5rem'}
    >
      <Heading as="h4" size="md" marginBottom={'1rem'}>
        <Link
          href={{
            pathname: '/techmap',
            query: { ...query, company: undefined },
          }}
        >
          <ArrowBackIcon marginX={'0.5rem'} />
        </Link>
        {company.name}
      </Heading>
      {data?.image && (
        <Image
          src={data?.image}
          borderRadius={'1rem'}
          width={'100%'}
          marginBottom={'1rem'}
          alt={data.title}
        />
      )}
      {data?.title && (
        <Heading as="h5" size="sm">
          {data?.title}
        </Heading>
      )}
      {data?.description && (
        <Text as="p" marginBottom={'1rem'}>
          {data?.description}
        </Text>
      )}
      {company.technologies.length > 0 && (
        <Box marginBottom={'1rem'}>
          {company.technologies.map((technology) => (
            <Badge
              key={`brand.${createTechnologySlug(technology)}`}
              colorScheme="brand_red"
              margin={'0.25rem'}
            >
              {technology}
            </Badge>
          ))}
        </Box>
      )}
      <Button
        as={'a'}
        bg={'brand_red.600'}
        color={'white'}
        href={company.url}
        size={'lg'}
        fontSize={'md'}
        rounded={'md'}
        width={'100%'}
        marginBottom={'0.5rem'}
        _hover={{
          bg: 'brand_red.900',
        }}
      >
        Visit company page
      </Button>
    </Box>
  )
}
