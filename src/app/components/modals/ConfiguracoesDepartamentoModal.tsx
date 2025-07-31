"use client"

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCog, FaUsers, FaTrash, FaEdit, FaLink } from 'react-icons/fa';
import { MdClose, MdSave } from 'react-icons/md';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { DepartamentoType, UserType } from '@/lib/types/types';
import { saveDepartamento } from '@/app/services/departamento';
import { MembroDepartamento } from '@/app/services/membros';
import { toast } from 'sonner';

// Função para traduzir roles
const traduzirRole = (role: string | undefined | null) => {
    if (!role) return 'Membro';
    
    switch (role.toLowerCase()) {
        case 'owner': return 'Proprietário';
        case 'admin': return 'Administrador';
        case 'member': return 'Membro';
        default: return 'Membro';
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
    const [activeTab, setActiveTab] = useState<'geral' | 'membros' | 'avancado'>('geral');
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        titulo: '',
        descricao: '',
        localizacao: '',
        codigo_convite: ''
    });

    // Inicializar dados do formulário
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

            await saveDepartamento(formDataToSend, ''); // userId não é usado para updates

            // Criar o objeto departamento atualizado
            const departamentoAtualizado: DepartamentoType = {
                ...departamento!,
                titulo: formData.titulo,
                descricao: formData.descricao,
                localizacao: formData.localizacao
            };

            toast.success('Departamento atualizado com sucesso!');
            onClose();
            if (onSuccess) onSuccess(departamentoAtualizado);
        } catch (error) {
            toast.error('Erro ao atualizar departamento');
            console.error('Erro ao atualizar departamento:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const gerarNovoCodigoConvite = () => {
        const novocodigo = `DEPT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        setFormData(prev => ({ ...prev, codigo_convite: novocodigo }));
        toast.info('Novo código de convite gerado!');
    };

    const copiarCodigoConvite = () => {
        navigator.clipboard.writeText(formData.codigo_convite);
        toast.success('Código de convite copiado!');
    };

    const tabs = [
        { id: 'geral', label: 'Geral', icon: FaEdit },
        { id: 'membros', label: 'Membros', icon: FaUsers },
        { id: 'avancado', label: 'Avançado', icon: FaCog }
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center  justify-center z-50 px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="bg-[#1F1F1F] rounded-2xl w-full  max-w-4xl h-[80vh] overflow-hidden shadow-2xl border border-[#2c2c2c]"
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-[#2c2c2c] flex items-center justify-between h-28">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#F6CF45] rounded-lg">
                                    <FaCog className="text-black" size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Configurações do Departamento</h2>
                                    <p className="text-[#8c8888] text-sm">{departamento.titulo}</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-[#2c2c2c] rounded-lg transition-colors duration-300 text-[#8c8888] hover:text-white"
                            >
                                <MdClose size={24} />
                            </button>
                        </div>

                        <div className="flex h-[calc(80vh-112px)]">
                            {/* Sidebar com tabs */}
                            <div className="w-64 bg-[#1a1a1a] border-r border-[#2c2c2c] p-4">
                                <div className="space-y-2">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id as any)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${activeTab === tab.id
                                                ? 'bg-[#F6CF45] text-black'
                                                : 'text-[#8c8888] hover:text-white hover:bg-[#2c2c2c]'
                                                }`}
                                        >
                                            <tab.icon size={16} />
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Conteúdo das tabs */}
                            <div className="flex-1 p-6 overflow-y-auto">
                                {activeTab === 'geral' && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <h3 className="text-lg font-bold text-white mb-6">Informações Gerais</h3>

                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div>
                                                <label className="block text-sm text-[#b4b4b4] mb-2">Nome do Departamento</label>
                                                <input
                                                    type="text"
                                                    value={formData.titulo}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                                                    disabled={!isAdmin}
                                                    className="w-full bg-[#2c2c2c] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6CF45]/50 disabled:opacity-50"
                                                    placeholder="Nome do departamento"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm text-[#b4b4b4] mb-2">Descrição</label>
                                                <textarea
                                                    value={formData.descricao}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                                                    disabled={!isAdmin}
                                                    rows={4}
                                                    className="w-full bg-[#2c2c2c] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6CF45]/50 resize-none disabled:opacity-50"
                                                    placeholder="Descrição do departamento"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm text-[#b4b4b4] mb-2">Localização</label>
                                                <input
                                                    type="text"
                                                    value={formData.localizacao}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, localizacao: e.target.value }))}
                                                    disabled={!isAdmin}
                                                    className="w-full bg-[#2c2c2c] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6CF45]/50 disabled:opacity-50"
                                                    placeholder="Localização física"
                                                />
                                            </div>

                                            {isAdmin && (
                                                <div className="flex gap-3 pt-4">
                                                    <button
                                                        type="submit"
                                                        disabled={isLoading}
                                                        className="flex items-center gap-2 bg-[#F6CF45] text-black px-6 py-3 rounded-lg hover:bg-[#F6CF45]/90 transition-colors duration-300 disabled:opacity-50"
                                                    >
                                                        {isLoading ? (
                                                            <>
                                                                <AiOutlineLoading3Quarters className="animate-spin h-4 w-4" />
                                                                Salvando...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <MdSave size={16} />
                                                                Salvar Alterações
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
                                            <h3 className="text-lg font-bold text-white">Membros do Departamento</h3>
                                            <span className="bg-[#2c2c2c] text-white px-3 py-1 rounded-full text-sm">
                                                {membros.length} membros
                                            </span>
                                        </div>

                                        <div className="space-y-3">
                                            {membros.length > 0 ? membros.map((membro) => (
                                                <div key={membro.id} className="flex items-center justify-between bg-[#2c2c2c] rounded-lg p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-[#F6CF45] rounded-full flex items-center justify-center text-black font-bold">
                                                            {membro.nome.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="text-white font-medium">{membro.nome}</p>
                                                            <p className="text-[#8c8888] text-sm">{membro.email}</p>
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
                                                    <FaUsers className="mx-auto text-[#8c8888] mb-2" size={32} />
                                                    <p className="text-[#8c8888]">Carregando membros...</p>
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
                                        <h3 className="text-lg font-bold text-white mb-6">Configurações Avançadas</h3>

                                        <div className="space-y-6">
                                            {/* Código de convite */}
                                            <div>
                                                <label className="block text-sm text-[#b4b4b4] mb-2">Código de Convite</label>
                                                <div className="flex gap-3">
                                                    <input
                                                        type="text"
                                                        value={formData.codigo_convite}
                                                        readOnly
                                                        className="flex-1 bg-[#2c2c2c] text-white px-4 py-3 rounded-lg focus:outline-none"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={copiarCodigoConvite}
                                                        className="px-4 py-3 bg-[#2c2c2c] text-[#F6CF45] rounded-lg hover:bg-[#3c3c3c] transition-colors duration-300"
                                                    >
                                                        <FaLink size={16} />
                                                    </button>
                                                    {isAdmin && (
                                                        <button
                                                            type="button"
                                                            onClick={gerarNovoCodigoConvite}
                                                            className="px-4 py-3 bg-[#F6CF45] text-black rounded-lg hover:bg-[#F6CF45]/90 transition-colors duration-300"
                                                        >
                                                            Gerar Novo
                                                        </button>
                                                    )}
                                                </div>
                                                <p className="text-xs text-[#8c8888] mt-1">
                                                    Use este código para convidar novos membros ao departamento
                                                </p>
                                            </div>

                                            {/* Zona de perigo - apenas para owners */}
                                            {isOwner && (
                                                <div className="border border-red-500/20 rounded-lg p-6 bg-red-500/5">
                                                    <h4 className="text-red-400 font-medium mb-3 flex items-center gap-2">
                                                        <FaTrash size={16} />
                                                        Zona de Perigo
                                                    </h4>
                                                    <p className="text-[#8c8888] text-sm mb-4">
                                                        Apenas proprietários podem excluir departamentos. Esta ação é irreversível.
                                                    </p>
                                                    <button
                                                        onClick={onDelete}
                                                        className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-300"
                                                    >
                                                        <FaTrash size={16} />
                                                        Excluir Departamento
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default ConfiguracoesDepartamentoModal;