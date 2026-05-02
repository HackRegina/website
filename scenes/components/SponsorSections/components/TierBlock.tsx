import type { ISponsor, SponsorTier } from '@/fetch/organizations';
import { TIER_AVATAR_SIZE, TIER_LABEL, TIER_LOGO_HEIGHT } from '../constants';
import { SponsorBadge } from './SponsorBadge';

export const TierBlock = ({
  tier,
  sponsors,
  isDark,
}: {
  tier: SponsorTier;
  sponsors: ISponsor[];
  isDark: boolean;
}) => {
  const orgs = sponsors.filter((s) => s.is_organization);
  const individuals = sponsors.filter((s) => !s.is_organization);
  if (!orgs.length && !individuals.length) return null;
  return (
    <div>
      <h3 className="text-2xl font-semibold mb-6 text-center">{TIER_LABEL[tier]}</h3>
      {orgs.length > 0 && (
        <div className="flex flex-wrap gap-8 justify-center items-center">
          {orgs.map((s) => (
            <SponsorBadge
              key={s.name}
              sponsor={s}
              logoSizeClass={TIER_LOGO_HEIGHT[tier]}
              avatarSize={TIER_AVATAR_SIZE[tier]}
              isDark={isDark}
            />
          ))}
        </div>
      )}
      {individuals.length > 0 && (
        <div
          className={`flex flex-wrap gap-6 justify-center items-center ${
            orgs.length > 0 ? 'mt-8' : ''
          }`}
        >
          {individuals.map((s) => (
            <SponsorBadge
              key={s.name}
              sponsor={s}
              logoSizeClass={TIER_LOGO_HEIGHT[tier]}
              avatarSize={TIER_AVATAR_SIZE[tier]}
              isDark={isDark}
            />
          ))}
        </div>
      )}
    </div>
  );
};
