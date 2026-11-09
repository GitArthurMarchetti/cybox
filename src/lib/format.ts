// Display formatting shared by the app (English / US dollars).

export const money = (value: number | null | undefined, opts: { cents?: boolean } = {}) =>
    Number(value ?? 0).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: opts.cents ? 2 : 0,
        maximumFractionDigits: opts.cents ? 2 : 0,
    });

export const compactMoney = (value: number | null | undefined) =>
    '$' + Number(value ?? 0).toLocaleString('en-US', { notation: 'compact', maximumFractionDigits: Number(value) >= 1_000_000 ? 2 : 1 });

/** "2025-05-14" → "May 14, 2025" (parsed as a local date, no timezone shift). */
export const longDate = (iso?: string | null) => {
    if (!iso) return '—';
    const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

/** "2025-05-14" → "May 2025" */
export const monthYear = (iso?: string | null) => {
    if (!iso) return '—';
    const [y, m] = iso.slice(0, 10).split('-').map(Number);
    return new Date(y, m - 1, 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

/** Same thresholds the app has always used for the "value left" colour. */
export const valueTone = (pct: number) =>
    pct >= 70
        ? { text: 'text-green-400', bg: 'bg-green-500', soft: 'bg-green-500/15' }
        : pct >= 50
            ? { text: 'text-yellow-400', bg: 'bg-yellow-500', soft: 'bg-yellow-500/15' }
            : { text: 'text-red-400', bg: 'bg-red-500', soft: 'bg-red-500/15' };
