import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, PawPrint } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  const links = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.our_story'), path: '/about' },
    { name: t('nav.our_dogs'), path: '/dogs' },
    { name: t('nav.puppies'), path: '/puppies' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-slate-700 text-white text-xs sm:text-sm text-center py-2 px-4 tracking-wide">
        {t('nav.top_announcement')} <Link to="/puppies" className="underline hover:text-stella-gold">{t('nav.reserve_now')}</Link>
      </div>

      <nav className="bg-stella-cream sticky top-0 z-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo Area */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex flex-col items-center">
                <span className="font-serif text-2xl tracking-widest text-stella-dark uppercase">Stella Maris</span>
                <span className="font-sans text-[10px] tracking-[0.3em] text-gray-500 uppercase">{t('nav.subtitle')}</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-sans tracking-widest uppercase transition-colors duration-200 ${isActive(link.path)
                      ? 'text-stella-gold font-bold'
                      : 'text-gray-700 hover:text-stella-gold'
                    }`}
                >
                  {link.name}
                </Link>
              ))}

              {/* Language Switcher */}
              <div className="flex items-center gap-3 ml-4 text-[10px] font-bold tracking-widest text-gray-400">
                <span
                  onClick={() => setLanguage('en')}
                  className={`cursor-pointer transition-colors ${language === 'en' ? 'text-stella-gold' : 'hover:text-stella-dark'}`}
                >
                  EN
                </span>
                <span
                  onClick={() => setLanguage('bg')}
                  className={`cursor-pointer transition-colors ${language === 'bg' ? 'text-stella-gold' : 'hover:text-stella-dark'}`}
                >
                  BG
                </span>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-stella-gold focus:outline-none"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden bg-stella-cream border-t border-gray-200 absolute w-full shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-center">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-4 rounded-md text-sm font-sans tracking-widest uppercase ${isActive(link.path)
                      ? 'text-stella-gold font-bold'
                      : 'text-gray-700 hover:text-stella-gold'
                    }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navigation;