'use client'

import Image from 'next/image'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { DoDemoLogin } from '@/app/services/login';

const LINKS = [
    { href: '#how', label: 'How it works' },
    { href: '#playground', label: 'Playground' },
    { href: '#product', label: 'Product' },
    { href: '#pricing', label: 'Pricing' },
];

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [active, setActive] = useState<string | null>(null);
    const { scrollY, scrollYProgress } = useScroll();
    const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });

    useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 24));

    useEffect(() => {
        if (!menuOpen) return;
        const closeOnEsc = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
        window.addEventListener('keydown', closeOnEsc);
        return () => window.removeEventListener('keydown', closeOnEsc);
    }, [menuOpen]);

    // Highlight the link of the section currently in the middle of the viewport.
    useEffect(() => {
        const sections = LINKS.map(l => document.querySelector(l.href)).filter(Boolean) as Element[];
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) setActive(`#${entry.target.id}`);
                });
            },
            { rootMargin: '-50% 0px -50% 0px' }
        );
        sections.forEach(s => observer.observe(s));
        return () => observer.disconnect();
    }, []);

    return (
        <motion.header
            className={`fixed left-0 top-0 z-50 w-full transition-colors duration-300 ${scrolled || menuOpen ? 'border-b border-white/5 bg-black/60 backdrop-blur-md' : 'border-b border-transparent'}`}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            <nav className='mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:h-[72px] lg:px-8'>
                <Link href="/" aria-label="Cybox home" className="shrink-0">
                    <Image src="/brand/cybox-wordmark.png" alt="Cybox" width={900} height={234} className="h-6 w-auto lg:h-7" priority />
                </Link>

                <ul className='hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1 text-sm text-white/70 md:flex'>
                    {LINKS.map(link => (
                        <li key={link.href} className="relative">
                            {active === link.href && (
                                <motion.span layoutId="nav-active" className="absolute inset-0 rounded-full bg-white/10" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                            )}
                            <a className={`relative block rounded-full px-4 py-2 transition-colors hover:text-white ${active === link.href ? 'text-white' : ''}`} href={link.href}>
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>

                <div className='hidden items-center gap-2 md:flex'>
                    <form action={DoDemoLogin}>
                        <button type='submit' className='flex h-10 items-center gap-2 rounded-full px-4 text-sm text-primary/90 transition-colors hover:text-primary'>
                            <span className='h-1.5 w-1.5 animate-pulse rounded-full bg-primary' /> Live demo
                        </button>
                    </form>
                    <Link href='/login' className='flex h-10 items-center rounded-full px-5 text-sm text-white/80 transition-colors hover:text-white'>
                        Log in
                    </Link>
                    <Link href='/cadastro'
                        className='flex h-10 items-center rounded-full bg-primary px-5 text-sm font-medium text-black transition-colors hover:bg-primary-hover'>
                        Sign up
                    </Link>
                </div>

                <button
                    type="button"
                    className='flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 md:hidden'
                    onClick={() => setMenuOpen(open => !open)}
                    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={menuOpen}
                    aria-controls="mobile-menu"
                >
                    {menuOpen ? <HiX size={26} /> : <HiMenuAlt3 size={26} />}
                </button>
            </nav>

            {/* scroll progress */}
            <motion.div aria-hidden className="absolute bottom-[-1px] left-0 h-px w-full origin-left bg-gradient-to-r from-primary to-amber" style={{ scaleX: progress }} />

            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        id="mobile-menu"
                        className='overflow-hidden border-t border-white/5 bg-black/95 px-4 md:hidden'
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ul className='flex flex-col pt-2'>
                            {LINKS.map(link => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setMenuOpen(false);
                                            history.replaceState(null, '', link.href);
                                            requestAnimationFrame(() => {
                                                document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' });
                                            });
                                        }}
                                        className='block rounded-lg px-3 py-3 text-lg text-gray-200 transition-colors hover:bg-white/5 hover:text-white'
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <form action={DoDemoLogin} className='mt-4'>
                            <button type='submit' className='flex h-12 w-full items-center justify-center gap-2 rounded-full border border-dashed border-primary/50 text-primary'>
                                <span className='h-1.5 w-1.5 animate-pulse rounded-full bg-primary' /> Try the live demo, no account needed
                            </button>
                        </form>
                        <div className='mt-3 grid grid-cols-2 gap-3 pb-6'>
                            <Link href='/login' className='flex h-12 items-center justify-center rounded-full border border-white/15 text-white'>
                                Log in
                            </Link>
                            <Link href='/cadastro' className='flex h-12 items-center justify-center rounded-full bg-primary font-medium text-black'>
                                Sign up
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
