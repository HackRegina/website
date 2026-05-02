import Image from 'next/image';
import type { IOrganization } from '@/fetch/organizations';

export const OrgLogo = ({
  name,
  url,
  image,
  sizeClass,
  isDark,
  isPast = false,
}: {
  name: string;
  url: string;
  image: IOrganization['image'];
  sizeClass: string;
  isDark: boolean;
  isPast?: boolean;
}) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className={`transition-opacity ${
      isPast ? 'opacity-60 hover:opacity-100' : 'hover:opacity-80'
    }`}
  >
    {image ? (
      <Image
        src={isDark && image.dark ? image.dark : image.light}
        alt={name}
        width={200}
        height={80}
        className={`${sizeClass} w-auto object-contain`}
      />
    ) : (
      <NamePillRaw name={name} />
    )}
  </a>
);

const NamePillRaw = ({ name }: { name: string }) => (
  <div className="border border-gray-300 dark:border-gray-700 rounded-lg px-6 py-4 text-center">
    <span className="font-semibold">{name}</span>
  </div>
);
