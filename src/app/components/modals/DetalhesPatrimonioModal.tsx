'use client'

import { Modal, ModalTitle } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import React from 'react';
import { MdClose, MdModeEdit } from 'react-icons/md';
import { RiDeleteBinLine } from 'react-icons/ri';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PatrimonioDetalhadoType {
    id?: number;
    name: string;
    codigo?: string;
    finalValue: number;
    especificacoes?: string | null;
    data_aquisicao?: string;
    local?: string | null;
    preco_inicial?: number;
    valor_atual?: number;
    depreciacao_percentual?: number;
    depreciacao_valor?: number;
    gastos_totais?: number;
    status?: number;
    depreciacao_historico?: { data: string; valor: number }[];
}

interface DetalhesPatrimonioModalProps {
    isOpen: boolean;
    onClose: () => void;
    patrimonio: PatrimonioDetalhadoType | null;
    onEdit?: (patrimonio: PatrimonioDetalhadoType) => void;
    onDelete?: (patrimonio: PatrimonioDetalhadoType) => void;
}

// 'YYYY-MM-DD' é lido como data local; new Date() direto interpretaria como UTC e mostraria o dia anterior.
const formatarData = (dataString?: string) => {
    if (!dataString) return "Não informada";
    const [ano, mes, dia] = dataString.slice(0, 10).split('-').map(Number);
    if (!ano || !mes || !dia) return "Não informada";
    return new Date(ano, mes - 1, dia).toLocaleDateString('pt-BR');
};

const formatarPreco = (valor: number | null | undefined) => {
    if (!valor || isNaN(Number(valor))) return "R$ 0,00";
    return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const corPorValor = (percentual: number) =>
    percentual >= 70 ? 'text-green-500' : percentual >= 50 ? 'text-yellow-500' : 'text-red-500';

const fundoPorValor = (percentual: number) =>
    percentual >= 70 ? 'bg-green-500' : percentual >= 50 ? 'bg-yellow-500' : 'bg-red-500';

export function DetalhesPatrimonioModal({
    isOpen,
    onClose,
    patrimonio,
    onEdit,
    onDelete
}: DetalhesPatrimonioModalProps) {
    if (!patrimonio) return null;

    const depreciacao = 100 - patrimonio.finalValue;

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-6xl">
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-6 sm:py-4">
                <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-xl font-bold text-white ${fundoPorValor(patrimonio.finalValue)}`}>
                        {patrimonio.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                        <ModalTitle className="truncate text-lg font-bold text-white sm:text-2xl">{patrimonio.name}</ModalTitle>
                        <p className="truncate text-sm text-subtle">{patrimonio.codigo || 'Sem código'}</p>
                    </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                    {onEdit && (
                        <Button variant="secondary" size="sm" onClick={() => onEdit(patrimonio)} aria-label="Editar patrimônio">
                            <MdModeEdit size={18} className="text-primary" />
                            <span className="hidden sm:inline">Editar</span>
                        </Button>
                    )}
                    {onDelete && (
                        <Button variant="secondary" size="sm" onClick={() => onDelete(patrimonio)} aria-label="Excluir patrimônio">
                            <RiDeleteBinLine size={18} className="text-red-400" />
                            <span className="hidden sm:inline">Excluir</span>
                        </Button>
                    )}
                    <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Fechar">
                        <MdClose size={22} />
                    </Button>
                </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="space-y-4">
                        <div className="rounded-lg bg-surface-2 p-4">
                            <p className="mb-1 text-sm text-subtle">Status</p>
                            <p className={`text-xl font-bold ${corPorValor(patrimonio.finalValue)}`}>
                                {patrimonio.finalValue}% do valor inicial
                            </p>
                            <p className="mt-1 text-sm text-subtle">Depreciação: {depreciacao}%</p>
                        </div>

                        <div className="space-y-2 rounded-lg bg-surface-2 p-4">
                            <div className="flex justify-between gap-4">
                                <p className="text-sm text-subtle">Preço inicial</p>
                                <p className="text-white">{formatarPreco(patrimonio.preco_inicial)}</p>
                            </div>
                            <div className="flex justify-between gap-4">
                                <p className="text-sm text-subtle">Valor atual</p>
                                <p className="font-medium text-primary">{formatarPreco(patrimonio.valor_atual)}</p>
                            </div>
                        </div>

                        <div className="rounded-lg bg-surface-2 p-4">
                            <p className="mb-1 text-sm text-subtle">Especificações</p>
                            <p className="text-white">{patrimonio.especificacoes || "Não especificado"}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
                            <div className="rounded-lg bg-surface-2 p-4">
                                <p className="mb-1 text-sm text-subtle">Data de aquisição</p>
                                <p className="text-white">{formatarData(patrimonio.data_aquisicao)}</p>
                            </div>
                            <div className="rounded-lg bg-surface-2 p-4">
                                <p className="mb-1 text-sm text-subtle">Localização</p>
                                <p className="text-white">{patrimonio.local || "Não especificado"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-surface-2 p-4 lg:col-span-2">
                        <h3 className="mb-4 font-medium text-white">
                            Depreciação <span className="ml-1 text-sm text-subtle">{depreciacao}%</span>
                        </h3>
                        <div className="h-64 sm:h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={patrimonio.depreciacao_historico || []}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#3D3D3D" />
                                    <XAxis dataKey="data" stroke="#9A9696" fontSize={12} />
                                    <YAxis stroke="#9A9696" fontSize={12} width={40} tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1F1F1F', borderColor: '#3D3D3D' }}
                                        labelStyle={{ color: '#9A9696' }}
                                        formatter={(value: number) => [formatarPreco(value), 'Valor']}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="valor"
                                        stroke="#F6CF45"
                                        strokeWidth={2}
                                        dot={{ stroke: '#F6CF45', strokeWidth: 2, r: 4 }}
                                        activeDot={{ stroke: '#F6CF45', strokeWidth: 2, r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
