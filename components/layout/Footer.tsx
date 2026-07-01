'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Github, Linkedin, Twitter } from '@/components/icons/BrandIcons';
import { useTheme } from '@/contexts/ThemeContext';

const socialLinks = [
  { icon: Facebook, href: 'https://www.facebook.com/HackRegina', label: 'Facebook' },
  { icon: Twitter, href: 'http://twitter.com/HackRegina', label: 'Twitter' },
  { icon: Github, href: 'https://github.com/HackRegina', label: 'GitHub' },
  { icon: Linkedin, href: 'https://www.linkedin.com/company/hackregina/', label: 'LinkedIn' },
];

export function Footer() {
  const { isDark } = useTheme();

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-6">
          {/* Logo */}
          <Link href="/">
            <Image
              src={isDark ? '/images/hackregina-white.png' : '/images/hackregina-logo.svg'}
              alt="HackRegina"
              width={150}
              height={40}
              className="h-10 w-auto"
            />
          </Link>

          {/* Stay up to date */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Stay up to date
            </h3>
            <div className="flex space-x-6 justify-center">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="h-6 w-6" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} HackRegina. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
