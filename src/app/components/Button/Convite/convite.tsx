// Use server-side logic
"use server"

import { convidarUsuarioParaDepartamento } from '@/app/services/convite';
import EnviarConviteButton from './enviarConviteButton';

// Função para enviar convite, sem usar ConviteFunc diretamente
export default async function Convite({ departamentoId, email }: { departamentoId: number, email: string }) {
    // Função que envia o convite
    await convidarUsuarioParaDepartamento(departamentoId, email);

    return (
        <>
            <EnviarConviteButton departamentoId={departamentoId} email={email} />
        </>
    );
}
