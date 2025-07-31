"use client"

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose, MdCategory } from 'react-icons/md';
import { FaPlus } from 'react-icons/fa';
import { saveCategoria, getPadroesDepreciacao } from '@/app/services/categoria';
import { toast } from 'sonner';

interface CriarCategoriaModalProps {
    isOpen: boolean;
    onClose: () => void;
    departamentoId: string | number | null;
    onSuccess?: () => void;
}

export default function CriarCategoriaModal({
    isOpen,
    onClose,
    departamentoId,
    onSuccess
}: CriarCategoriaModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [padroesDepreciacao, setPadroesDepreciacao] = useState<any[]>([]);

    // Carregar padrões de depreciação ao abrir o modal
    useEffect(() => {
        if (isOpen) {
            const carregarPadroes = async () => {
                try {
                    const padroes = await getPadroesDepreciacao();
                    setPadroesDepreciacao(padroes);
                } catch (error) {
                    console.error('Erro ao carregar padrões de depreciação:', error);
                }
            };
            carregarPadroes();
        }
    }, [isOpen]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData(event.currentTarget);
            formData.append('id_departamento', departamentoId?.toString() || '');

            await saveCategoria(formData);

            toast.success("Categoria criada com sucesso!");
            onClose();
            if (onSuccess) onSuccess();
        } catch (error) {
            toast.error("Erro ao criar categoria");
            console.error('Erro ao criar categoria:', error);
        } finally {
            setIsLoading(false);
        }
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
                                    <MdCategory className="text-black" size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Nova Categoria</h2>
                                    <p className="text-[#8c8888] text-sm">Organize seus patrimônios em categorias</p>
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
                                    <label className="block text-sm font-medium text-[#b4b4b4] mb-2">Nome da categoria</label>
                                    <input
                                        autoComplete='off'
                                        type="text"
                                        name="nome"
                                        required
                                        className="w-full bg-[#2c2c2c] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6CF45]/50 placeholder-[#6c6c6c]"
                                        placeholder="Ex: Notebooks, Mobiliário, Veículos..."
                                    />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.2 }}
                                >
                                    <label className="block text-sm font-medium text-[#b4b4b4] mb-2">Descrição</label>
                                    <textarea
                                        name="descricao"
                                        rows={4}
                                        className="w-full bg-[#2c2c2c] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6CF45]/50 resize-none placeholder-[#6c6c6c]"
                                        placeholder="Adicione uma descrição ou observação sobre esta categoria..."
                                    ></textarea>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.3 }}
                                >
                                    <label className="block text-sm font-medium text-[#b4b4b4] mb-2">Padrão de Depreciação</label>
                                    <select
                                        name="padrao_depreciacao_id"
                                        className="w-full bg-[#2c2c2c] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6CF45]/50"
                                    >
                                        <option value="">Selecione um padrão (opcional)</option>
                                        {padroesDepreciacao.map(padrao => (
                                            <option key={padrao.id} value={padrao.id}>
                                                {padrao.categoria} - {padrao.taxa_anual_percent}% a.a. ({padrao.vida_util_anos} anos)
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-[#8c8888] mt-2">
                                        Baseado nos padrões da Receita Federal para depreciação de ativos
                                    </p>
                                </motion.div>

                                <motion.div
                                    className="flex items-center justify-between pt-6 border-t border-[#2c2c2c]"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3, delay: 0.4 }}
                                >
                                    <div className="text-sm w-1/3 text-[#8c8888]">
                                        Os patrimônios serão organizados nesta categoria
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
                                            disabled={isLoading}
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
                                                    Criar Categoria
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
}