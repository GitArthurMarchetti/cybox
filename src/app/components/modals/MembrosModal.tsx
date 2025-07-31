'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose, MdGroup, MdPerson, MdEmail, MdAdminPanelSettings } from 'react-icons/md';
import { FaUserTie, FaUser, FaCrown } from 'react-icons/fa';
import { DepartamentoType } from '@/lib/types/types';
import { getMembrosPerDepartamento, MembroDepartamento } from '@/app/services/membros';

interface MembrosModalProps {
    isOpen: boolean;
    onClose: () => void;
    departamento: DepartamentoType | null;
}

export default function MembrosModal({ isOpen, onClose, departamento }: MembrosModalProps) {
    const [membros, setMembros] = useState<MembroDepartamento[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const carregarMembros = async () => {
            if (!departamento?.id_departamentos || !isOpen) return;
            
            setIsLoading(true);
            try {
                const membrosData = await getMembrosPerDepartamento(departamento.id_departamentos);
                setMembros(membrosData);
            } catch (error) {
                console.error('Erro ao carregar membros:', error);
            } finally {
                setIsLoading(false);
            }
        };

        carregarMembros();
    }, [departamento?.id_departamentos, isOpen]);

    if (!departamento) return null;

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'owner':
                return <FaCrown className="text-yellow-400" size={16} />;
            case 'admin':
                return <FaUserTie className="text-blue-400" size={16} />;
            default:
                return <FaUser className="text-gray-400" size={16} />;
        }
    };

    const getRoleText = (role: string) => {
        switch (role) {
            case 'owner':
                return 'Proprietário';
            case 'admin':
                return 'Administrador';
            default:
                return 'Membro';
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'owner':
                return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'admin':
                return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            default:
                return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
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
                                    <MdGroup className="text-black" size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Membros do Departamento</h2>
                                    <p className="text-[#8c8888] text-sm">{departamento.titulo} • {membros.length} membros</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-[#2c2c2c] rounded-lg transition-colors duration-300 text-[#8c8888] hover:text-white"
                            >
                                <MdClose size={24} />
                            </button>
                        </div>

                        <div className="p-6">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F6CF45]"></div>
                                    <span className="ml-3 text-[#8c8888]">Carregando membros...</span>
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-96 overflow-y-auto">
                                    {membros.length > 0 ? membros.map((membro, index) => (
                                    <motion.div
                                        key={membro.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        className="flex items-center justify-between p-4 bg-[#2c2c2c] rounded-lg hover:bg-[#333333] transition-colors duration-200"
                                    >
                                        <div className="flex items-center gap-4">
                                            {/* Avatar */}
                                            <div className="w-12 h-12 bg-[#F6CF45] rounded-full flex items-center justify-center text-black font-bold">
                                                {membro.nome.charAt(0)}
                                            </div>
                                            
                                            {/* Info do membro */}
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-white font-medium">{membro.nome}</h3>
                                                    {getRoleIcon(membro.role)}
                                                </div>
                                                <div className="flex items-center gap-1 text-sm text-[#8c8888]">
                                                    <MdEmail size={14} />
                                                    {membro.email}
                                                </div>
                                                <p className="text-xs text-[#6c6c6c]">
                                                    Último acesso: {membro.ultimo_login ? new Date(membro.ultimo_login).toLocaleDateString('pt-BR') : 'Nunca'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Badge do role */}
                                        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(membro.role)}`}>
                                            {getRoleText(membro.role)}
                                        </div>
                                    </motion.div>
                                    )) : (
                                        <div className="text-center py-8">
                                            <MdGroup className="mx-auto text-[#8c8888] mb-4" size={48} />
                                            <p className="text-[#8c8888]">Nenhum membro encontrado</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Footer com estatísticas */}
                            {!isLoading && membros.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-[#2c2c2c]">
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <div className="text-2xl font-bold text-white">{membros.filter(m => m.role === 'owner').length}</div>
                                        <div className="text-sm text-[#8c8888]">Proprietários</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-white">{membros.filter(m => m.role === 'admin').length}</div>
                                        <div className="text-sm text-[#8c8888]">Administradores</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-white">{membros.filter(m => m.role === 'member').length}</div>
                                        <div className="text-sm text-[#8c8888]">Membros</div>
                                    </div>
                                </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}