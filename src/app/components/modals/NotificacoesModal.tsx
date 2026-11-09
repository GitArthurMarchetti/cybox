'use client'

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { FiBell, FiCheck, FiInbox, FiX } from 'react-icons/fi';
import { toast } from 'sonner';
import { Modal, ModalHeader } from '@/components/ui/modal';
import { listarConvites, responderConvite } from '@/app/services/convites';
import { ConviteDetalhadoType } from '@/lib/types/types';
import { useDemo } from '../demo/DemoContext';

interface NotificacoesModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const timeAgo = (iso: string) => {
    const date = new Date(iso.replace(' ', 'T'));
    const days = Math.floor((Date.now() - date.getTime()) / 86_400_000);
    if (Number.isNaN(days)) return '';
    if (days <= 0) return 'today';
    if (days === 1) return 'yesterday';
    if (days < 30) return `${days} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

/** Pending room invitations, with accept / decline. */
function NotificacoesModal({ isOpen, onClose }: NotificacoesModalProps) {
    const router = useRouter();
    const { blockIfDemo } = useDemo();
    const [invites, setInvites] = useState<ConviteDetalhadoType[] | null>(null);
    const [busyId, setBusyId] = useState<number | null>(null);

    const load = useCallback(async () => {
        try {
            const all = await listarConvites();
            setInvites(all.filter(c => c.status === 'pendente'));
        } catch {
            setInvites([]);
        }
    }, []);

    useEffect(() => {
        if (isOpen) load();
    }, [isOpen, load]);

    const answer = async (invite: ConviteDetalhadoType, status: 'aceito' | 'recusado') => {
        if (blockIfDemo()) return;
        setBusyId(invite.id);
        try {
            await responderConvite(invite.id, status);
            setInvites(list => (list ?? []).filter(c => c.id !== invite.id));
            if (status === 'aceito') {
                toast.success(`You joined ${invite.departamento_titulo ?? 'the room'}`);
                router.refresh();
            } else {
                toast('Invite declined');
            }
        } catch {
            toast.error("Couldn't answer the invite", { description: 'It may have expired. Ask for a new one.' });
        } finally {
            setBusyId(null);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg">
            <ModalHeader
                icone={<FiBell size={18} />}
                titulo="Notifications"
                subtitulo={invites && invites.length > 0 ? `${invites.length} pending ${invites.length === 1 ? 'invite' : 'invites'}` : undefined}
                onClose={onClose}
            />

            <div className="overflow-y-auto p-5 sm:p-6">
                {invites === null ? (
                    <div className="space-y-3" aria-label="Loading notifications">
                        {[0, 1].map(i => <div key={i} className="h-20 animate-pulse rounded-2xl bg-white/[0.04]" />)}
                    </div>
                ) : invites.length === 0 ? (
                    <div className="flex flex-col items-center py-10 text-center">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-white/40">
                            <FiInbox size={22} />
                        </div>
                        <p className="font-display font-semibold text-white">You&apos;re all caught up</p>
                        <p className="mt-2 max-w-xs text-sm text-white/50">When someone invites you to a room, it shows up here.</p>
                    </div>
                ) : (
                    <ul className="space-y-3">
                        <AnimatePresence initial={false}>
                            {invites.map(invite => (
                                <motion.li
                                    key={invite.id}
                                    layout
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: 40 }}
                                    className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4"
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 font-display text-sm font-semibold text-primary">
                                            {(invite.departamento_titulo ?? '?').charAt(0).toUpperCase()}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm text-white">
                                                <span className="font-medium">{invite.remetente_nome ?? 'Someone'}</span> invited you to{' '}
                                                <span className="font-medium text-primary">{invite.departamento_titulo ?? 'a room'}</span>
                                            </p>
                                            <p className="mt-0.5 font-mono text-[11px] text-white/35">{timeAgo(invite.criado_em)}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex gap-2 pl-[3.25rem]">
                                        <button
                                            type="button"
                                            disabled={busyId === invite.id}
                                            onClick={() => answer(invite, 'aceito')}
                                            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-xs font-semibold text-black transition-colors hover:bg-primary-hover disabled:opacity-60"
                                        >
                                            <FiCheck aria-hidden /> Accept
                                        </button>
                                        <button
                                            type="button"
                                            disabled={busyId === invite.id}
                                            onClick={() => answer(invite, 'recusado')}
                                            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/15 px-4 text-xs text-white/75 transition-colors hover:border-white/30 hover:text-white disabled:opacity-60"
                                        >
                                            <FiX aria-hidden /> Decline
                                        </button>
                                    </div>
                                </motion.li>
                            ))}
                        </AnimatePresence>
                    </ul>
                )}
            </div>
        </Modal>
    );
}

export default NotificacoesModal;
