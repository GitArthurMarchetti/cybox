'use client'

import { Modal, ModalHeader } from '@/components/ui/modal';
import React, { useEffect, useState } from 'react';
import { MdPerson, MdEmail, MdLock, MdSave } from 'react-icons/md';
import { UserType } from '@/lib/types/types';
import { getMinhaConta, updateUser } from '@/app/services/user';
import ReenviarVerificacao from '@/app/components/Invite/ReenviarVerificacao';
import { toast } from 'sonner';
import { useDemo } from '../demo/DemoContext';

interface ConfiguracoesUsuarioModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserType;
    onSuccess?: () => void;
}

export default function ConfiguracoesUsuarioModal({ isOpen, onClose, user, onSuccess }: ConfiguracoesUsuarioModalProps) {
    const { isDemo } = useDemo();
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
            toast.error("Passwords don't match");
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
                toast.error(resultado.error || "Couldn't update your details");
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
            toast.error(error.message || "Couldn't update your details");
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
                            titulo="Account settings"
                            subtitulo="Your name, email and password"
                            onClose={handleClose}
                        />

                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-muted mb-2">
                                        Name
                                    </label>
                                    <div className="relative">
                                        <MdPerson className="absolute left-3 top-1/2 transform -translate-y-1/2 text-subtle" size={20} />
                                        <input
                                            type="text"
                                            value={nome}
                                            onChange={(e) => setNome(e.target.value)}
                                            className="w-full bg-surface-2 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            placeholder="Your name"
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
                                            placeholder="you@company.com"
                                            required
                                        />
                                    </div>
                                </div>

                                {!isGoogleUser && (
                                    <>
                                        <div className="pt-4 border-t border-line">
                                            <h3 className="text-sm font-semibold text-white mb-4">Change password</h3>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-muted mb-2">
                                                Current password
                                            </label>
                                            <div className="relative">
                                                <MdLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-subtle" size={20} />
                                                <input
                                                    type="password"
                                                    value={senhaAtual}
                                                    onChange={(e) => setSenhaAtual(e.target.value)}
                                                    className="w-full bg-surface-2 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                    placeholder="Your current password"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-muted mb-2">
                                                New password
                                            </label>
                                            <div className="relative">
                                                <MdLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-subtle" size={20} />
                                                <input
                                                    type="password"
                                                    value={novaSenha}
                                                    onChange={(e) => setNovaSenha(e.target.value)}
                                                    className="w-full bg-surface-2 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                    placeholder="At least 8 characters"
                                                />
                                            </div>
                                            <p className="text-xs text-subtle mt-1">At least 8 characters</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-muted mb-2">
                                                Confirm new password
                                            </label>
                                            <div className="relative">
                                                <MdLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-subtle" size={20} />
                                                <input
                                                    type="password"
                                                    value={confirmarSenha}
                                                    onChange={(e) => setConfirmarSenha(e.target.value)}
                                                    className="w-full bg-surface-2 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                    placeholder="Type it again"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {isDemo ? (
                                    <div className="rounded-2xl border border-primary/30 bg-primary/[0.06] p-4">
                                        <p className="text-sm text-white/70">
                                            This is the shared demo account. Changes here aren&apos;t saved.
                                        </p>
                                    </div>
                                ) : isGoogleUser && (
                                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                                        <p className="text-sm text-muted">
                                            You sign in with Google, so there is no password. To set one, use
                                            &quot;Forgot your password?&quot; on the login screen.
                                        </p>
                                    </div>
                                )}

                                {conta && !conta.emailVerificado && (
                                    <div className="space-y-3 rounded-lg border border-primary/30 bg-primary/10 p-4">
                                        <p className="text-sm text-primary">
                                            Your email isn&apos;t confirmed yet. Confirm it to accept invites.
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
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-primary text-black rounded-lg hover:bg-primary-hover transition-colors duration-300 flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                                            Saving…
                                        </>
                                    ) : (
                                        <>
                                            <MdSave size={20} />
                                            Save changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </Modal>
    );
}
