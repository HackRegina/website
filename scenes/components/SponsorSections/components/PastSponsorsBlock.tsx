import type { ISponsor } from '@/fetch/organizations';
import { PAST_AVATAR_SIZE, PAST_LOGO_HEIGHT } from '../constants';
import { SponsorBadge } from './SponsorBadge';

export const PastSponsorsBlock = ({
  sponsors,
  isDark,
}: {
  sponsors: ISponsor[];
  isDark: boolean;
}) => {
  const orgs = sponsors.filter((s) => s.is_organization);
  const individuals = sponsors.filter((s) => !s.is_organization);
  return (
    <div>
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-1">Past Sponsors</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Thank you for your past support.
        </p>
      </div>
      {orgs.length > 0 && (
        <div className="flex flex-wrap gap-6 justify-center items-center">
          {orgs.map((s) => (
            <SponsorBadge
              key={s.name}
              sponsor={s}
              logoSizeClass={PAST_LOGO_HEIGHT}
              avatarSize={PAST_AVATAR_SIZE}
              isDark={isDark}
              isPast
            />
          ))}
        </div>
      )}
      {individuals.length > 0 && (
        <div
          className={`flex flex-wrap gap-4 justify-center items-center ${
            orgs.length > 0 ? 'mt-6' : ''
          }`}
        >
          {individuals.map((s) => (
            <SponsorBadge
              key={s.name}
              sponsor={s}
              logoSizeClass={PAST_LOGO_HEIGHT}
              avatarSize={PAST_AVATAR_SIZE}
              isDark={isDark}
              isPast
            />
          ))}
        </div>
      )}
    </div>
  );
};
