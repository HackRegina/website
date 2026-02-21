import { MoveLeft as ArrowBackIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { IOrganization } from '@/fetch/organizations';
import type { Technology } from '../TechMapScene';
import { createCompanySlug } from '../TechMapScene';

interface CompaniesSelectProps {
  companies: IOrganization[];
  technologies?: Technology[];
}

export function CompaniesSelect({ companies }: CompaniesSelectProps) {
  return (
    <div className="absolute top-0 bottom-0 left-0 h-full w-full md:w-1/3 bg-gray-100 dark:bg-secondary-900 rounded-2xl px-4 py-6">
      <h4 className="text-xl font-semibold mb-4">
        <Link
          href={{
            pathname: '/techmap',
            query: { view: 'technologies' },
          }}
        >
          <ArrowBackIcon className="inline mr-2 ml-2 h-5 w-5" />
        </Link>
        Companies
      </h4>
      <div style={{ height: 'calc(100% - 3rem)', overflowY: 'scroll' }}>
        {companies.map((company) => (
          <Button
            key={createCompanySlug(company)}
            asChild
            className="w-full mb-2 bg-primary-700 hover:bg-primary-900 text-white"
          >
            <Link
              href={{
                pathname: '/techmap',
                query: { view: 'companies', company: createCompanySlug(company) },
              }}
              shallow={true}
            >
              {company.name}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
