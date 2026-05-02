'use client';

import { Search as SearchIcon, X as XIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import type { ViewState } from 'react-map-gl/mapbox';
import MapGL, { Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import type { IOrganization } from '@/fetch/organizations';
import { useOrganizations } from '@/hooks/useOrganizations';
import {
  CompaniesSelect,
  CompanyMarker,
  CompanyView,
  SelectView,
  TechnologiesSelect,
} from './components';

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

type View = 'technologies' | 'companies';

export interface Technology {
  name: string;
  amount_of_organizations: number;
}

const DefaultState: Partial<ViewState> = {
  latitude: 50.44186286707077,
  longitude: -104.67922921715218,
  zoom: 11,
};

// create a slug from the name (replace spaces and other special characters with dashes)
export const createTechnologySlug = (technology: string) =>
  technology.replace(/\W/g, '-').toLowerCase();
export const createCompanySlug = (company: IOrganization) => company.url.split('.').at(-2);

export const TechMapScene = () => {
  const searchParams = useSearchParams();
  const { isDark } = useTheme();
  const { data: organizations } = useOrganizations();
  const [isShowingMenu, setIsShowingMenu] = useState(true);

  const rawView = searchParams.get('view');
  const view: View | undefined =
    rawView === 'technologies' || rawView === 'companies' ? rawView : undefined;
  const filteredTechnologies: string[] = searchParams.getAll('technologies');
  const selectedCompanySlug: string | undefined = searchParams.get('company') ?? undefined;

  const companies: IOrganization[] = organizations
    .filter((o) => !!o.geometry)
    .sort((a, b) => (a.name > b.name ? 1 : -1));

  const selectedCompany: IOrganization | undefined = organizations.find(
    (o) => createCompanySlug(o) === selectedCompanySlug,
  );

  const technologies: Technology[] = organizations.reduce<Technology[]>((list, organization) => {
    for (const technology of organization.technologies) {
      const existing = list.find((t) => t.name === technology);
      if (existing) {
        existing.amount_of_organizations += 1;
      } else {
        list.push({ name: technology, amount_of_organizations: 1 });
      }
    }
    return list;
  }, []);

  const filteredCompanies: IOrganization[] = companies.filter(
    (c) =>
      filteredTechnologies.length === 0 ||
      c.technologies.some((t: string) => filteredTechnologies.includes(t)),
  );

  if (!MAPBOX_ACCESS_TOKEN) return null;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <MapGL
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        initialViewState={DefaultState}
        style={{ width: '100%', height: '90vh', borderRadius: '1rem' }}
        maxBounds={[
          [-104.7694406, 50.3431865], // Southwest coordinates
          [-104.457503, 50.5717905], // Northeast coordinates
        ]}
        mapStyle={
          isDark
            ? 'mapbox://styles/hackregina/cllwzo7vm01bq01qib26b5i0r'
            : 'mapbox://styles/mapbox/light-v11'
        }
      >
        <Button
          variant="outline"
          size="icon"
          className={`absolute top-0 ${isShowingMenu ? 'right-0' : ''} m-4 z-10 block ${isShowingMenu ? 'md:hidden' : ''}`}
          onClick={() => setIsShowingMenu((prev) => !prev)}
        >
          {isShowingMenu ? <XIcon className="h-4 w-4" /> : <SearchIcon className="h-4 w-4" />}
        </Button>
        {!!selectedCompany && isShowingMenu && (
          <CompanyView searchParams={searchParams} company={selectedCompany} />
        )}
        {!selectedCompany && isShowingMenu && (
          <>
            {!view && <SelectView />}
            {view === 'technologies' && (
              <TechnologiesSelect companies={companies} technologies={technologies} />
            )}
            {view === 'companies' && (
              <CompaniesSelect
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
            company.geometry?.coordinates?.[0] &&
            company.geometry?.coordinates?.[1] && (
              <Marker
                key={`marker.${createCompanySlug(company)}`}
                latitude={company.geometry.coordinates[0]}
                longitude={company.geometry.coordinates[1]}
              >
                <CompanyMarker company={company} />
              </Marker>
            ),
        )}
      </MapGL>
    </div>
  );
};
