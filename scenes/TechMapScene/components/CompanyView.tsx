import type { ParsedUrlQuery } from 'node:querystring';
import { MoveLeft as ArrowBackIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { IOrganization } from '@/fetch/organizations';
import { useWebsiteDetails } from '@/hooks/useWebsiteDetails';
import { createTechnologySlug } from '../TechMapScene';

interface CompanyViewProps {
  query: ParsedUrlQuery;
  company: IOrganization;
}

export function CompanyView({ query, company }: CompanyViewProps) {
  const { data } = useWebsiteDetails({ url: company.url });

  return (
    <div className="absolute top-0 bottom-0 left-0 h-full w-full md:w-1/3 bg-gray-100 dark:bg-secondary-900 rounded-2xl px-4 py-6">
      <h4 className="text-xl font-semibold mb-4">
        <Link
          href={{
            pathname: '/techmap',
            query: { ...query, company: undefined },
          }}
        >
          <ArrowBackIcon className="inline mr-2 ml-2 h-5 w-5" />
        </Link>
        {company.name}
      </h4>
      {data?.image && (
        <Image
          src={data.image}
          alt={data.title || company.name}
          width={400}
          height={200}
          unoptimized
          className="rounded-2xl w-full mb-4"
        />
      )}
      {data?.title && <h5 className="text-sm font-semibold">{data.title}</h5>}
      {data?.description && (
        <p className="mb-4 text-gray-700 dark:text-gray-300">{data.description}</p>
      )}
      {company.technologies.length > 0 && (
        <div className="mb-4">
          {company.technologies.map((technology: string) => (
            <Badge
              key={`brand.${createTechnologySlug(technology)}`}
              variant="primary"
              className="m-1"
            >
              {technology}
            </Badge>
          ))}
        </div>
      )}
      <Button asChild className="w-full mb-2 bg-primary-700 hover:bg-primary-900 text-white">
        <a href={company.url} target="_blank" rel="noopener noreferrer">
          Visit company page
        </a>
      </Button>
    </div>
  );
}
