'use client';

import { useState, useEffect } from 'react';
import { Menu, UserIcon, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface NavItem {
  label: string;
  href: string;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navItems: NavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'forum', href: '/forum' },
    { label: 'Library Listing', href: '/libraries' },
    { label: 'Contact Us', href: '/contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('#mobile-menu') && !target.closest('#menu-button')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  return (
    <nav 
      className={`relative w-full top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#ECE3DA]/95 shadow-md backdrop-blur-sm' : 'bg-[#ECE3DA]'
      }`}
      aria-label="Main navigation"
    >
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" aria-label="StudentAdda Home">
            <Image
              src="/logo.svg"
              width={158}
              height={28}
              alt="StudentAdda Logo"
              className="w-32 sm:w-40 h-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* Center: Nav links */}
        <div className="hidden md:flex items-center gap-2 lg:gap-4 font-bold text-[#435058] text-sm lg:text-[14.19px] leading-[14.19px] tracking-[0.14px]">
          {navItems.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className="px-3 lg:px-4 py-2 rounded-full transition duration-200 hover:bg-[#435058] hover:text-[#FEEDC1] focus:outline-none focus:ring-2 focus:ring-[#435058] focus:ring-opacity-50"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right: Sign In */}
        <div className="hidden md:flex items-center">
          <button
            onClick={() => setIsLoggedIn(!isLoggedIn)}
            className="flex items-center gap-2 bg-[#435058] text-white px-4 py-2 rounded-full hover:bg-[#374349] transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#435058] focus:ring-opacity-50"
            aria-label={isLoggedIn ? "Sign Out" : "Sign In"}
          >
            <span className="font-bold text-[15.61px] leading-[22.71px] tracking-[0.14px] whitespace-nowrap">
              {isLoggedIn ? 'Sign Out' : 'Sign In'}
            </span>
            <UserIcon size={20} className="hidden md:block" color="#FEEDC1" />
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button 
            id="menu-button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#435058] focus:ring-opacity-50"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X size={24} color='#435058' /> : <Menu size={24} color='#435058' />}
          </button>
        </div>
      </div>

      {/* Mobile Menu - now overlays content */}
      <div
        id="mobile-menu"
        className={`md:hidden absolute top-full left-0 w-full z-40 bg-[#ECE3DA] border-t border-[#435058]/10 shadow-md transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'
        } origin-top transform`}
      >
        <div className="px-4 pb-4 pt-2 flex flex-col gap-3 font-semibold text-[#435058]">
          {navItems.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className="px-4 py-2 rounded-md transition duration-200 hover:bg-[#435058] hover:text-[#FEEDC1] focus:outline-none focus:ring-2 focus:ring-[#435058] focus:ring-opacity-50"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          <button
            onClick={() => {
              setIsLoggedIn(!isLoggedIn);
              setIsOpen(false);
            }}
            className="mt-2 flex items-center justify-center gap-2 bg-[#435058] text-white px-4 py-2 rounded-full hover:bg-[#374349] transition duration-200"
            aria-label={isLoggedIn ? "Sign Out" : "Sign In"}
          >
            <span>{isLoggedIn ? 'Sign Out' : 'Sign In'}</span>
            <Image
              src="/signin.svg"
              alt=""
              width={20}
              height={20}
              className="w-5 h-6 object-contain"
            
            />
          </button>
        </div>
      </div>
    </nav>
  );
}
