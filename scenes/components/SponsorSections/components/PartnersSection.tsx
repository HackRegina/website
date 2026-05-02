import { SkeletonLoader } from '@/components/layout/SkeletonLoader';
import type { IOrganization } from '@/fetch/organizations';
import { PARTNER_LOGO_HEIGHT } from '../constants';
import { OrgLogo } from './OrgLogo';

export const PartnersSection = ({
  partners,
  isLoadingOrgs,
  isDark,
}: {
  partners: IOrganization[];
  isLoadingOrgs: boolean;
  isDark: boolean;
}) => (
  <section className="py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Partners</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          We wouldn't be able to offer any of the events or services without support from our
          partners. We are truly lucky to work with the following organizations in order to help
          maintain a strong community.
        </p>
      </div>
      {isLoadingOrgs ? (
        <SkeletonLoader />
      ) : (
        <div className="flex flex-wrap gap-8 justify-center items-center">
          {partners.map((partner) => (
            <OrgLogo
              key={partner.name}
              name={partner.name}
              url={partner.url}
              image={partner.image}
              sizeClass={PARTNER_LOGO_HEIGHT}
              isDark={isDark}
            />
          ))}
        </div>
      )}
    </div>
  </section>
);
