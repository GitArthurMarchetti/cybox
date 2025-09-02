"use client"

import { motion } from 'framer-motion';
import { MdSearch, MdAdd, MdKeyboardArrowRight } from 'react-icons/md';
import { Category } from '@/lib/types/categoria.types';

interface CategoriasListProps {
    categories: Category[];
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedCategory: Category | null;
    onSelectCategory: (category: Category) => void;
    onAddNew: () => void;
    hasInitiallyLoaded: boolean;
    containerVariants: {
        hidden: { opacity: number };
        visible: { opacity: number; transition: { staggerChildren: number } };
    };
    itemVariants: {
        hidden: { opacity: number; y: number };
        visible: { opacity: number; y: number; transition: { delay?: number } };
    };
}

export default function CategoriasList({
    categories,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    onSelectCategory,
    onAddNew,
    hasInitiallyLoaded,
    containerVariants,
    itemVariants
}: CategoriasListProps) {
    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-2/3 overflow-y-auto p-6">
            <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                    <input
                        autoComplete='off'
                        type="text"
                        placeholder="Buscar categoria..."
                        className="bg-[#2c2c2c] text-white pl-10 pr-4 py-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-[#F6CF45]/50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8c8888]" size={20} />
                </div>
            </div>

            {filteredCategories.length > 0 ? (
                <motion.div 
                    className="space-y-4" 
                    variants={containerVariants}
                    initial={hasInitiallyLoaded ? "visible" : "hidden"}
                    animate="visible"
                >
                    {filteredCategories.map((category, index) => (
                        <motion.div
                            key={category.id}
                            className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                                selectedCategory?.id === category.id
                                    ? 'bg-[#2c2c2c] border-l-4 border-[#F6CF45]'
                                    : 'bg-[#1a1a1a] hover:bg-[#2c2c2c]'
                            }`}
                            onClick={() => onSelectCategory(category)}
                            variants={itemVariants}
                            initial={hasInitiallyLoaded ? "visible" : "hidden"}
                            animate="visible"
                            whileHover={hasInitiallyLoaded ? {} : { x: 5 }}
                            custom={index}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-[#2c2c2c] rounded-lg flex items-center justify-center text-[#F6CF45]">
                                        {category.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-white">{category.name}</h3>
                                        <p className="text-sm text-[#b4b4b4]">{category.observation}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <span className="text-sm text-[#b4b4b4]">Total de itens</span>
                                        <p className="text-lg font-semibold text-white">{category.total}</p>
                                    </div>
                                    <button className="text-[#F6CF45] hover:text-white transition-colors duration-300">
                                        <MdKeyboardArrowRight size={24} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <motion.div className="flex flex-col items-center justify-center h-full text-center" variants={itemVariants}>
                    <div className="bg-[#2c2c2c] p-6 rounded-xl mb-4">
                        <MdSearch className="text-[#F6CF45]" size={48} />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Nenhuma categoria encontrada</h3>
                    <p className="text-[#8c8888] max-w-md">
                        Não encontramos categorias com este termo. Tente outra busca ou crie uma nova categoria.
                    </p>
                    <button
                        className="mt-4 flex items-center gap-2 bg-[#F6CF45] text-black px-4 py-2 rounded-lg hover:bg-[#F6CF45]/90 transition-colors duration-300"
                        onClick={() => {
                            setSearchTerm("");
                            onAddNew();
                        }}
                    >
                        <MdAdd /> Criar nova categoria
                    </button>
                </motion.div>
            )}
        </div>
    );
}