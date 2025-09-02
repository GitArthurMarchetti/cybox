'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose, MdBusiness } from 'react-icons/md';
import { FaPlus } from 'react-icons/fa';
import { saveDepartamento } from '../../services/departamento';
import { toast } from 'sonner';

interface CreateDepartmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    onSuccess?: () => void;
}

const CreateDepartmentModal = ({ isOpen, onClose, userId, onSuccess }: CreateDepartmentModalProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        titulo: '',
        descricao: '',
        localizacao: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.titulo.trim()) {
            toast.error('O título é obrigatório');
            return;
        }

        setIsLoading(true);
        try {
            const data = new FormData();
            data.append('titulo', formData.titulo.trim());
            data.append('descricao', formData.descricao.trim());
            data.append('localizacao', formData.localizacao.trim());

            await saveDepartamento(data, userId);
            toast.success('Departamento criado com sucesso!');
            onClose();
            if (onSuccess) onSuccess();
        } catch (error) {
            toast.error('Erro ao criar departamento');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="bg-[#1F1F1F] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border border-[#2c2c2c]"
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-[#2c2c2c] flex items-center justify-between h-28">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#F6CF45] rounded-lg">
                                    <MdBusiness className="text-black" size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Novo Departamento</h2>
                                    <p className="text-[#8c8888] text-sm">Organize seus patrimônios por departamento</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-[#2c2c2c] rounded-lg transition-colors duration-300 text-[#8c8888] hover:text-white"
                            >
                                <MdClose size={24} />
                            </button>
                        </div>

                        <div className="p-8">
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                >
                                    <label className="block text-sm font-medium text-[#b4b4b4] mb-2">
                                        Nome do departamento *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        maxLength={100}
                                        className="w-full bg-[#2c2c2c] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6CF45]/50 placeholder-[#6c6c6c]"
                                        placeholder="Ex: Tecnologia da Informação, Recursos Humanos..."
                                        value={formData.titulo}
                                        onChange={(e) => handleInputChange('titulo', e.target.value)}
                                    />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.2 }}
                                >
                                    <label className="block text-sm font-medium text-[#b4b4b4] mb-2">
                                        Descrição
                                    </label>
                                    <textarea
                                        rows={4}
                                        maxLength={500}
                                        className="w-full bg-[#2c2c2c] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6CF45]/50 resize-none placeholder-[#6c6c6c]"
                                        placeholder="Descreva o propósito e responsabilidades deste departamento..."
                                        value={formData.descricao}
                                        onChange={(e) => handleInputChange('descricao', e.target.value)}
                                    />
                                    <p className="text-xs text-[#8c8888] mt-1">
                                        {formData.descricao.length}/500 caracteres
                                    </p>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.3 }}
                                >
                                    <label className="block text-sm font-medium text-[#b4b4b4] mb-2">
                                        Localização
                                    </label>
                                    <input
                                        type="text"
                                        maxLength={200}
                                        className="w-full bg-[#2c2c2c] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6CF45]/50 placeholder-[#6c6c6c]"
                                        placeholder="Ex: Prédio A - 2º Andar, Sala 205..."
                                        value={formData.localizacao}
                                        onChange={(e) => handleInputChange('localizacao', e.target.value)}
                                    />
                                </motion.div>


                                <motion.div
                                    className="flex items-center justify-between pt-6 border-t border-[#2c2c2c]"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3, delay: 0.5 }}
                                >
                                    <div className="text-sm w-1/3 text-[#8c8888]">
                                        Você será o proprietário deste departamento
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            className="px-6 py-3 text-[#b4b4b4] hover:text-white hover:bg-[#2c2c2c] rounded-lg transition-all duration-300"
                                            onClick={onClose}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading || !formData.titulo.trim()}
                                            className="px-6 py-3 bg-[#F6CF45] text-black font-medium rounded-lg hover:bg-[#F6CF45]/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                                                    Criando...
                                                </>
                                            ) : (
                                                <>
                                                    <FaPlus size={16} />
                                                    Criar Departamento
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CreateDepartmentModal;