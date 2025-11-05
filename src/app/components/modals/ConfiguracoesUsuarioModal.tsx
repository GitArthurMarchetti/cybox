'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose, MdPerson, MdEmail, MdLock, MdSave } from 'react-icons/md';
import { UserType } from '@/lib/types/types';
import { updateUser } from '@/app/services/user';
import { toast } from 'sonner';

interface ConfiguracoesUsuarioModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserType;
    onSuccess?: () => void;
}

export default function ConfiguracoesUsuarioModal({ isOpen, onClose, user, onSuccess }: ConfiguracoesUsuarioModalProps) {
    const [nome, setNome] = useState(user.nome);
    const [email, setEmail] = useState(user.email);
    const [senhaAtual, setSenhaAtual] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const isGoogleUser = !!user.google_id;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (novaSenha && novaSenha !== confirmarSenha) {
            toast.error('As senhas não coincidem');
            return;
        }

        if (novaSenha && novaSenha.length < 6) {
            toast.error('A nova senha deve ter pelo menos 6 caracteres');
            return;
        }

        setIsLoading(true);

        try {
            const data: any = {};

            if (nome !== user.nome) {
                data.nome = nome;
            }

            if (email !== user.email) {
                data.email = email;
            }

            if (novaSenha && !isGoogleUser) {
                data.senhaAtual = senhaAtual;
                data.novaSenha = novaSenha;
            }

            await updateUser(user.id as string, data);

            toast.success('Dados atualizados com sucesso!');

            setSenhaAtual('');
            setNovaSenha('');
            setConfirmarSenha('');

            if (onSuccess) {
                onSuccess();
            }

            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error: any) {
            toast.error(error.message || 'Erro ao atualizar dados');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setNome(user.nome);
        setEmail(user.email);
        setSenhaAtual('');
        setNovaSenha('');
        setConfirmarSenha('');
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                >
                    <motion.div
                        className="bg-[#1F1F1F] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border border-[#2c2c2c]"
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-[#2c2c2c] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#F6CF45] rounded-lg">
                                    <MdPerson className="text-black" size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Configurações da Conta</h2>
                                    <p className="text-[#8c8888] text-sm">Gerencie suas informações pessoais</p>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-2 hover:bg-[#2c2c2c] rounded-lg transition-colors duration-300 text-[#8c8888] hover:text-white"
                            >
                                <MdClose size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#b4b4b4] mb-2">
                                        Nome
                                    </label>
                                    <div className="relative">
                                        <MdPerson className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8c8888]" size={20} />
                                        <input
                                            type="text"
                                            value={nome}
                                            onChange={(e) => setNome(e.target.value)}
                                            className="w-full bg-[#2c2c2c] text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6CF45]/50"
                                            placeholder="Seu nome"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#b4b4b4] mb-2">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8c8888]" size={20} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-[#2c2c2c] text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6CF45]/50"
                                            placeholder="seu@email.com"
                                            required
                                        />
                                    </div>
                                </div>

                                {!isGoogleUser && (
                                    <>
                                        <div className="pt-4 border-t border-[#2c2c2c]">
                                            <h3 className="text-sm font-semibold text-white mb-4">Alterar Senha</h3>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-[#b4b4b4] mb-2">
                                                Senha Atual
                                            </label>
                                            <div className="relative">
                                                <MdLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8c8888]" size={20} />
                                                <input
                                                    type="password"
                                                    value={senhaAtual}
                                                    onChange={(e) => setSenhaAtual(e.target.value)}
                                                    className="w-full bg-[#2c2c2c] text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6CF45]/50"
                                                    placeholder="Digite sua senha atual"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-[#b4b4b4] mb-2">
                                                Nova Senha
                                            </label>
                                            <div className="relative">
                                                <MdLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8c8888]" size={20} />
                                                <input
                                                    type="password"
                                                    value={novaSenha}
                                                    onChange={(e) => setNovaSenha(e.target.value)}
                                                    className="w-full bg-[#2c2c2c] text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6CF45]/50"
                                                    placeholder="Digite a nova senha"
                                                />
                                            </div>
                                            <p className="text-xs text-[#8c8888] mt-1">Mínimo de 6 caracteres</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-[#b4b4b4] mb-2">
                                                Confirmar Nova Senha
                                            </label>
                                            <div className="relative">
                                                <MdLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8c8888]" size={20} />
                                                <input
                                                    type="password"
                                                    value={confirmarSenha}
                                                    onChange={(e) => setConfirmarSenha(e.target.value)}
                                                    className="w-full bg-[#2c2c2c] text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6CF45]/50"
                                                    placeholder="Confirme a nova senha"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {isGoogleUser && (
                                    <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                        <p className="text-sm text-blue-400">
                                            Você está logado com Google. A senha não pode ser alterada.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="flex-1 px-4 py-3 bg-[#2c2c2c] text-white rounded-lg hover:bg-[#353535] transition-colors duration-300"
                                    disabled={isLoading}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-[#F6CF45] text-black rounded-lg hover:bg-[#f7d665] transition-colors duration-300 flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                                            Salvando...
                                        </>
                                    ) : (
                                        <>
                                            <MdSave size={20} />
                                            Salvar Alterações
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
