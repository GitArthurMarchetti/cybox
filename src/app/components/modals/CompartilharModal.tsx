'use client'

import { Modal, ModalHeader } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import React, { useState, useEffect } from 'react';
import { FaShare, FaCopy, FaCheck, FaEnvelope, FaPlus, FaTimes } from 'react-icons/fa';
import { toast } from 'sonner';
import { DepartamentoType } from '@/lib/types/types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface CompartilharModalProps {
    isOpen: boolean;
    onClose: () => void;
    departamento: DepartamentoType | null;
    // Retorna true quando ao menos um convite foi enviado.
    onInvite: (emails: string[]) => Promise<boolean>;
}

export function CompartilharModal({ isOpen, onClose, departamento, onInvite }: CompartilharModalProps) {
    const [copied, setCopied] = useState(false);
    const [emails, setEmails] = useState<string[]>(['']);
    const [isLoading, setIsLoading] = useState(false);
    const [shareLink, setShareLink] = useState('');

    useEffect(() => {
        if (departamento?.codigo_convite) {
            setShareLink(`${window.location.origin}/convite/${departamento.codigo_convite}`);
        } else {
            setShareLink('');
        }
    }, [departamento]);

    useEffect(() => {
        if (!isOpen) {
            setEmails(['']);
            setCopied(false);
        }
    }, [isOpen]);

    if (!departamento) return null;

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareLink);
            setCopied(true);
            toast.success('Link copiado!');
            setTimeout(() => setCopied(false), 3000);
        } catch (error) {
            toast.error("Couldn't copy. Select the link and copy it manually.");
        }
    };

    const handleEmailChange = (index: number, value: string) => {
        setEmails(atual => atual.map((email, i) => i === index ? value : email));
    };

    const emailsPreenchidos = emails.map(email => email.trim()).filter(Boolean);
    const emailsInvalidos = emailsPreenchidos.filter(email => !EMAIL_REGEX.test(email));

    const handleInvite = async () => {
        if (emailsPreenchidos.length === 0) {
            toast.error('Add at least one email');
            return;
        }

        if (emailsInvalidos.length > 0) {
            toast.error(`Invalid email: ${emailsInvalidos.join(', ')}`);
            return;
        }

        setIsLoading(true);
        try {
            const enviou = await onInvite(Array.from(new Set(emailsPreenchidos)));
            if (enviou) onClose();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg" bloquearFechamento={isLoading}>
            <ModalHeader
                icone={<FaShare size={18} />}
                titulo="Invite people"
                subtitulo={departamento.titulo}
                onClose={onClose}
            />

            <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-5 sm:p-6">
                <section>
                    <h3 className="mb-3 text-sm font-medium text-muted">Invite link</h3>
                    {shareLink ? (
                        <>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={shareLink}
                                    readOnly
                                    aria-label="Invite link"
                                    onFocus={(e) => e.target.select()}
                                    className="min-w-0 flex-1 rounded-lg bg-surface-2 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                                <Button onClick={handleCopyLink} className="shrink-0">
                                    {copied ? <FaCheck size={14} /> : <FaCopy size={14} />}
                                    {copied ? 'Copied' : 'Copy'}
                                </Button>
                            </div>
                            <p className="mt-2 text-xs text-subtle">
                                Anyone who opens this link joins the room as a member. To revoke it, generate a new code in Room settings.
                            </p>
                        </>
                    ) : (
                        <p className="rounded-lg bg-surface-2 p-4 text-sm text-muted">
                            This room doesn&apos;t have an invite code yet. An owner or admin can create one in Room settings &gt; Advanced.
                        </p>
                    )}
                </section>

                <section className="border-t border-line pt-6">
                    <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-sm font-medium text-muted">Invite by email</h3>
                        <Button variant="link" size="sm" className="px-0" onClick={() => setEmails(atual => [...atual, ''])}>
                            <FaPlus size={12} /> Add another
                        </Button>
                    </div>

                    <div className="max-h-48 space-y-2 overflow-y-auto">
                        {emails.map((email, index) => (
                            <div key={index} className="flex gap-2">
                                <div className="relative flex-1">
                                    <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle" size={14} aria-hidden />
                                    <input
                                        type="email"
                                        placeholder="name@company.com"
                                        aria-label={`Email ${index + 1}`}
                                        value={email}
                                        onChange={(e) => handleEmailChange(index, e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleInvite(); } }}
                                        className="w-full rounded-lg bg-surface-2 py-3 pl-10 pr-4 text-white placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                                {emails.length > 1 && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setEmails(atual => atual.filter((_, i) => i !== index))}
                                        aria-label={`Remove email ${index + 1}`}
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        <FaTimes size={16} />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>

                    <p className="mt-2 text-xs text-subtle">
                        Each person gets a link by email. People without an account can sign up from that link.
                    </p>
                </section>
            </div>

            <div className="flex shrink-0 items-center justify-end gap-3 border-t border-line p-4 sm:px-6">
                <Button variant="ghost" onClick={onClose} disabled={isLoading}>
                    Cancel
                </Button>
                <Button onClick={handleInvite} disabled={isLoading || emailsPreenchidos.length === 0}>
                    {isLoading ? (
                        <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" aria-hidden />
                            Sending…
                        </>
                    ) : (
                        <>
                            <FaEnvelope size={14} /> Send invites
                        </>
                    )}
                </Button>
            </div>
        </Modal>
    );
}
