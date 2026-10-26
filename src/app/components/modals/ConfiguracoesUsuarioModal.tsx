'use client'

import { Modal, ModalHeader } from '@/components/ui/modal';
import React, { useEffect, useState } from 'react';
import { MdPerson, MdEmail, MdLock, MdSave } from 'react-icons/md';
import { UserType } from '@/lib/types/types';
import { getMinhaConta, updateUser } from '@/app/services/user';
import ReenviarVerificacao from '@/app/components/Invite/ReenviarVerificacao';
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

    const [conta, setConta] = useState<Awaited<ReturnType<typeof getMinhaConta>>>(null);

    useEffect(() => {
        if (!isOpen) return;
        getMinhaConta().then(dados => {
            setConta(dados);
            if (dados) {
                setNome(dados.nome);
                setEmail(dados.email);
            }
        });
    }, [isOpen]);

    const nomeAtual = conta?.nome ?? user.nome;
    const emailAtual = conta?.email ?? user.email;
    const isGoogleUser = conta ? !conta.temSenha : false;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (novaSenha && novaSenha !== confirmarSenha) {
            toast.error('As senhas não coincidem');
            return;
        }

        if (novaSenha && novaSenha.length < 8) {
            toast.error('A nova senha deve ter pelo menos 8 caracteres');
            return;
        }

        setIsLoading(true);

        try {
            const data: any = {};

            if (nome !== nomeAtual) {
                data.nome = nome;
            }

            if (email !== emailAtual) {
                data.email = email;
            }

            if (novaSenha && !isGoogleUser) {
                data.senhaAtual = senhaAtual;
                data.novaSenha = novaSenha;
            }

            const resultado = await updateUser(data);

            if (!resultado.success) {
                toast.error(resultado.error || 'Erro ao atualizar dados');
                return;
            }

            toast.success(resultado.message);

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
        <Modal isOpen={isOpen} onClose={handleClose} className="max-w-2xl">
                        <ModalHeader
                            icone={<MdPerson size={20} />}
                            titulo="Configurações da Conta"
                            subtitulo="Gerencie suas informações pessoais"
                            onClose={handleClose}
                        />

                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-muted mb-2">
                                        Nome
                                    </label>
                                    <div className="relative">
                                        <MdPerson className="absolute left-3 top-1/2 transform -translate-y-1/2 text-subtle" size={20} />
                                        <input
                                            type="text"
                                            value={nome}
                                            onChange={(e) => setNome(e.target.value)}
                                            className="w-full bg-surface-2 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            placeholder="Seu nome"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-muted mb-2">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-subtle" size={20} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-surface-2 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            placeholder="seu@email.com"
                                            required
                                        />
                                    </div>
                                </div>

                                {!isGoogleUser && (
                                    <>
                                        <div className="pt-4 border-t border-line">
                                            <h3 className="text-sm font-semibold text-white mb-4">Alterar Senha</h3>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-muted mb-2">
                                                Senha Atual
                                            </label>
                                            <div className="relative">
                                                <MdLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-subtle" size={20} />
                                                <input
                                                    type="password"
                                                    value={senhaAtual}
                                                    onChange={(e) => setSenhaAtual(e.target.value)}
                                                    className="w-full bg-surface-2 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                    placeholder="Digite sua senha atual"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-muted mb-2">
                                                Nova Senha
                                            </label>
                                            <div className="relative">
                                                <MdLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-subtle" size={20} />
                                                <input
                                                    type="password"
                                                    value={novaSenha}
                                                    onChange={(e) => setNovaSenha(e.target.value)}
                                                    className="w-full bg-surface-2 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                    placeholder="Digite a nova senha"
                                                />
                                            </div>
                                            <p className="text-xs text-subtle mt-1">Mínimo de 8 caracteres</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-muted mb-2">
                                                Confirmar Nova Senha
                                            </label>
                                            <div className="relative">
                                                <MdLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-subtle" size={20} />
                                                <input
                                                    type="password"
                                                    value={confirmarSenha}
                                                    onChange={(e) => setConfirmarSenha(e.target.value)}
                                                    className="w-full bg-surface-2 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                    placeholder="Confirme a nova senha"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {isGoogleUser && (
                                    <div className="rounded-lg border border-line bg-surface-2 p-4">
                                        <p className="text-sm text-muted">
                                            Sua conta entra com o Google e não tem senha. Para criar uma, use
                                            &quot;Esqueceu a senha?&quot; na tela de login.
                                        </p>
                                    </div>
                                )}

                                {conta && !conta.emailVerificado && (
                                    <div className="space-y-3 rounded-lg border border-primary/30 bg-primary/10 p-4">
                                        <p className="text-sm text-primary">
                                            Seu email ainda não foi confirmado. Confirme para poder aceitar convites.
                                        </p>
                                        <ReenviarVerificacao email={conta.email} />
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="flex-1 px-4 py-3 bg-surface-2 text-white rounded-lg hover:bg-[#353535] transition-colors duration-300"
                                    disabled={isLoading}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-primary text-black rounded-lg hover:bg-primary-hover transition-colors duration-300 flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
                    </Modal>
    );
}
