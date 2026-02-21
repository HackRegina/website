'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { useMembers } from '@/hooks/useMembers';
import { useOrganizations } from '@/hooks/useOrganizations';
import { BenefitsSection, CommunitySection, HeroSection, SponsorSections } from './components';

export const HomeScene = () => {
  const { isDark } = useTheme();
  const { data: organizations, isLoading: isLoadingOrgs } = useOrganizations();
  const { data: members, isLoading: isLoadingMembers } = useMembers();
  return (
    <>
      <HeroSection />
      <BenefitsSection />
      <SponsorSections
        organizations={organizations}
        isLoadingOrgs={isLoadingOrgs}
        isDark={isDark}
      />
      <CommunitySection isLoadingMembers={isLoadingMembers} members={members} />
    </>
  );
};
