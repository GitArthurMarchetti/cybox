'use client'

import { Modal, ModalHeader } from '@/components/ui/modal';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MdBusiness } from 'react-icons/md';
import { FaPlus } from 'react-icons/fa';
import { saveDepartamento } from '../../services/departamento';
import { toast } from 'sonner';

interface CreateDepartmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const CreateDepartmentModal = ({ isOpen, onClose, onSuccess }: CreateDepartmentModalProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        titulo: '',
        descricao: '',
        localizacao: ''
    });

    useEffect(() => {
        if (!isOpen) setFormData({ titulo: '', descricao: '', localizacao: '' });
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.titulo.trim()) {
            toast.error('Give the room a name');
            return;
        }

        setIsLoading(true);
        try {
            const data = new FormData();
            data.append('titulo', formData.titulo.trim());
            data.append('descricao', formData.descricao.trim());
            data.append('localizacao', formData.localizacao.trim());

            const resultado = await saveDepartamento(data);
            if (!resultado.success) {
                toast.error(resultado.error || "Couldn't create the room");
                return;
            }
            toast.success('Room created');
            onClose();
            if (onSuccess) onSuccess();
        } catch (error) {
            toast.error("Couldn't create the room");
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl">
                        <ModalHeader
                            icone={<MdBusiness size={20} />}
                            titulo="New room"
                            subtitulo="One room per department keeps every asset in its place"
                            onClose={onClose}
                        />

                        <div className="p-8">
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                >
                                    <label className="block text-sm font-medium text-muted mb-2">
                                        Room name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        maxLength={100}
                                        className="w-full bg-surface-2 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder-subtle"
                                        placeholder="e.g. IT, Operations, Warehouse"
                                        value={formData.titulo}
                                        onChange={(e) => handleInputChange('titulo', e.target.value)}
                                    />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.2 }}
                                >
                                    <label className="block text-sm font-medium text-muted mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        rows={4}
                                        maxLength={500}
                                        className="w-full bg-surface-2 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none placeholder-subtle"
                                        placeholder="What does this department look after?"
                                        value={formData.descricao}
                                        onChange={(e) => handleInputChange('descricao', e.target.value)}
                                    />
                                    <p className="text-xs text-subtle mt-1">
                                        {formData.descricao.length}/500 caracteres
                                    </p>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.3 }}
                                >
                                    <label className="block text-sm font-medium text-muted mb-2">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        maxLength={200}
                                        className="w-full bg-surface-2 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder-subtle"
                                        placeholder="e.g. Building A, 2nd floor"
                                        value={formData.localizacao}
                                        onChange={(e) => handleInputChange('localizacao', e.target.value)}
                                    />
                                </motion.div>


                                <motion.div
                                    className="flex items-center justify-between pt-6 border-t border-line"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3, delay: 0.5 }}
                                >
                                    <div className="text-sm w-1/3 text-subtle">
                                        You&apos;ll be the owner of this room
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
                                            disabled={isLoading || !formData.titulo.trim()}
                                            className="px-6 py-3 bg-primary text-black font-medium rounded-lg hover:bg-primary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                                                    Creating…
                                                </>
                                            ) : (
                                                <>
                                                    <FaPlus size={16} />
                                                    Create room
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            </form>
                        </div>
                    </Modal>
    );
};

export default CreateDepartmentModal;