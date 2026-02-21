import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import type { IOrganization } from '@/fetch/organizations';
import { useWebsiteDetails } from '@/hooks/useWebsiteDetails';
import { createCompanySlug } from '../TechMapScene';

interface CompanyMarkerProps {
  company: IOrganization;
}

export function CompanyMarker({ company }: CompanyMarkerProps) {
  const ref = useRef<HTMLImageElement>(null);
  const { data, isLoading } = useWebsiteDetails({ url: company.url });
  const isDefaultIcon = ref.current?.src.includes('/images/location-dot-solid.svg');

  return (
    <Link
      href={{
        pathname: '/techmap',
        query: { view: 'companies', company: createCompanySlug(company) },
      }}
      shallow={true}
    >
      <Image
        ref={ref}
        src={data?.icon || '/images/location-dot-solid.svg'}
        width={16}
        height={16}
        alt={company.name}
        unoptimized
        className={
          !isDefaultIcon && !isLoading ? 'rounded-full shadow-[0_0_0_1px_white] bg-white' : ''
        }
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = '/images/location-dot-solid.svg';
        }}
      />
    </Link>
  );
}
