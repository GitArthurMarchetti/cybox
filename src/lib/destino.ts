const DESTINO_PADRAO = '/departamentos';

// Aceita só caminhos internos, para o callbackUrl não virar um redirecionamento para outro site.
export function destinoSeguro(callbackUrl: string | null | undefined): string {
    if (!callbackUrl) return DESTINO_PADRAO;

    let caminho = callbackUrl;
    if (typeof window !== 'undefined' && caminho.startsWith(window.location.origin)) {
        caminho = caminho.slice(window.location.origin.length);
    }

    if (!caminho.startsWith('/') || caminho.startsWith('//') || caminho.startsWith('/\\')) {
        return DESTINO_PADRAO;
    }

    return caminho;
}
