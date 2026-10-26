'use client'

import Image from 'next/image'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HiMenuAlt3, HiX } from 'react-icons/hi';

const LINKS = [
    { href: '#home', label: 'Home' },
    { href: '#sobre', label: 'Sobre nós' },
    { href: '#planos', label: 'Planos' },
    { href: '#contato', label: 'Contato' },
];

export default function Navbar() {
    const [menuAberto, setMenuAberto] = useState(false);

    useEffect(() => {
        if (!menuAberto) return;
        const fecharComEsc = (e: KeyboardEvent) => e.key === 'Escape' && setMenuAberto(false);
        window.addEventListener('keydown', fecharComEsc);
        return () => window.removeEventListener('keydown', fecharComEsc);
    }, [menuAberto]);

    return (
        <motion.header
            className='fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/40 border-b border-white/5'
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <nav className='mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:h-20 lg:px-8'>
                <Link href="/" aria-label="Cybox - início" className="shrink-0">
                    <Image src="/logo-branca.png" alt="Cybox" width={80} height={40} className="h-8 w-auto object-contain lg:h-10" priority />
                </Link>

                <ul className='hidden items-center gap-10 text-base text-gray-300 md:flex lg:text-lg'>
                    {LINKS.map(link => (
                        <li key={link.href}>
                            <a className='group relative transition-colors duration-200 hover:text-white' href={link.href}>
                                {link.label}
                                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
                            </a>
                        </li>
                    ))}
                </ul>

                <div className='hidden items-center gap-3 md:flex'>
                    <Link href='/cadastro'
                        className='flex h-11 items-center rounded-full bg-surface-2 px-6 text-base text-white transition-colors duration-200 hover:bg-primary hover:text-black lg:px-8'>
                        Cadastrar
                    </Link>
                    <Link href='/login'
                        className='flex h-11 items-center rounded-full border-2 border-line px-6 text-base text-white transition-colors duration-200 hover:border-primary hover:bg-primary hover:text-black lg:px-8'>
                        Entrar
                    </Link>
                </div>

                <button
                    type="button"
                    className='flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 md:hidden'
                    onClick={() => setMenuAberto(aberto => !aberto)}
                    aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
                    aria-expanded={menuAberto}
                    aria-controls="menu-mobile"
                >
                    {menuAberto ? <HiX size={26} /> : <HiMenuAlt3 size={26} />}
                </button>
            </nav>

            <AnimatePresence>
                {menuAberto && (
                    <motion.div
                        id="menu-mobile"
                        className='border-t border-white/5 bg-black/95 px-4 pb-6 pt-2 md:hidden'
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ul className='flex flex-col'>
                            {LINKS.map(link => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setMenuAberto(false);
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
                        <div className='mt-4 grid grid-cols-2 gap-3'>
                            <Link href='/cadastro' className='flex h-12 items-center justify-center rounded-full bg-primary font-medium text-black'>
                                Cadastrar
                            </Link>
                            <Link href='/login' className='flex h-12 items-center justify-center rounded-full border-2 border-line text-white'>
                                Entrar
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
