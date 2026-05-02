import type { SponsorTier } from '@/fetch/organizations';

export const TIER_ORDER: SponsorTier[] = ['champion', 'promotor', 'supporter', 'fan'];

export const TIER_LABEL: Record<SponsorTier, string> = {
  champion: '🙌 Champion',
  promotor: '📣 Promotor',
  supporter: '🎗 Supporter',
  fan: '🤘 Fan',
};

export const TIER_LOGO_HEIGHT: Record<SponsorTier, string> = {
  champion: 'h-20',
  promotor: 'h-16',
  supporter: 'h-14',
  fan: 'h-12',
};

export const TIER_AVATAR_SIZE: Record<SponsorTier, number> = {
  champion: 96,
  promotor: 80,
  supporter: 72,
  fan: 64,
};

export const PAST_LOGO_HEIGHT = 'h-12';
export const PAST_AVATAR_SIZE = 48;
export const PARTNER_LOGO_HEIGHT = 'h-16';
