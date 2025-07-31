/**
 * Traduz roles do inglês para português
 */
export function traduzirRole(role: string): string {
    switch (role.toLowerCase()) {
        case 'owner':
            return 'Proprietário';
        case 'admin':
            return 'Administrador';
        case 'member':
            return 'Membro';
        default:
            return 'Membro';
    }
}

/**
 * Retorna a cor do badge baseada no role
 */
export function getCorPorRole(role: string): { background: string; text: string } {
    switch (role.toLowerCase()) {
        case 'owner':
            return { background: 'bg-yellow-500', text: 'text-black' };
        case 'admin':
            return { background: 'bg-blue-500', text: 'text-white' };
        case 'member':
            return { background: 'bg-[#1a1a1a]', text: 'text-[#8c8888]' };
        default:
            return { background: 'bg-[#1a1a1a]', text: 'text-[#8c8888]' };
    }
}