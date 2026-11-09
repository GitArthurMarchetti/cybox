'use client'

import { Modal, ModalTitle } from '@/components/ui/modal';
import React from 'react';
import { FiCalendar, FiEdit2, FiMapPin, FiTag, FiTrash2, FiX } from 'react-icons/fi';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { money, compactMoney, longDate, valueTone } from '@/lib/format';

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

function Fact({ icon: Icon, label, value }: { icon: React.ComponentType<{ size?: number }>; label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-start gap-3">
            <span className="mt-0.5 text-white/35"><Icon size={14} /></span>
            <div className="min-w-0">
                <p className="text-xs text-white/40">{label}</p>
                <p className="break-words text-sm text-white">{value}</p>
            </div>
        </div>
    );
}

export function DetalhesPatrimonioModal({ isOpen, onClose, patrimonio, onEdit, onDelete }: DetalhesPatrimonioModalProps) {
    if (!patrimonio) return null;

    const pct = patrimonio.finalValue;
    const tone = valueTone(pct);
    const lost = patrimonio.depreciacao_valor ?? Math.max(0, (patrimonio.preco_inicial ?? 0) - (patrimonio.valor_atual ?? 0));
    const rate = patrimonio.depreciacao_percentual;

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-5xl">
            {/* header */}
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-white/[0.06] px-5 py-4 sm:px-6 sm:py-5">
                <div className="flex min-w-0 items-center gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-display text-lg font-semibold text-white ${tone.bg}`}>
                        {patrimonio.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <ModalTitle className="truncate font-display text-lg font-semibold tracking-tight text-white sm:text-xl">{patrimonio.name}</ModalTitle>
                        <p className="font-mono text-[11px] uppercase tracking-wider text-white/40">{patrimonio.codigo || 'No asset code'}</p>
                    </div>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                    {onEdit && (
                        <button type="button" onClick={() => onEdit(patrimonio)} aria-label="Edit asset" className="flex h-9 items-center gap-1.5 rounded-full border border-white/10 px-3 text-xs text-white/75 transition-colors hover:border-primary/50 hover:text-primary">
                            <FiEdit2 size={13} /> <span className="hidden sm:inline">Edit</span>
                        </button>
                    )}
                    {onDelete && (
                        <button type="button" onClick={() => onDelete(patrimonio)} aria-label="Delete asset" className="flex h-9 items-center gap-1.5 rounded-full border border-white/10 px-3 text-xs text-white/75 transition-colors hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-300">
                            <FiTrash2 size={13} /> <span className="hidden sm:inline">Delete</span>
                        </button>
                    )}
                    <button type="button" onClick={onClose} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white">
                        <FiX size={18} />
                    </button>
                </div>
            </div>

            <div className="grid flex-1 grid-cols-1 gap-5 overflow-y-auto p-5 sm:p-6 lg:grid-cols-5">
                {/* numbers + facts */}
                <div className="space-y-4 lg:col-span-2">
                    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">Worth today</p>
                        <p className="mt-1 font-display text-3xl font-semibold tracking-tight text-primary">{money(patrimonio.valor_atual, { cents: true })}</p>
                        <div className="mt-4 flex items-center gap-3">
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                                <div className={`h-full rounded-full ${tone.bg}`} style={{ width: `${Math.max(0, Math.min(100, pct))}%` }} />
                            </div>
                            <span className={`font-mono text-xs ${tone.text}`}>{pct}% left</span>
                        </div>
                        <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-white/[0.06] pt-4 text-sm">
                            <div>
                                <dt className="text-xs text-white/40">Purchase price</dt>
                                <dd className="text-white">{money(patrimonio.preco_inicial, { cents: true })}</dd>
                            </div>
                            <div>
                                <dt className="text-xs text-white/40">Value lost</dt>
                                <dd className="text-white">{money(lost, { cents: true })}</dd>
                            </div>
                            <div>
                                <dt className="text-xs text-white/40">Annual rate</dt>
                                <dd className="text-white">{rate != null ? `${Number(rate)}% / year` : '—'}</dd>
                            </div>
                            <div>
                                <dt className="text-xs text-white/40">Fully depreciated</dt>
                                <dd className="text-white">{rate ? `after ${+(100 / Number(rate)).toFixed(1)} years` : '—'}</dd>
                            </div>
                        </dl>
                    </div>

                    <div className="space-y-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
                        <Fact icon={FiCalendar} label="Acquired" value={longDate(patrimonio.data_aquisicao)} />
                        <Fact icon={FiMapPin} label="Location" value={patrimonio.local || 'Not set'} />
                        <Fact icon={FiTag} label="Specs & notes" value={patrimonio.especificacoes || 'None added'} />
                    </div>
                </div>

                {/* chart */}
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 lg:col-span-3">
                    <div className="mb-4 flex items-baseline justify-between gap-3">
                        <h3 className="font-display text-sm font-semibold text-white">Value over time</h3>
                        <span className="font-mono text-[11px] text-white/40">−{100 - pct}% since purchase</span>
                    </div>
                    <div className="h-64 sm:h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={patrimonio.depreciacao_historico || []} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="asset-value" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stopColor="#F6CF45" stopOpacity={0.35} />
                                        <stop offset="100%" stopColor="#F6CF45" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                                <XAxis dataKey="data" stroke="rgba(255,255,255,0.35)" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis stroke="rgba(255,255,255,0.35)" fontSize={11} width={48} tickLine={false} axisLine={false} tickFormatter={(v) => compactMoney(v)} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#141414', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}
                                    labelStyle={{ color: 'rgba(255,255,255,0.5)' }}
                                    itemStyle={{ color: '#F6CF45' }}
                                    formatter={(value: number) => [money(value, { cents: true }), 'Value']}
                                />
                                <Area type="monotone" dataKey="valor" stroke="#F6CF45" strokeWidth={2.5} fill="url(#asset-value)" dot={false} activeDot={{ r: 5, fill: '#050505', stroke: '#FFAE3F', strokeWidth: 2.5 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
