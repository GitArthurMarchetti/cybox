"use client"

import { Modal, ModalHeader } from '@/components/ui/modal';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MdCategory } from 'react-icons/md';
import { FaSave } from 'react-icons/fa';
import { saveCategoria, getPadroesDepreciacao } from '@/app/services/categoria';
import { PadraoDepreciacaoType } from '@/lib/types/types';
import { toast } from 'sonner';

interface Category {
    id: number;
    name: string;
    observation: string;
    padrao_depreciacao_id?: number | null;
}

interface EditarCategoriaModalProps {
    isOpen: boolean;
    onClose: () => void;
    categoria: Category | null;
    departamentoId: string | number | null;
    onSuccess?: () => void;
}

export default function EditarCategoriaModal({ 
    isOpen, 
    onClose, 
    categoria,
    departamentoId,
    onSuccess 
}: EditarCategoriaModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [padroesDepreciacao, setPadroesDepreciacao] = useState<PadraoDepreciacaoType[]>([]);
    const [formData, setFormData] = useState({
        nome: '',
        descricao: '',
        padrao_depreciacao_id: ''
    });

    useEffect(() => {
        if (isOpen && categoria) {
            setFormData({
                nome: categoria.name || '',
                descricao: categoria.observation || '',
                padrao_depreciacao_id: categoria.padrao_depreciacao_id?.toString() || ''
            });
        }
    }, [isOpen, categoria]);

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
        if (!categoria) return;

        setIsLoading(true);

        try {
            const formDataToSend = new FormData(event.currentTarget);
            formDataToSend.append('id', categoria.id.toString());
            formDataToSend.append('id_departamento', departamentoId?.toString() || '');

            const resultado = await saveCategoria(formDataToSend);
            if (!resultado.success) {
                toast.error(resultado.error || 'Erro ao atualizar categoria');
                return;
            }

            toast.success("Categoria atualizada com sucesso!");
            onClose();
            if (onSuccess) onSuccess();
        } catch (error) {
            toast.error("Erro ao atualizar categoria");
        } finally {
            setIsLoading(false);
        }
    };

    if (!categoria) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl">
                        <ModalHeader
                            icone={<MdCategory size={20} />}
                            titulo="Editar Categoria"
                            subtitulo={<>Atualize as informações da categoria &quot;{categoria.name}&quot;</>}
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
                                        value={formData.nome}
                                        onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
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
                                        value={formData.descricao}
                                        onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
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
                                        value={formData.padrao_depreciacao_id}
                                        onChange={(e) => setFormData(prev => ({ ...prev, padrao_depreciacao_id: e.target.value }))}
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
                                    <div className="text-sm text-subtle">
                                        Atualize as informações desta categoria
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
                                                    Salvando...
                                                </>
                                            ) : (
                                                <>
                                                    <FaSave size={16} />
                                                    Salvar Alterações
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