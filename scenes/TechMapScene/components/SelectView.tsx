import { Search as SearchIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { routes } from '@/lib/route';

export function SelectView() {
  return (
    <div className="absolute top-0 bottom-0 left-0 h-full w-full md:w-1/3 bg-gray-100 dark:bg-secondary-900 rounded-2xl px-4 py-6">
      <h4 className="text-xl font-semibold mb-4 flex items-center">
        <SearchIcon className="mr-2 ml-2 h-5 w-5" />
        Tech map
      </h4>
      <Button asChild className="w-full mb-2 bg-primary-700 hover:bg-primary-900 text-white">
        <Link href={routes.techmap.technologies()}>Search by technology</Link>
      </Button>
      <Button asChild className="w-full mb-2 bg-primary-700 hover:bg-primary-900 text-white">
        <Link href={routes.techmap.companies()}>Search by company</Link>
      </Button>
    </div>
  );
}
