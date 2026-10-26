'use client'

import { Modal, ModalHeader } from '@/components/ui/modal';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MdGroup, MdEmail } from 'react-icons/md';
import { FaUserTie, FaUser, FaCrown } from 'react-icons/fa';
import { DepartamentoType } from '@/lib/types/types';
import { getMembrosPerDepartamento, MembroDepartamento } from '@/app/services/membros';

interface MembrosModalProps {
    isOpen: boolean;
    onClose: () => void;
    departamento: DepartamentoType | null;
    membros?: MembroDepartamento[];
}

export default function MembrosModal({ isOpen, onClose, departamento, membros: membrosProps }: MembrosModalProps) {
    const [membros, setMembros] = useState<MembroDepartamento[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const carregarMembros = async () => {
            if (!departamento?.id_departamentos || !isOpen) return;

            if (membrosProps) {
                setMembros(membrosProps);
                return;
            }

            setIsLoading(true);
            try {
                const membrosData = await getMembrosPerDepartamento(departamento.id_departamentos);
                setMembros(membrosData);
            } catch (error) {
            } finally {
                setIsLoading(false);
            }
        };

        carregarMembros();
    }, [departamento?.id_departamentos, isOpen, membrosProps]);

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
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl">
                        <ModalHeader
                            icone={<MdGroup size={20} />}
                            titulo="Membros do Departamento"
                            subtitulo={<>{departamento.titulo} • {membros.length} membros</>}
                            onClose={onClose}
                        />

                        <div className="p-6">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                    <span className="ml-3 text-subtle">Carregando membros...</span>
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-96 overflow-y-auto">
                                    {membros.length > 0 ? membros.map((membro, index) => (
                                    <motion.div
                                        key={membro.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        className="flex items-center justify-between p-4 bg-surface-2 rounded-lg hover:bg-[#333333] transition-colors duration-200"
                                    >
                                        <div className="flex items-center gap-4">
                                            
                                            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-black font-bold">
                                                {membro.nome.charAt(0)}
                                            </div>
                                            
                                            
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-white font-medium">{membro.nome}</h3>
                                                    {getRoleIcon(membro.role)}
                                                </div>
                                                <div className="flex items-center gap-1 text-sm text-subtle">
                                                    <MdEmail size={14} />
                                                    {membro.email}
                                                </div>
                                                <p className="text-xs text-subtle">
                                                    Último acesso: {membro.ultimo_login ? new Date(membro.ultimo_login).toLocaleDateString('pt-BR') : 'Nunca'}
                                                </p>
                                            </div>
                                        </div>

                                        
                                        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(membro.role)}`}>
                                            {getRoleText(membro.role)}
                                        </div>
                                    </motion.div>
                                    )) : (
                                        <div className="text-center py-8">
                                            <MdGroup className="mx-auto text-subtle mb-4" size={48} />
                                            <p className="text-subtle">Nenhum membro encontrado</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            
                            {!isLoading && membros.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-line">
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <div className="text-2xl font-bold text-white">{membros.filter(m => m.role === 'owner').length}</div>
                                        <div className="text-sm text-subtle">Proprietários</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-white">{membros.filter(m => m.role === 'admin').length}</div>
                                        <div className="text-sm text-subtle">Administradores</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-white">{membros.filter(m => m.role === 'member').length}</div>
                                        <div className="text-sm text-subtle">Membros</div>
                                    </div>
                                </div>
                                </div>
                            )}
                        </div>
                    </Modal>
    );
}