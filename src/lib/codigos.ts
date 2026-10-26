import { createHash, randomBytes, randomInt } from "crypto";

const ALFABETO_CODIGO = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function gerarCodigo(prefixo: 'DEPT' | 'INV', tamanho = 10): string {
    let codigo = '';
    for (let i = 0; i < tamanho; i++) {
        codigo += ALFABETO_CODIGO[randomInt(ALFABETO_CODIGO.length)];
    }
    return `${prefixo}-${codigo}`;
}

export function gerarToken(): { token: string; hash: string } {
    const token = randomBytes(32).toString('base64url');
    return { token, hash: hashToken(token) };
}

export function hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
}
