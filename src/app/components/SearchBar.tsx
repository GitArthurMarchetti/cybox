"use client"

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdSearch } from "react-icons/io";
import { FaFilter, FaSortAmountDown, FaSortAmountUp, FaCrown, FaUserTie, FaUser, FaUsers } from "react-icons/fa";
import { MdSortByAlpha, MdClear, MdCheckCircle, MdCancel, MdAccessTime } from "react-icons/md";

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
}

export default function SearchBar({
    value,
    onChange,
    isSearchFocused,
    onFocus,
    onBlur,
    itemVariants,
    filtroSelecionado,
    onFilterChange
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

    const handleFilterSelect = (filtro: string) => {
        if (onFilterChange) {
            onFilterChange(filtro);
        }
        setIsFilterDropdownOpen(false);
    };

    const handleClearFilter = () => {
        if (onFilterChange) {
            onFilterChange(null);
        }
        setIsFilterDropdownOpen(false);
    };

    return (
        <motion.div
            className="flex items-center justify-between mb-8 gap-6 pr-3"
            variants={itemVariants}
        >
            <div
                className={`flex items-center bg-[#2C2C2C] w-[90%] px-4 rounded-full transition-all duration-300 ${isSearchFocused ? 'ring-2 ring-[#F6CF45]/50' : ''}`}
            >
                <input
                    type="text"
                    placeholder="Pesquise por seu departamento"
                    className="flex-grow p-3 custom-focus outline-none bg-transparent text-white placeholder:text-[#8C8888] border-none focus:border-none focus:outline-none focus:ring-0"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={onFocus}
                    onBlur={onBlur}
                />
                <IoMdSearch className="text-[#8C8888] text-xl" />
            </div>

            <div className="relative filter-container">
                <motion.button
                    className={`flex items-center text-white group ${filtroSelecionado ? 'text-[#F6CF45]' : ''}`}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                >
                    <FaFilter className={`${filtroSelecionado ? 'text-[#F6CF45]' : 'text-[#8C8888]'} group-hover:text-[#F6CF45] transition-colors duration-300`} />
                    <span className={`ml-2 ${filtroSelecionado ? 'text-[#F6CF45]' : 'text-[#8C8888]'} underline-offset-4 underline italic group-hover:text-[#F6CF45] transition-colors duration-300`}>
                        Filtrar
                    </span>
                </motion.button>

                <AnimatePresence>
                    {isFilterDropdownOpen && (
                        <motion.div
                            className="absolute right-0 mt-2 w-72 bg-[#1a1a1a] border border-[#2c2c2c] rounded-xl shadow-xl z-50 overflow-hidden"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="p-2">
                                <div className="px-3 py-2 text-xs font-semibold text-[#8c8888] uppercase">Ordenar</div>

                                <button
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white hover:bg-[#2c2c2c] rounded-lg transition-colors duration-200"
                                    onClick={() => handleFilterSelect('a-z')}
                                >
                                    <MdSortByAlpha size={18} className="text-[#F6CF45]" />
                                    <span>A-Z</span>
                                </button>

                                <button
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white hover:bg-[#2c2c2c] rounded-lg transition-colors duration-200"
                                    onClick={() => handleFilterSelect('z-a')}
                                >
                                    <MdSortByAlpha size={18} className="text-[#F6CF45] transform rotate-180" />
                                    <span>Z-A</span>
                                </button>

                                <button
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white hover:bg-[#2c2c2c] rounded-lg transition-colors duration-200"
                                    onClick={() => handleFilterSelect('mais-recentes')}
                                >
                                    <MdAccessTime size={18} className="text-[#F6CF45]" />
                                    <span>Mais recentes</span>
                                </button>

                                <button
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white hover:bg-[#2c2c2c] rounded-lg transition-colors duration-200"
                                    onClick={() => handleFilterSelect('mais-antigos')}
                                >
                                    <MdAccessTime size={18} className="text-[#F6CF45] transform rotate-180" />
                                    <span>Mais antigos</span>
                                </button>

                                <button
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white hover:bg-[#2c2c2c] rounded-lg transition-colors duration-200"
                                    onClick={() => handleFilterSelect('mais-membros')}
                                >
                                    <FaSortAmountDown size={16} className="text-[#F6CF45]" />
                                    <span>Mais membros</span>
                                </button>

                                <button
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white hover:bg-[#2c2c2c] rounded-lg transition-colors duration-200"
                                    onClick={() => handleFilterSelect('menos-membros')}
                                >
                                    <FaSortAmountUp size={16} className="text-[#F6CF45]" />
                                    <span>Menos membros</span>
                                </button>

                                <div className="my-2 border-t border-[#2c2c2c]"></div>

                                <div className="px-3 py-2 text-xs font-semibold text-[#8c8888] uppercase">Filtrar por Role</div>

                                <button
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white hover:bg-[#2c2c2c] rounded-lg transition-colors duration-200"
                                    onClick={() => handleFilterSelect('owner')}
                                >
                                    <FaCrown size={16} className="text-yellow-400" />
                                    <span>Proprietário</span>
                                </button>

                                <button
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white hover:bg-[#2c2c2c] rounded-lg transition-colors duration-200"
                                    onClick={() => handleFilterSelect('admin')}
                                >
                                    <FaUserTie size={16} className="text-blue-400" />
                                    <span>Administrador</span>
                                </button>

                                <button
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white hover:bg-[#2c2c2c] rounded-lg transition-colors duration-200"
                                    onClick={() => handleFilterSelect('member')}
                                >
                                    <FaUser size={16} className="text-gray-400" />
                                    <span>Membro</span>
                                </button>

                                <div className="my-2 border-t border-[#2c2c2c]"></div>

                                <div className="px-3 py-2 text-xs font-semibold text-[#8c8888] uppercase">Filtrar por Status</div>

                                <button
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white hover:bg-[#2c2c2c] rounded-lg transition-colors duration-200"
                                    onClick={() => handleFilterSelect('ativo')}
                                >
                                    <MdCheckCircle size={18} className="text-green-500" />
                                    <span>Ativo</span>
                                </button>

                                <button
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white hover:bg-[#2c2c2c] rounded-lg transition-colors duration-200"
                                    onClick={() => handleFilterSelect('inativo')}
                                >
                                    <MdCancel size={18} className="text-red-500" />
                                    <span>Inativo</span>
                                </button>

                                {filtroSelecionado && (
                                    <>
                                        <div className="my-2 border-t border-[#2c2c2c]"></div>
                                        <button
                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-[#2c2c2c] rounded-lg transition-colors duration-200"
                                            onClick={handleClearFilter}
                                        >
                                            <MdClear size={18} />
                                            <span>Limpar filtros</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}