"use client"

import { Modal, ModalHeader } from '@/components/ui/modal';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MdCategory } from 'react-icons/md';
import { FaPlus } from 'react-icons/fa';
import { saveCategoria, getPadroesDepreciacao } from '@/app/services/categoria';
import { PadraoDepreciacaoType } from '@/lib/types/types';
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
    const [padroesDepreciacao, setPadroesDepreciacao] = useState<PadraoDepreciacaoType[]>([]);

    useEffect(() => {
        if (isOpen) {
            const carregarPadroes = async () => {
                try {
                    const padroes = await getPadroesDepreciacao();
                    setPadroesDepreciacao(padroes);
                } catch (error) {
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

            const resultado = await saveCategoria(formData);
            if (!resultado.success) {
                toast.error(resultado.error || 'Erro ao criar categoria');
                return;
            }

            toast.success("Categoria criada com sucesso!");
            onClose();
            if (onSuccess) onSuccess();
        } catch (error) {
            toast.error("Erro ao criar categoria");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl">
                        <ModalHeader
                            icone={<MdCategory size={20} />}
                            titulo="Nova Categoria"
                            subtitulo="Organize seus patrimônios em categorias"
                            onClose={onClose}
                        />

                        <div className="p-8">
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                >
                                    <label className="block text-sm font-medium text-muted mb-2">Nome da categoria</label>
                                    <input
                                        autoComplete='off'
                                        type="text"
                                        name="nome"
                                        required
                                        className="w-full bg-surface-2 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder-subtle"
                                        placeholder="Ex: Notebooks, Mobiliário, Veículos..."
                                    />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.2 }}
                                >
                                    <label className="block text-sm font-medium text-muted mb-2">Descrição</label>
                                    <textarea
                                        name="descricao"
                                        rows={4}
                                        className="w-full bg-surface-2 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none placeholder-subtle"
                                        placeholder="Adicione uma descrição ou observação sobre esta categoria..."
                                    ></textarea>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.3 }}
                                >
                                    <label className="block text-sm font-medium text-muted mb-2">Padrão de Depreciação</label>
                                    <select
                                        name="padrao_depreciacao_id"
                                        className="w-full bg-surface-2 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    >
                                        <option value="">Selecione um padrão (opcional)</option>
                                        {padroesDepreciacao.map(padrao => (
                                            <option key={padrao.id} value={padrao.id}>
                                                {padrao.categoria} - {padrao.taxa_anual_percent}% a.a. ({padrao.vida_util_anos} anos)
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-subtle mt-2">
                                        Baseado nos padrões da Receita Federal para depreciação de ativos
                                    </p>
                                </motion.div>

                                <motion.div
                                    className="flex items-center justify-between pt-6 border-t border-line"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3, delay: 0.4 }}
                                >
                                    <div className="text-sm w-1/3 text-subtle">
                                        Os patrimônios serão organizados nesta categoria
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            className="px-6 py-3 text-muted hover:text-white hover:bg-surface-2 rounded-lg transition-all duration-300"
                                            onClick={onClose}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="px-6 py-3 bg-primary text-black font-medium rounded-lg hover:bg-primary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                    </Modal>
    );
}