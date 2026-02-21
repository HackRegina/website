'use client';

import { hierarchy, Pack } from '@visx/hierarchy';
import { ParentSize } from '@visx/responsive';
import { useEffect, useState } from 'react';
import { SkeletonLoader } from '@/components/layout/SkeletonLoader';
import { useTheme } from '@/contexts/ThemeContext';
import type { ICommunityMember } from '@/fetch/members';

const hackerScore = (d: ICommunityMember): number => {
  let multiplier = 1;
  if (!d) return 0;
  if (d.is_primary_owner) multiplier += 8;
  if (d.is_owner) multiplier += 4;
  if (d.is_admin) multiplier += 2;
  return multiplier * 5;
};

export const CommunitySection = ({
  isLoadingMembers,
  members,
}: {
  isLoadingMembers: boolean;
  members: ICommunityMember[];
}) => {
  const { isDark } = useTheme();
  const [displayCount, setDisplayCount] = useState(20);

  useEffect(() => {
    if (displayCount < members.length) {
      const timer = setTimeout(() => {
        setDisplayCount((prev) => Math.min(prev + 20, members.length));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [displayCount, members.length]);

  if (isLoadingMembers) {
    return (
      <section className="bg-gray-50 dark:bg-gray-800/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-12">Community</h2>
            <SkeletonLoader />
          </div>
        </div>
      </section>
    );
  }

  const displayedMembers = members.slice(0, displayCount);

  const pack = {
    children: displayedMembers,
    name: 'root',
    radius: 0,
    distance: 0,
  };

  const root = hierarchy<ICommunityMember | typeof pack>(pack)
    .sum((d) => ('children' in d ? 0 : 1 + hackerScore(d)))
    .sort(
      (a, b) =>
        ('children' in b.data ? 0 : hackerScore(b.data)) -
        ('children' in a.data ? 0 : hackerScore(a.data)),
    );

  const bgColor = isDark ? 'bg-primary-700' : 'bg-primary-300';

  if (members.length === 0) return null;

  return (
    <section className="bg-gray-50 dark:bg-gray-800/50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <div className="flex flex-col items-center space-y-5 md:space-y-10 mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-semibold text-center">
              <span className="relative inline-block">
                <span className="relative z-10">Community</span>
                <span className={`absolute bottom-0 left-0 w-full h-[30%] ${bgColor} -z-10`} />
              </span>
            </h2>
          </div>

          <ParentSize style={{ width: '100%', height: '100%', position: 'relative' }}>
            {({ width = 800 }) => {
              return width < 10 ? null : (
                <div
                  style={{
                    width,
                    height: width,
                    position: 'relative',
                  }}
                >
                  <Pack root={root} size={[width, width]} padding={width * 0.005}>
                    {(packData) => {
                      const circles = packData.descendants().slice(1);
                      return (
                        <div>
                          {[...circles].reverse().map((circle) => {
                            const tooltipWidth = 150;
                            const tooltipHeight = 40;
                            const shouldFlipX = circle.x + tooltipWidth / 2 > width;
                            const shouldFlipY = circle.y - circle.r - tooltipHeight < 0;

                            if ('children' in circle.data) return null; // Skip non-leaf nodes
                            return (
                              <div
                                key={`circle-${circle.data.user_id}`}
                                className={`member-link ${bgColor} rounded-full shadow-lg absolute`}
                                style={{
                                  left: circle.x,
                                  top: circle.y,
                                  width: circle.r * 2,
                                  height: circle.r * 2,
                                  zIndex: 0,
                                }}
                              >
                                <picture>
                                  <source
                                    media="(max-width: 24px)"
                                    srcSet={circle.data?.image_24}
                                  />
                                  <source
                                    media="(min-width: 25px) and (max-width: 32px)"
                                    srcSet={circle.data?.image_32}
                                  />
                                  <source
                                    media="(min-width: 33px) and (max-width: 48px)"
                                    srcSet={circle.data?.image_48}
                                  />
                                  <source
                                    media="(min-width: 49px) and (max-width: 72px)"
                                    srcSet={circle.data?.image_72}
                                  />
                                  <source
                                    media="(min-width: 73px) and (max-width: 192px)"
                                    srcSet={circle.data?.image_192}
                                  />
                                  <source
                                    media="(min-width: 193px) and (max-width: 512px)"
                                    srcSet={circle.data?.image_512}
                                  />
                                  <source
                                    media="(min-width: 513px) and (max-width: 1024px)"
                                    srcSet={circle.data?.image_1024}
                                  />
                                  <img
                                    src={
                                      circle.data?.image_original ||
                                      circle.data?.image_1024 ||
                                      circle.data?.image_512 ||
                                      circle.data?.image_192 ||
                                      circle.data?.image_72 ||
                                      circle.data?.image_48 ||
                                      circle.data?.image_32 ||
                                      circle.data?.image_24
                                    }
                                    alt={circle.data?.display_name || 'Member'}
                                    className="absolute left-1/2 -translate-x-1/2 rounded-full"
                                    style={{
                                      width: '95%',
                                      height: '95%',
                                      objectFit: 'cover',
                                    }}
                                  />
                                </picture>

                                <div
                                  className="member-tooltip absolute flex items-center justify-center px-3 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-xl"
                                  style={{
                                    top: shouldFlipY ? '100%' : 'auto',
                                    bottom: shouldFlipY ? 'auto' : '100%',
                                    left: shouldFlipX ? 'auto' : '50%',
                                    right: shouldFlipX ? '50%' : 'auto',
                                    transform: shouldFlipX ? 'translateX(50%)' : 'translateX(-50%)',
                                    marginTop: shouldFlipY ? '0.5rem' : 0,
                                    marginBottom: shouldFlipY ? 0 : '0.5rem',
                                    whiteSpace: 'nowrap',
                                    minWidth: '100px',
                                  }}
                                >
                                  {circle.data?.display_name}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    }}
                  </Pack>
                </div>
              );
            }}
          </ParentSize>
        </div>
      </div>
    </section>
  );
};
