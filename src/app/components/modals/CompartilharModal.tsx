'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShare, FaCopy, FaCheck, FaEnvelope, FaPlus, FaTimes } from 'react-icons/fa';
import { toast } from 'sonner';
import { DepartamentoType } from '@/lib/types/types';

interface CompartilharModalProps {
    isOpen: boolean;
    onClose: () => void;
    departamento: DepartamentoType | null;
    onInvite?: (emails: string[]) => Promise<void>;
}

export function CompartilharModal({ isOpen, onClose, departamento, onInvite }: CompartilharModalProps) {
    const [copied, setCopied] = useState(false);
    const [emails, setEmails] = useState<string[]>(['']);
    const [isLoading, setIsLoading] = useState(false);
    const [shareLink, setShareLink] = useState('');

    // Definir o link de compartilhamento apenas no cliente
    useEffect(() => {
        if (typeof window !== 'undefined' && departamento) {
            const link = departamento.codigo_convite
                ? `${window.location.origin}/convite/${departamento.codigo_convite}`
                : `${window.location.origin}/convite/${departamento.id_departamentos}`;
            setShareLink(link);
        }
    }, [departamento]);

    if (!departamento) return null;

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareLink);
            setCopied(true);
            toast.success('Link copiado para a área de transferência!');
            setTimeout(() => setCopied(false), 3000);
        } catch (error) {
            toast.error('Erro ao copiar link');
        }
    };

    const handleAddEmailField = () => {
        setEmails([...emails, '']);
    };

    const handleRemoveEmailField = (index: number) => {
        setEmails(emails.filter((_, i) => i !== index));
    };

    const handleEmailChange = (index: number, value: string) => {
        const newEmails = [...emails];
        newEmails[index] = value;
        setEmails(newEmails);
    };

    const handleInvite = async () => {
        const validEmails = emails.filter(email => email.trim() !== '' && email.includes('@'));

        if (validEmails.length === 0) {
            toast.error('Por favor, insira pelo menos um email válido');
            return;
        }

        setIsLoading(true);

        try {
            if (onInvite) {
                await onInvite(validEmails);
                toast.success(`Convites enviados para ${validEmails.length} pessoa(s)`);
                setEmails(['']);
                onClose();
            }
        } catch (error) {
            toast.error('Erro ao enviar convites');
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
                        className="bg-[#1a1a1a] rounded-xl w-full max-w-lg overflow-hidden"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-[#2c2c2c]">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#2c2c2c] rounded-lg flex items-center justify-center text-[#F6CF45]">
                                        <FaShare size={18} />
                                    </div>
                                    <h2 className="text-xl font-bold">Compartilhar Departamento</h2>
                                </div>
                                <button
                                    className="text-[#8c8888] hover:text-white transition-colors duration-300"
                                    onClick={onClose}
                                >
                                    <FaTimes size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            <div>
                                <h3 className="text-sm font-medium text-[#b4b4b4] mb-3">Compartilhar com link</h3>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={shareLink}
                                        readOnly
                                        className="flex-1 bg-[#2c2c2c] text-white px-4 py-3 rounded-lg focus:outline-none"
                                    />
                                    <button
                                        onClick={handleCopyLink}
                                        className="px-4 py-3 bg-[#F6CF45] text-black rounded-lg hover:bg-[#F6CF45]/90 transition-all duration-300 flex items-center gap-2"
                                    >
                                        {copied ? <FaCheck size={16} /> : <FaCopy size={16} />}
                                        {copied ? 'Copiado!' : 'Copiar'}
                                    </button>
                                </div>
                                <p className="text-xs text-[#8c8888] mt-2">
                                    As pessoas com este link de convite poderão solicitar acesso ao departamento. O link é único e seguro.
                                </p>
                            </div>

                            <div className="border-t border-[#2c2c2c] pt-6">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-medium text-[#b4b4b4]">Convidar pessoas por email</h3>
                                    <button
                                        onClick={handleAddEmailField}
                                        className="text-[#F6CF45] hover:text-white transition-colors duration-300 flex items-center gap-1 text-sm"
                                    >
                                        <FaPlus size={12} /> Adicionar email
                                    </button>
                                </div>

                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {emails.map((email, index) => (
                                        <div key={index} className="flex gap-2">
                                            <div className="flex-1 relative">
                                                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8c8888]" size={14} />
                                                <input
                                                    type="email"
                                                    placeholder="Digite o email"
                                                    value={email}
                                                    onChange={(e) => handleEmailChange(index, e.target.value)}
                                                    className="w-full bg-[#2c2c2c] text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6CF45]/50"
                                                />
                                            </div>
                                            {emails.length > 1 && (
                                                <button
                                                    onClick={() => handleRemoveEmailField(index)}
                                                    className="px-3 text-red-500 hover:text-red-400 transition-colors duration-300"
                                                >
                                                    <FaTimes size={16} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <p className="text-xs text-[#8c8888] mt-2">
                                    As pessoas convidadas receberão um convite interno no sistema. Elas devem estar cadastradas na plataforma.
                                </p>
                            </div>
                        </div>

                        <div className="p-6 border-t border-[#2c2c2c] flex items-center justify-end gap-3">
                            <button
                                type="button"
                                className="px-4 py-2 text-[#b4b4b4] hover:text-white transition-colors duration-300"
                                onClick={onClose}
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleInvite}
                                disabled={isLoading || emails.every(e => e.trim() === '')}
                                className="px-4 py-2 bg-[#F6CF45] text-black font-medium rounded-lg hover:bg-[#F6CF45]/90 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                                        Enviando...
                                    </>
                                ) : (
                                    <>
                                        <FaEnvelope size={14} />
                                        Enviar convites
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}