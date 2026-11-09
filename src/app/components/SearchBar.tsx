"use client"

import { useState, useEffect, type ComponentType } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowDown, FiArrowUp, FiCheck, FiClock, FiSearch, FiSliders, FiUser, FiUsers, FiX } from "react-icons/fi";
import { FaCrown } from "react-icons/fa";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    isSearchFocused: boolean;
    onFocus: () => void;
    onBlur: () => void;
    itemVariants: {
        hidden: { opacity: number; y: number };
        visible: { opacity: number; y: number; transition: { delay?: number; duration?: number } };
    };
    filtroSelecionado?: string | null;
    onFilterChange?: (filtro: string | null) => void;
    placeholder?: string;
}

type Option = { id: string; label: string; icon: ComponentType<{ className?: string; size?: number }>; iconClass?: string };

const SORT: Option[] = [
    { id: 'a-z', label: 'Name A–Z', icon: FiArrowDown },
    { id: 'z-a', label: 'Name Z–A', icon: FiArrowUp },
    { id: 'mais-recentes', label: 'Newest first', icon: FiClock },
    { id: 'mais-antigos', label: 'Oldest first', icon: FiClock },
    { id: 'mais-membros', label: 'Most members', icon: FiUsers },
    { id: 'menos-membros', label: 'Fewest members', icon: FiUser },
];

const ROLES: Option[] = [
    { id: 'owner', label: 'Rooms I own', icon: FaCrown, iconClass: 'text-primary' },
    { id: 'admin', label: 'Rooms I admin', icon: FiUsers, iconClass: 'text-blue-400' },
    { id: 'member', label: "Rooms I'm a member of", icon: FiUser, iconClass: 'text-white/50' },
];

const LABELS = Object.fromEntries([...SORT, ...ROLES].map(o => [o.id, o.label]));

export default function SearchBar({
    value,
    onChange,
    isSearchFocused,
    onFocus,
    onBlur,
    itemVariants,
    filtroSelecionado,
    onFilterChange,
    placeholder = "Search rooms",
}: SearchBarProps) {
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (isFilterDropdownOpen && !target.closest('.filter-container')) {
                setIsFilterDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isFilterDropdownOpen]);

    const select = (filtro: string | null) => {
        onFilterChange?.(filtro);
        setIsFilterDropdownOpen(false);
    };

    const renderOption = (o: Option) => {
        const active = filtroSelecionado === o.id;
        return (
            <button
                key={o.id}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors ${active ? 'bg-primary/10 text-white' : 'text-white/75 hover:bg-white/[0.06] hover:text-white'}`}
                onClick={() => select(o.id)}
            >
                <o.icon size={15} className={o.iconClass ?? 'text-primary'} />
                <span className="flex-1">{o.label}</span>
                {active && <FiCheck className="text-primary" size={15} />}
            </button>
        );
    };

    return (
        <motion.div className="mb-6 flex items-center gap-3" variants={itemVariants}>
            <label
                className={`flex h-12 min-w-0 flex-1 items-center gap-3 rounded-2xl border bg-white/[0.03] px-4 transition-colors ${isSearchFocused ? 'border-primary/60 ring-4 ring-primary/10' : 'border-white/10 hover:border-white/20'}`}
            >
                <FiSearch className="shrink-0 text-white/40" aria-hidden />
                <input
                    type="search"
                    placeholder={placeholder}
                    aria-label={placeholder}
                    className="custom-focus h-full min-w-0 flex-1 border-none bg-transparent text-[15px] text-white outline-none placeholder:text-white/35 focus:border-none focus:outline-none focus:ring-0"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={onFocus}
                    onBlur={onBlur}
                />
                {value && (
                    <button type="button" onClick={() => onChange("")} aria-label="Clear search" className="rounded-full p-1 text-white/40 hover:bg-white/10 hover:text-white">
                        <FiX size={15} />
                    </button>
                )}
            </label>

            {onFilterChange && (
                <div className="filter-container relative">
                    <button
                        type="button"
                        className={`flex h-12 items-center gap-2 rounded-2xl border px-4 text-sm transition-colors ${filtroSelecionado ? 'border-primary/50 bg-primary/10 text-primary' : 'border-white/10 bg-white/[0.03] text-white/70 hover:border-white/20 hover:text-white'}`}
                        onClick={() => setIsFilterDropdownOpen(open => !open)}
                        aria-label="Sort and filter"
                        aria-haspopup="menu"
                        aria-expanded={isFilterDropdownOpen}
                    >
                        <FiSliders aria-hidden />
                        <span className="hidden max-w-[11rem] truncate sm:inline">{filtroSelecionado ? LABELS[filtroSelecionado] ?? 'Filtered' : 'Sort & filter'}</span>
                    </button>

                    <AnimatePresence>
                        {isFilterDropdownOpen && (
                            <motion.div
                                role="menu"
                                className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#141414] p-1.5 shadow-2xl"
                                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                                transition={{ duration: 0.15 }}
                            >
                                <p className="px-3 pb-1 pt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">Sort by</p>
                                {SORT.map(renderOption)}
                                <div className="my-1.5 border-t border-white/[0.06]" />
                                <p className="px-3 pb-1 pt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">My role</p>
                                {ROLES.map(renderOption)}
                                {filtroSelecionado && (
                                    <>
                                        <div className="my-1.5 border-t border-white/[0.06]" />
                                        <button
                                            type="button"
                                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-red-300 transition-colors hover:bg-red-500/10"
                                            onClick={() => select(null)}
                                        >
                                            <FiX size={15} /> Clear
                                        </button>
                                    </>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </motion.div>
    );
}
