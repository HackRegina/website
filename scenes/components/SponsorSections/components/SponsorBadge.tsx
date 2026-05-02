import Image from 'next/image';
import type { ISponsor } from '@/fetch/organizations';
import { OrgLogo } from './OrgLogo';

export const SponsorBadge = ({
  sponsor,
  logoSizeClass,
  avatarSize,
  isDark,
  isPast = false,
}: {
  sponsor: ISponsor;
  logoSizeClass: string;
  avatarSize: number;
  isDark: boolean;
  isPast?: boolean;
}) => {
  if (sponsor.image) {
    return (
      <OrgLogo
        name={sponsor.name}
        url={sponsor.url}
        image={sponsor.image}
        sizeClass={logoSizeClass}
        isDark={isDark}
        isPast={isPast}
      />
    );
  }
  if (sponsor.avatarUrl) {
    return (
      <SponsorAvatar
        name={sponsor.name}
        url={sponsor.url}
        avatarUrl={sponsor.avatarUrl}
        size={avatarSize}
        isPast={isPast}
      />
    );
  }
  return <NamePill name={sponsor.name} url={sponsor.url} isPast={isPast} />;
};

const SponsorAvatar = ({
  name,
  url,
  avatarUrl,
  size,
  isPast = false,
}: {
  name: string;
  url: string;
  avatarUrl: string;
  size: number;
  isPast?: boolean;
}) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    title={name}
    className={`flex flex-col items-center gap-2 transition-opacity ${
      isPast ? 'opacity-60 hover:opacity-100' : 'hover:opacity-80'
    }`}
    style={{ width: size + 64 }}
  >
    <Image
      src={avatarUrl}
      alt={name}
      width={size}
      height={size}
      className="rounded-full object-cover"
      style={{ width: size, height: size }}
    />
    <span className="text-sm text-center leading-tight w-full text-gray-900 dark:text-gray-100">
      {name}
    </span>
  </a>
);

const NamePill = ({
  name,
  url,
  isPast = false,
}: {
  name: string;
  url: string;
  isPast?: boolean;
}) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className={`border border-gray-300 dark:border-gray-700 rounded-lg px-6 py-4 text-center transition-opacity ${
      isPast ? 'opacity-60 hover:opacity-100' : 'hover:opacity-80'
    }`}
  >
    <span className="font-semibold">{name}</span>
  </a>
);
