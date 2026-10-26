'use client'

import { Modal, ModalHeader } from '@/components/ui/modal';
import React from 'react';
import { MdNotifications, MdConstruction } from 'react-icons/md';

interface NotificacoesModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function NotificacoesModal({ isOpen, onClose }: NotificacoesModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
                        <ModalHeader
                            icone={<MdNotifications size={20} />}
                            titulo="Notificações"
                            onClose={onClose}
                        />

                        <div className="p-8 flex flex-col items-center justify-center text-center">
                            <div className="mb-6 p-6 bg-primary/10 rounded-full">
                                <MdConstruction className="text-primary" size={64} />
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-3">Em Breve!</h3>

                            <p className="text-muted mb-2">
                                Estamos trabalhando nesta funcionalidade.
                            </p>

                            <p className="text-sm text-subtle">
                                Em breve você poderá receber e gerenciar suas notificações aqui.
                            </p>

                            <button
                                onClick={onClose}
                                className="mt-6 px-6 py-3 bg-primary text-black rounded-lg hover:bg-primary-hover transition-colors duration-300 font-medium"
                            >
                                Entendi
                            </button>
                        </div>
                    </Modal>
    );
}
