'use client';
import Image from 'next/image';
import { SkeletonLoader } from '@/components/layout/SkeletonLoader';
import type { IOrganization } from '@/fetch/organizations';

export const SponsorSections = ({
  organizations = [],
  isLoadingOrgs,
  isDark,
}: {
  organizations?: IOrganization[];
  isLoadingOrgs: boolean;
  isDark: boolean;
}) => {
  const partners = organizations.filter((org) => org.is_partner);
  const sponsors = organizations.filter((org) => org.is_sponsor);

  const sponsorsByTier = {
    champion: sponsors.filter((s) => s.sponsor_tier === 'champion'),
    promotor: sponsors.filter((s) => s.sponsor_tier === 'promotor'),
    supporter: sponsors.filter((s) => s.sponsor_tier === 'supporter'),
    fan: sponsors.filter((s) => s.sponsor_tier === 'fan'),
  };
  return (
    <>
      {/* Partners Section */}
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
                <a
                  key={partner.name}
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                  {partner.image ? (
                    <Image
                      src={isDark && partner.image.dark ? partner.image.dark : partner.image.light}
                      alt={partner.name}
                      width={150}
                      height={60}
                      className="h-16 w-auto object-contain"
                    />
                  ) : (
                    <div className="border border-gray-300 dark:border-gray-700 rounded-lg px-6 py-4 text-center">
                      <span className="font-semibold">{partner.name}</span>
                    </div>
                  )}
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Sponsors Section */}
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
              {sponsorsByTier.champion.length > 0 && (
                <div>
                  <h3 className="text-2xl font-semibold mb-6 text-center">🙌 Champion</h3>
                  <div className="flex flex-wrap gap-8 justify-center items-center">
                    {sponsorsByTier.champion.map((sponsor) => (
                      <a
                        key={sponsor.name}
                        href={sponsor.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:opacity-80 transition-opacity"
                      >
                        {sponsor.image ? (
                          <Image
                            src={
                              isDark && sponsor.image.dark
                                ? sponsor.image.dark
                                : sponsor.image.light
                            }
                            alt={sponsor.name}
                            width={200}
                            height={80}
                            className="h-20 w-auto object-contain"
                          />
                        ) : (
                          <div className="border border-gray-300 dark:border-gray-700 rounded-lg px-6 py-4 text-center">
                            <span className="font-semibold">{sponsor.name}</span>
                          </div>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {sponsorsByTier.promotor.length > 0 && (
                <div>
                  <h3 className="text-2xl font-semibold mb-6 text-center">📣 Promotor</h3>
                  <div className="flex flex-wrap gap-8 justify-center items-center">
                    {sponsorsByTier.promotor.map((sponsor) => (
                      <a
                        key={sponsor.name}
                        href={sponsor.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:opacity-80 transition-opacity"
                      >
                        {sponsor.image ? (
                          <Image
                            src={
                              isDark && sponsor.image.dark
                                ? sponsor.image.dark
                                : sponsor.image.light
                            }
                            alt={sponsor.name}
                            width={180}
                            height={70}
                            className="h-16 w-auto object-contain"
                          />
                        ) : (
                          <div className="border border-gray-300 dark:border-gray-700 rounded-lg px-6 py-4 text-center">
                            <span className="font-semibold">{sponsor.name}</span>
                          </div>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {sponsorsByTier.supporter.length > 0 && (
                <div>
                  <h3 className="text-2xl font-semibold mb-6 text-center">🎗 Supporter</h3>
                  <div className="flex flex-wrap gap-8 justify-center items-center">
                    {sponsorsByTier.supporter.map((sponsor) => (
                      <a
                        key={sponsor.name}
                        href={sponsor.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:opacity-80 transition-opacity"
                      >
                        {sponsor.image ? (
                          <Image
                            src={
                              isDark && sponsor.image.dark
                                ? sponsor.image.dark
                                : sponsor.image.light
                            }
                            alt={sponsor.name}
                            width={150}
                            height={60}
                            className="h-14 w-auto object-contain"
                          />
                        ) : (
                          <div className="border border-gray-300 dark:border-gray-700 rounded-lg px-6 py-4 text-center">
                            <span className="font-semibold">{sponsor.name}</span>
                          </div>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {sponsorsByTier.fan.length > 0 && (
                <div>
                  <h3 className="text-2xl font-semibold mb-6 text-center">🤘 Fan</h3>
                  <div className="flex flex-wrap gap-8 justify-center items-center">
                    {sponsorsByTier.fan.map((sponsor) => (
                      <a
                        key={sponsor.name}
                        href={sponsor.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:opacity-80 transition-opacity"
                      >
                        {sponsor.image ? (
                          <Image
                            src={
                              isDark && sponsor.image.dark
                                ? sponsor.image.dark
                                : sponsor.image.light
                            }
                            alt={sponsor.name}
                            width={120}
                            height={50}
                            className="h-12 w-auto object-contain"
                          />
                        ) : (
                          <div className="border border-gray-300 dark:border-gray-700 rounded-lg px-6 py-4 text-center">
                            <span className="font-semibold">{sponsor.name}</span>
                          </div>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Become a Sponsor CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Look how you can help</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            and start creating an impact in the community today!
          </p>
          <a
            href="https://github.com/sponsors/HackRegina"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-primary-700 hover:bg-primary-500 text-white rounded-full px-8 py-3 text-lg transition-colors"
          >
            Become a Sponsor
          </a>
        </div>
      </section>
    </>
  );
};
