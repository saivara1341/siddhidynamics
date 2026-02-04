import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import siddhiLogo from '@/assets/siddhi-logo.jpg';
import { LanguageSwitcher } from './LanguageSwitcher';

export const Navbar = () => {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { scrollY } = useScroll();

  const navLinks = [
    { name: t('nav.vision'), href: '#/vision' },
    { name: t('nav.projects'), href: '#/projects' },
    { name: t('nav.submit'), href: '#/submit' },
    { name: t('nav.collab'), href: '#/portal' },
  ];

  const headerOpacity = useTransform(scrollY, [0, 30], [0, 1]);
  const headerPadding = useTransform(scrollY, [0, 100], ['24px', '14px']);
  const headerBlur = useTransform(scrollY, [0, 100], ['0px', '40px']);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);

    // Basic auth check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
        className="fixed top-0 left-0 right-0 z-[100]"
      >
        {/* Robust Glass Background */}
        <motion.div
          className="absolute inset-0 transition-colors duration-300"
          style={{
            backgroundColor: scrolled ? 'rgba(2, 2, 2, 0.98)' : 'rgba(2, 2, 2, 0.85)',
            backdropFilter: 'blur(45px) saturate(180%)',
            WebkitBackdropFilter: 'blur(45px) saturate(180%)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        />

        <motion.div
          style={{ paddingTop: headerPadding, paddingBottom: headerPadding }}
          className="relative container mx-auto px-6"
        >
          <div className="flex items-center justify-between">
            <motion.a
              href="#"
              className="flex items-center gap-3 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative w-14 h-14 flex items-center justify-center">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl opacity-60" />
                <img
                  src={siddhiLogo}
                  alt="Siddhi Dynamics Logo"
                  className="relative w-full h-full object-contain mix-blend-screen drop-shadow-[0_0_15px_rgba(251,146,60,0.5)]"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-foreground tracking-tight" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  SIDDHI
                </span>
                <span className="text-xs text-primary font-medium tracking-[0.2em]">
                  DYNAMICS
                </span>
              </div>
            </motion.a>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className="relative px-5 py-2 text-muted-foreground hover:text-foreground transition-colors duration-300 text-sm font-medium group"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  whileHover={{ y: -2 }}
                >
                  {link.name}
                  <motion.span
                    className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-primary rounded-full group-hover:w-1/2 transition-all duration-300"
                    style={{ transform: 'translateX(-50%)' }}
                  />
                  <motion.span
                    className="absolute bottom-0 right-1/2 w-0 h-[2px] bg-primary rounded-full group-hover:w-1/2 transition-all duration-300"
                    style={{ transform: 'translateX(50%)' }}
                  />
                </motion.a>
              ))}

              <div className="mx-2">
                <LanguageSwitcher />
              </div>

              <motion.a
                href={isLoggedIn ? "#/portal" : "#/submit"}
                className="relative ml-4 px-6 py-2.5 rounded-xl font-semibold text-sm overflow-hidden group"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-90 group-hover:opacity-100 transition-opacity" />
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
                <span className="relative text-primary-foreground">
                  {isLoggedIn ? t('nav.portal') : t('nav.getStarted')}
                </span>
              </motion.a>
            </nav>

            {/* Mobile menu button */}
            <div className="flex items-center gap-4 md:hidden">
              <LanguageSwitcher />
              <motion.button
                className="relative w-10 h-10 flex items-center justify-center"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                whileTap={{ scale: 0.9 }}
              >
                <div className="flex flex-col gap-1.5">
                  <motion.span
                    className="w-6 h-0.5 bg-foreground rounded-full"
                    animate={{
                      rotate: mobileMenuOpen ? 45 : 0,
                      y: mobileMenuOpen ? 8 : 0
                    }}
                  />
                  <motion.span
                    className="w-6 h-0.5 bg-foreground rounded-full"
                    animate={{ opacity: mobileMenuOpen ? 0 : 1 }}
                  />
                  <motion.span
                    className="w-6 h-0.5 bg-foreground rounded-full"
                    animate={{
                      rotate: mobileMenuOpen ? -45 : 0,
                      y: mobileMenuOpen ? -8 : 0
                    }}
                  />
                </div>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.header>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={{
          opacity: mobileMenuOpen ? 1 : 0,
          pointerEvents: mobileMenuOpen ? 'auto' : 'none',
        }}
        className="fixed inset-0 z-40 md:hidden"
      >
        <div className="absolute inset-0 bg-background/95 backdrop-blur-xl" onClick={() => setMobileMenuOpen(false)} />
        <motion.nav
          initial={false}
          animate={{ y: mobileMenuOpen ? 0 : -50 }}
          className="relative flex flex-col items-center justify-center h-full gap-8"
        >
          {navLinks.map((link, index) => (
            <motion.a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-2xl font-display font-semibold text-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: mobileMenuOpen ? 1 : 0,
                y: mobileMenuOpen ? 0 : 20
              }}
              transition={{ delay: 0.1 * index }}
            >
              {link.name}
            </motion.a>
          ))}
        </motion.nav>
      </motion.div>
    </>
  );
};
