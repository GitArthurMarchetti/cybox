// Cálculo puro da depreciação linear por taxa anual (%). Sem dependências de servidor,
// para poder ser usado tanto nas actions quanto nos componentes client.

export function mesesDesde(dataAquisicao: string, referencia = new Date()): number {
    const [ano, mes, dia] = dataAquisicao.slice(0, 10).split('-').map(Number);
    let meses = (referencia.getFullYear() - ano) * 12 + (referencia.getMonth() + 1 - mes);
    if (referencia.getDate() < dia) meses -= 1;
    return Math.max(0, meses);
}

export function calcularValorDepreciado(valorInicial: number, taxaAnual: number, dataAquisicao: string, referencia = new Date()): number {
    const fator = 1 - (taxaAnual / 100) * (mesesDesde(dataAquisicao, referencia) / 12);
    return Math.round(Math.max(0, valorInicial * fator) * 100) / 100;
}

// Série mensal do valor desde a aquisição até hoje, com no máximo `maxPontos` pontos.
export function serieDepreciacao(valorInicial: number, taxaAnual: number, dataAquisicao: string, maxPontos = 24): { data: string; valor: number }[] {
    if (!dataAquisicao || !valorInicial || !taxaAnual) return [];

    const [ano, mes, dia] = dataAquisicao.slice(0, 10).split('-').map(Number);
    const totalMeses = mesesDesde(dataAquisicao);
    const passo = Math.max(1, Math.ceil(totalMeses / (maxPontos - 1)));
    const pontos: { data: string; valor: number }[] = [];

    for (let m = 0; m <= totalMeses; m += passo) {
        const data = new Date(ano, mes - 1 + m, dia);
        pontos.push({
            data: data.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
            valor: calcularValorDepreciado(valorInicial, taxaAnual, dataAquisicao, data),
        });
    }

    if (totalMeses % passo !== 0 || pontos.length === 1) {
        pontos.push({
            data: new Date().toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
            valor: calcularValorDepreciado(valorInicial, taxaAnual, dataAquisicao),
        });
    }

    return pontos;
}
