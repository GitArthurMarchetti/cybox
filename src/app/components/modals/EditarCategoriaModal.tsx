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
                toast.error(resultado.error || "Couldn't update the category");
                return;
            }

            toast.success("Category updated");
            onClose();
            if (onSuccess) onSuccess();
        } catch (error) {
            toast.error("Couldn't update the category");
        } finally {
            setIsLoading(false);
        }
    };

    if (!categoria) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl">
                        <ModalHeader
                            icone={<MdCategory size={20} />}
                            titulo="Edit category"
                            subtitulo={<>Update &quot;{categoria.name}&quot;</>}
                            onClose={onClose}
                        />

                        <div className="p-8">
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                >
                                    <label className="block text-sm font-medium text-muted mb-2">Category name</label>
                                    <input
                                        autoComplete='off'
                                        type="text"
                                        name="nome"
                                        required
                                        value={formData.nome}
                                        onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                                        className="w-full bg-surface-2 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder-subtle"
                                        placeholder="e.g. Laptops, Furniture, Vehicles"
                                    />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.2 }}
                                >
                                    <label className="block text-sm font-medium text-muted mb-2">Description</label>
                                    <textarea
                                        name="descricao"
                                        value={formData.descricao}
                                        onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                                        rows={4}
                                        className="w-full bg-surface-2 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none placeholder-subtle"
                                        placeholder="Anything worth noting about this category"
                                    ></textarea>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.3 }}
                                >
                                    <label className="block text-sm font-medium text-muted mb-2">Depreciation preset</label>
                                    <select
                                        name="padrao_depreciacao_id"
                                        value={formData.padrao_depreciacao_id}
                                        onChange={(e) => setFormData(prev => ({ ...prev, padrao_depreciacao_id: e.target.value }))}
                                        className="w-full bg-surface-2 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    >
                                        <option value="">Pick a preset (optional)</option>
                                        {padroesDepreciacao.map(padrao => (
                                            <option key={padrao.id} value={padrao.id}>
                                                {padrao.categoria} · {Number(padrao.taxa_anual_percent)}% per year ({padrao.vida_util_anos} years)
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-subtle mt-2">
                                        Presets follow standard annual depreciation rates for each asset type
                                    </p>
                                </motion.div>

                                <motion.div 
                                    className="flex items-center justify-between pt-6 border-t border-line"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3, delay: 0.4 }}
                                >
                                    <div className="text-sm text-subtle">
                                        Changes apply to this category only
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            className="px-6 py-3 text-muted hover:text-white hover:bg-surface-2 rounded-lg transition-all duration-300"
                                            onClick={onClose}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="px-6 py-3 bg-primary text-black font-medium rounded-lg hover:bg-primary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                                                    Saving…
                                                </>
                                            ) : (
                                                <>
                                                    <FaSave size={16} />
                                                    Save changes
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