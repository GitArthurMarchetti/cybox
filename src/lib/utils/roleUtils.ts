// Display helpers for room roles. Names kept for compatibility with existing imports.

export function traduzirRole(role: string): string {
    switch (role.toLowerCase()) {
        case 'owner':
            return 'Owner';
        case 'admin':
            return 'Admin';
        default:
            return 'Member';
    }
}

export function getCorPorRole(role: string): { background: string; text: string } {
    switch (role.toLowerCase()) {
        case 'owner':
            return { background: 'bg-primary', text: 'text-black' };
        case 'admin':
            return { background: 'bg-blue-600', text: 'text-white' };
        default:
            return { background: 'bg-white/10', text: 'text-white/70' };
    }
}
