'use client';

import { Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Slack } from '@/components/icons/BrandIcons';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useTheme } from '@/contexts/ThemeContext';

const navLinks = [
  { label: 'Events', href: '/events' },
  { label: 'View Map', href: '/techmap' },
  { label: 'Find Work', href: 'https://old.hackregina.com/#/jobs', external: true },
  { label: 'Survey', href: 'https://old.hackregina.com/survey/#/', external: true },
];

export function Navbar() {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src={isDark ? '/images/hackregina-white.png' : '/images/hackregina-logo.png'}
              alt="HackRegina"
              width={150}
              height={40}
              className="h-8 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className="text-gray-700 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {/* TODO: Hide button until light mode is fixed.  */}
            {/* <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              )}
            </button> */}

            <a
              href="http://joinslack.hackregina.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary-700 hover:bg-primary-500 text-white rounded-full px-6 py-2 transition-colors"
            >
              <Slack className="h-5 w-5 inline-block mr-2 align-sub" />
              Join
            </a>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-4">
            {/* TODO: Hide button until light mode is fixed.  */}
            {/* <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              )}
            </button> */}

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Open menu"
                >
                  <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                </button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-6 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      onClick={() => setIsOpen(false)}
                      className="text-lg text-gray-700 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}

                  <a
                    href="http://joinslack.hackregina.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary-700 hover:bg-primary-500 text-white rounded-full px-6 py-2 text-center transition-colors"
                  >
                    <Slack className="h-5 w-5 inline-block mr-2 align-sub" />
                    Join
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
