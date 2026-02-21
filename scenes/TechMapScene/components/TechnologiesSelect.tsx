import { MoveLeft as ArrowBackIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { IOrganization } from '@/fetch/organizations';
import type { Technology } from '../TechMapScene';
import { createTechnologySlug } from '../TechMapScene';

interface TechnologiesSelectProps {
  companies: IOrganization[];
  technologies: Technology[];
}

export function TechnologiesSelect({ companies, technologies }: TechnologiesSelectProps) {
  const [hoveringOn, setHoveringOn] = useState<string>();

  return (
    <div className="absolute top-0 bottom-0 left-0 h-full w-full md:w-1/3 bg-gray-100 dark:bg-secondary-900 rounded-2xl px-4 py-6">
      <h4 className="text-xl font-semibold mb-4">
        <Link
          href={{
            pathname: '/techmap',
            query: {},
          }}
        >
          <ArrowBackIcon className="inline mr-2 ml-2 h-5 w-5" />
        </Link>
        Technologies
      </h4>
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
              asChild
              className="relative w-full mb-2 bg-primary-700 hover:bg-primary-900 text-white overflow-hidden"
              onMouseOver={() => setHoveringOn(createTechnologySlug(technology.name))}
              onMouseLeave={() =>
                setHoveringOn((prev) =>
                  prev === createTechnologySlug(technology.name) ? undefined : prev,
                )
              }
            >
              <Link
                href={{
                  pathname: '/techmap',
                  query: { view: 'companies', technologies: technology.name },
                }}
                shallow={true}
              >
                <span className="relative z-10">{technology.name}</span>
                <Progress
                  value={technology.percentage}
                  className="absolute bottom-0 left-0 right-0 rounded-b-full"
                  size={hoveringOn === createTechnologySlug(technology.name) ? 'md' : 'xs'}
                >
                  {hoveringOn === createTechnologySlug(technology.name) && (
                    <div className="absolute top-0 w-full text-center text-xs">
                      {technology.percentage}%
                    </div>
                  )}
                </Progress>
              </Link>
            </Button>
          ))}
      </div>
    </div>
  );
}
