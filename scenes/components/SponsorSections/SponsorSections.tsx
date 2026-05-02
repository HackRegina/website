'use client';
import { SkeletonLoader } from '@/components/layout/SkeletonLoader';
import type { IOrganization, ISponsor } from '@/fetch/organizations';
import { BecomeSponsorCTA } from './components/BecomeSponsorCTA';
import { PartnersSection } from './components/PartnersSection';
import { PastSponsorsBlock } from './components/PastSponsorsBlock';
import { TierBlock } from './components/TierBlock';
import { TIER_ORDER } from './constants';

export const SponsorSections = ({
  partners = [],
  sponsors = [],
  isLoadingOrgs,
  isDark,
}: {
  partners?: IOrganization[];
  sponsors?: ISponsor[];
  isLoadingOrgs: boolean;
  isDark: boolean;
}) => {
  const activeSponsors = sponsors.filter((s) => s.is_active);
  const pastSponsors = sponsors.filter((s) => !s.is_active);
  const hasSponsors = activeSponsors.length > 0 || pastSponsors.length > 0;

  return (
    <>
      <PartnersSection partners={partners} isLoadingOrgs={isLoadingOrgs} isDark={isDark} />

      {(isLoadingOrgs || hasSponsors) && (
        <section className="bg-gray-50 dark:bg-gray-800/50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Sponsors</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                We are thankful for the organizations that help HackRegina and provide us with the
                support to continue to provide services to our community.
              </p>
            </div>
            {isLoadingOrgs ? (
              <SkeletonLoader />
            ) : (
              <div className="space-y-12">
                {TIER_ORDER.map((tier) => (
                  <TierBlock
                    key={tier}
                    tier={tier}
                    sponsors={activeSponsors.filter((s) => s.tier === tier)}
                    isDark={isDark}
                  />
                ))}
                {pastSponsors.length > 0 && (
                  <PastSponsorsBlock sponsors={pastSponsors} isDark={isDark} />
                )}
              </div>
            )}
          </div>
        </section>
      )}

      <BecomeSponsorCTA />
    </>
  );
};
