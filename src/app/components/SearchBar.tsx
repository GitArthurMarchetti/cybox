"use client"

import { motion } from "framer-motion";
import { IoMdSearch } from "react-icons/io";
import { FaFilter } from "react-icons/fa6";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    isSearchFocused: boolean;
    onFocus: () => void;
    onBlur: () => void;
    itemVariants: {
        hidden: { opacity: number; y: number };
        visible: { opacity: number; y: number; transition: { delay?: number } };
    };
}

export default function SearchBar({
    value,
    onChange,
    isSearchFocused,
    onFocus,
    onBlur,
    itemVariants
}: SearchBarProps) {
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
            <motion.button
                className="flex items-center text-white group"
                whileHover={{ scale: 1.05 }}
            >
                <FaFilter className="text-[#8C8888] group-hover:text-[#F6CF45] transition-colors duration-300" />
                <span className="ml-2 text-[#8C8888] underline-offset-4 underline italic group-hover:text-[#F6CF45] transition-colors duration-300">Filtrar</span>
            </motion.button>
        </motion.div>
    );
}