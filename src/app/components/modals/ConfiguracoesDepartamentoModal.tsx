"use client"

import { Modal, ModalHeader } from '@/components/ui/modal';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCog, FaUsers, FaTrash, FaEdit, FaLink } from 'react-icons/fa';
import { MdSave } from 'react-icons/md';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { DepartamentoType } from '@/lib/types/types';
import { regenerarCodigoConvite, saveDepartamento } from '@/app/services/departamento';
import { MembroDepartamento } from '@/app/services/membros';
import { toast } from 'sonner';
import { useDemo } from '../demo/DemoContext';

const traduzirRole = (role: string | undefined | null) => {
    if (!role) return 'Member';
    
    switch (role.toLowerCase()) {
        case 'owner': return 'Owner';
        case 'admin': return 'Admin';
        case 'member': return 'Member';
        default: return 'Member';
    }
};

interface ConfiguracoesDepartamentoModalProps {
    isOpen: boolean;
    onClose: () => void;
    departamento: DepartamentoType | null;
    membros?: MembroDepartamento[];
    isAdmin?: boolean;
    isOwner?: boolean;
    onSuccess?: (departamentoAtualizado: DepartamentoType) => void;
    onDelete?: () => void;
}

function ConfiguracoesDepartamentoModal({
    isOpen,
    onClose,
    departamento,
    membros = [],
    isAdmin = false,
    isOwner = false,
    onSuccess,
    onDelete
}: ConfiguracoesDepartamentoModalProps) {
    const { blockIfDemo } = useDemo();
    const [activeTab, setActiveTab] = useState<'geral' | 'membros' | 'avancado'>('geral');
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        titulo: '',
        descricao: '',
        localizacao: '',
        codigo_convite: ''
    });

    useEffect(() => {
        if (isOpen && departamento) {
            setFormData({
                titulo: departamento.titulo || '',
                descricao: departamento.descricao || '',
                localizacao: departamento.localizacao || '',
                codigo_convite: departamento.codigo_convite || ''
            });
        }
    }, [isOpen, departamento]);

    if (!departamento) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAdmin) return;

        setIsLoading(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('id_departamentos', departamento.id_departamentos?.toString() || '');
            formDataToSend.append('titulo', formData.titulo);
            formDataToSend.append('descricao', formData.descricao);
            formDataToSend.append('localizacao', formData.localizacao);

            const resultado = await saveDepartamento(formDataToSend);
            if (!resultado.success) {
                toast.error(resultado.error || "Couldn't update the room");
                return;
            }

            const departamentoAtualizado: DepartamentoType = {
                ...departamento!,
                titulo: formData.titulo,
                descricao: formData.descricao,
                localizacao: formData.localizacao
            };

            toast.success('Room updated');
            onClose();
            if (onSuccess) onSuccess(departamentoAtualizado);
        } catch (error) {
            toast.error("Couldn't update the room");
        } finally {
            setIsLoading(false);
        }
    };

    const gerarNovoCodigoConvite = async () => {
        if (!isAdmin || blockIfDemo()) return;

        try {
            const novoCodigo = await regenerarCodigoConvite(Number(departamento.id_departamentos));
            setFormData(prev => ({ ...prev, codigo_convite: novoCodigo }));
            toast.success('New code created. The old one no longer works.');
            if (onSuccess) onSuccess({ ...departamento, codigo_convite: novoCodigo });
        } catch (error) {
            toast.error("Couldn't create a new code");
        }
    };

    const copiarCodigoConvite = async () => {
        try {
            await navigator.clipboard.writeText(formData.codigo_convite);
            toast.success('Invite code copied');
        } catch (error) {
            toast.error("Couldn't copy. Select the code and copy it manually.");
        }
    };

    const tabs = [
        { id: 'geral', label: 'General', icon: FaEdit },
        { id: 'membros', label: 'Members', icon: FaUsers },
        { id: 'avancado', label: 'Advanced', icon: FaCog }
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl sm:h-[80vh]">
                        
                        <ModalHeader
                            icone={<FaCog size={20} />}
                            titulo="Room settings"
                            subtitulo={<>{departamento.titulo}</>}
                            onClose={onClose}
                        />

                        <div className="flex min-h-0 flex-1 flex-col sm:flex-row">
                            
                            <div className="shrink-0 border-b border-line bg-[#1a1a1a] p-2 sm:w-56 sm:border-b-0 sm:border-r sm:p-4">
                                <div role="tablist" aria-label="Sections" className="flex gap-2 overflow-x-auto sm:flex-col">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            type="button"
                                            role="tab"
                                            aria-selected={activeTab === tab.id}
                                            onClick={() => setActiveTab(tab.id as 'geral' | 'avancado')}
                                            className={`flex shrink-0 items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 sm:w-full ${activeTab === tab.id
                                                ? 'bg-primary text-black'
                                                : 'text-subtle hover:text-white hover:bg-surface-2'
                                                }`}
                                        >
                                            <tab.icon size={16} />
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            
                            <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
                                {activeTab === 'geral' && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <h3 className="text-lg font-bold text-white mb-6">General</h3>

                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div>
                                                <label className="block text-sm text-muted mb-2">Room name</label>
                                                <input
                                                    type="text"
                                                    value={formData.titulo}
                                                    required
                                                    maxLength={255}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                                                    disabled={!isAdmin}
                                                    className="w-full bg-surface-2 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                                                    placeholder="Room name"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm text-muted mb-2">Description</label>
                                                <textarea
                                                    value={formData.descricao}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                                                    disabled={!isAdmin}
                                                    rows={4}
                                                    className="w-full bg-surface-2 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none disabled:opacity-50"
                                                    placeholder="What this department looks after"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm text-muted mb-2">Location</label>
                                                <input
                                                    type="text"
                                                    value={formData.localizacao}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, localizacao: e.target.value }))}
                                                    disabled={!isAdmin}
                                                    className="w-full bg-surface-2 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                                                    placeholder="e.g. Building A, 2nd floor"
                                                />
                                            </div>

                                            {isAdmin && (
                                                <div className="flex gap-3 pt-4">
                                                    <button
                                                        type="submit"
                                                        disabled={isLoading}
                                                        className="flex items-center gap-2 bg-primary text-black px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors duration-300 disabled:opacity-50"
                                                    >
                                                        {isLoading ? (
                                                            <>
                                                                <AiOutlineLoading3Quarters className="animate-spin h-4 w-4" />
                                                                Saving…
                                                            </>
                                                        ) : (
                                                            <>
                                                                <MdSave size={16} />
                                                                Save changes
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            )}
                                        </form>
                                    </motion.div>
                                )}

                                {activeTab === 'membros' && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-lg font-bold text-white">Room members</h3>
                                            <span className="bg-surface-2 text-white px-3 py-1 rounded-full text-sm">
                                                {membros.length} membros
                                            </span>
                                        </div>

                                        <div className="space-y-3">
                                            {membros.length > 0 ? membros.map((membro) => (
                                                <div key={membro.id} className="flex items-center justify-between bg-surface-2 rounded-lg p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-black font-bold">
                                                            {membro.nome.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="text-white font-medium">{membro.nome}</p>
                                                            <p className="text-subtle text-sm">{membro.email}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                                            membro.role === 'owner' ? 'bg-yellow-500 text-black' :
                                                            membro.role === 'admin' ? 'bg-blue-500 text-white' :
                                                            'bg-gray-500 text-white'
                                                        }`}>
                                                            {traduzirRole(membro.role || 'member')}
                                                        </span>
                                                    </div>
                                                </div>
                                            )) : (
                                                <div className="text-center py-8">
                                                    <FaUsers className="mx-auto text-subtle mb-2" size={32} />
                                                    <p className="text-subtle">No members to show.</p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'avancado' && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <h3 className="text-lg font-bold text-white mb-6">Advanced</h3>

                                        <div className="space-y-6">
                                            
                                            <div>
                                                <label className="block text-sm text-muted mb-2">Invite code</label>
                                                <div className="flex gap-3">
                                                    <input
                                                        type="text"
                                                        value={formData.codigo_convite}
                                                        readOnly
                                                        className="flex-1 bg-surface-2 text-white px-4 py-3 rounded-lg focus:outline-none"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={copiarCodigoConvite}
                                                        className="px-4 py-3 bg-surface-2 text-primary rounded-lg hover:bg-surface-3 transition-colors duration-300"
                                                    >
                                                        <FaLink size={16} />
                                                    </button>
                                                    {isAdmin && (
                                                        <button
                                                            type="button"
                                                            onClick={gerarNovoCodigoConvite}
                                                            className="px-4 py-3 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors duration-300"
                                                        >
                                                            New code
                                                        </button>
                                                    )}
                                                </div>
                                                <p className="text-xs text-subtle mt-1">
                                                    Share this code to let people join the room
                                                </p>
                                            </div>

                                            
                                            {isOwner && (
                                                <div className="border border-red-500/20 rounded-lg p-6 bg-red-500/5">
                                                    <h4 className="text-red-400 font-medium mb-3 flex items-center gap-2">
                                                        <FaTrash size={16} />
                                                        Danger zone
                                                    </h4>
                                                    <p className="text-subtle text-sm mb-4">
                                                        Only the owner can delete a room. This can&apos;t be undone.
                                                    </p>
                                                    <button
                                                        onClick={onDelete}
                                                        className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-300"
                                                    >
                                                        <FaTrash size={16} />
                                                        Delete room
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </Modal>
    );
}

export default ConfiguracoesDepartamentoModal;