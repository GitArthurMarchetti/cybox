'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaChartLine, FaFilter, FaPlus } from 'react-icons/fa';
import { MdModeEdit } from 'react-icons/md';
import { RiDeleteBinLine } from 'react-icons/ri';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { toast } from 'sonner';

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
    gastos?: GastoType[];
    depreciacao_historico?: { data: string; valor: number }[];
    gastos_mensais?: { mes: string; valor: number }[];
}

interface GastoType {
    id: number;
    tipo: string;
    descricao: string;
    valor: number;
    data: string;
}

interface DetalhesPatrimonioModalProps {
    isOpen: boolean;
    onClose: () => void;
    patrimonio: PatrimonioDetalhadoType | null;
    onEdit?: (patrimonio: PatrimonioDetalhadoType) => void;
    onDelete?: (patrimonio: PatrimonioDetalhadoType) => void;
}

export function DetalhesPatrimonioModal({ 
    isOpen, 
    onClose, 
    patrimonio,
    onEdit,
    onDelete 
}: DetalhesPatrimonioModalProps) {
    const [activeTab, setActiveTab] = useState<string>("depreciacao");

    if (!patrimonio) return null;

    // Formatar data para DD/MM/YYYY
    const formatarData = (dataString: string) => {
        if (!dataString) return "";
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR');
    };

    // Formatar preço em reais
    const formatarPreco = (valor: number | null | undefined) => {
        if (!valor || isNaN(Number(valor))) return "R$ 0,00";
        return Number(valor).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    };

    return (
        <AnimatePresence>
            {isOpen && patrimonio && (
                <motion.div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="bg-[#1F1F1F] rounded-xl w-full max-w-7xl h-[85vh] overflow-hidden"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-[#2c2c2c] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button
                                    className="flex items-center gap-2 text-[#b4b4b4] hover:text-[#F6CF45] transition-colors duration-300"
                                    onClick={onClose}
                                >
                                    <FaArrowLeft size={14} />
                                    <span className="text-sm">Voltar para categorias</span>
                                </button>
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    className="p-2 bg-[#F6CF45] rounded-md hover:bg-[#F6CF45]/90 transition-colors duration-300"
                                    onClick={() => onEdit?.(patrimonio)}
                                >
                                    <MdModeEdit size={18} />
                                </button>
                                <button 
                                    className="p-2 bg-red-500 rounded-md hover:bg-red-600 transition-colors duration-300"
                                    onClick={() => onDelete?.(patrimonio)}
                                >
                                    <RiDeleteBinLine size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="h-[calc(85vh-140px)] overflow-auto p-6">
                            <div className="grid grid-cols-3 gap-6">
                                {/* Coluna 1 - Informações gerais */}
                                <div>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className={`w-16 h-16 flex items-center justify-center rounded-md text-2xl font-bold ${
                                            patrimonio.finalValue >= 70 ? 'bg-green-500' : 
                                            patrimonio.finalValue >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}>
                                            {patrimonio.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h1 className="text-2xl font-bold">{patrimonio.name}</h1>
                                            <p className="text-[#8c8888] text-sm">{patrimonio.codigo}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="bg-[#2c2c2c] p-4 rounded-md">
                                            <p className="text-[#8c8888] text-sm mb-1">Especificações</p>
                                            <p className="text-white">{patrimonio.especificacoes || "Não especificado"}</p>
                                        </div>

                                        <div className="bg-[#2c2c2c] p-4 rounded-md">
                                            <p className="text-[#8c8888] text-sm mb-1">Data de aquisição</p>
                                            <p className="text-white">{formatarData(patrimonio.data_aquisicao || "")}</p>
                                        </div>

                                        <div className="bg-[#2c2c2c] p-4 rounded-md">
                                            <p className="text-[#8c8888] text-sm mb-1">Localização</p>
                                            <p className="text-white">{patrimonio.local || "Não especificado"}</p>
                                        </div>

                                        <div className="bg-[#2c2c2c] p-4 rounded-md">
                                            <div className="flex justify-between mb-2">
                                                <p className="text-[#8c8888] text-sm">Preço inicial</p>
                                                <p className="text-white">{formatarPreco(patrimonio.preco_inicial || 0)}</p>
                                            </div>
                                            <div className="flex justify-between mb-2">
                                                <p className="text-[#8c8888] text-sm">Valor atual</p>
                                                <p className="text-[#F6CF45]">{formatarPreco(patrimonio.valor_atual || 0)}</p>
                                            </div>
                                            <div className="flex justify-between">
                                                <p className="text-[#8c8888] text-sm">Total de gastos</p>
                                                <p className="text-red-500">{formatarPreco(patrimonio.gastos_totais || 0)}</p>
                                            </div>
                                        </div>

                                        <div className="bg-[#2c2c2c] p-4 rounded-md">
                                            <p className="text-[#8c8888] text-sm mb-1">Status</p>
                                            <p className={`text-xl font-bold ${
                                                patrimonio.finalValue >= 70 ? 'text-green-500' : 
                                                patrimonio.finalValue >= 50 ? 'text-yellow-500' : 'text-red-500'
                                            }`}>
                                                {patrimonio.finalValue}% do valor final
                                            </p>
                                            <p className="text-[#8c8888] text-sm mt-1">
                                                Depreciação: {patrimonio.depreciacao_percentual || (100 - patrimonio.finalValue)}%
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Coluna 2 - Gráficos */}
                                <div className="col-span-2 space-y-6">
                                    {/* Tabs */}
                                    <div className="flex gap-4 mb-2">
                                        <button
                                            className={`py-2 px-4 rounded-md transition-colors duration-300 flex items-center gap-2 ${
                                                activeTab === 'depreciacao' ? 'bg-[#F6CF45] text-black' : 'bg-[#2c2c2c] text-white hover:bg-[#3c3c3c]'
                                            }`}
                                            onClick={() => setActiveTab('depreciacao')}
                                        >
                                            <FaChartLine />
                                            Depreciação <span className="text-sm opacity-80">{patrimonio.depreciacao_percentual || (100 - patrimonio.finalValue)}%</span>
                                        </button>
                                        <button
                                            className={`py-2 px-4 rounded-md transition-colors duration-300 flex items-center gap-2 ${
                                                activeTab === 'gastos' ? 'bg-[#F6CF45] text-black' : 'bg-[#2c2c2c] text-white hover:bg-[#3c3c3c]'
                                            }`}
                                            onClick={() => setActiveTab('gastos')}
                                        >
                                            <FaChartLine />
                                            Gastos <span className="text-sm opacity-80">5%</span>
                                        </button>
                                    </div>

                                    {/* Gráficos baseados na tab ativa */}
                                    <div className="grid grid-cols-2 gap-6">
                                        {/* Gráfico principal */}
                                        <div className="col-span-2 bg-[#2c2c2c] p-4 rounded-md">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="font-medium">
                                                    {activeTab === 'depreciacao' ? 'Depreciação' : 'Gastos'}
                                                    <span className="text-sm text-[#8c8888] ml-2">
                                                        {activeTab === 'depreciacao' ? patrimonio.depreciacao_percentual : 5}%
                                                    </span>
                                                </h3>
                                                <select className="bg-[#1F1F1F] text-[#8c8888] border border-[#3c3c3c] rounded-md px-2 py-1 text-sm">
                                                    <option>Últimos 6 meses</option>
                                                    <option>Último ano</option>
                                                    <option>Todo período</option>
                                                </select>
                                            </div>
                                            <div className="h-64">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    {activeTab === 'depreciacao' ? (
                                                        <LineChart data={patrimonio.depreciacao_historico || []}>
                                                            <CartesianGrid strokeDasharray="3 3" stroke="#3c3c3c" />
                                                            <XAxis dataKey="data" stroke="#8c8888" />
                                                            <YAxis stroke="#8c8888" tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                                                            <Tooltip
                                                                contentStyle={{ backgroundColor: '#1F1F1F', borderColor: '#3c3c3c' }}
                                                                labelStyle={{ color: '#8c8888' }}
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
                                                    ) : (
                                                        <BarChart data={patrimonio.gastos_mensais || []}>
                                                            <CartesianGrid strokeDasharray="3 3" stroke="#3c3c3c" />
                                                            <XAxis dataKey="mes" stroke="#8c8888" />
                                                            <YAxis stroke="#8c8888" tickFormatter={(value) => `R$ ${value}`} />
                                                            <Tooltip
                                                                contentStyle={{ backgroundColor: '#1F1F1F', borderColor: '#3c3c3c' }}
                                                                labelStyle={{ color: '#8c8888' }}
                                                                formatter={(value: number) => [formatarPreco(value), 'Gasto']}
                                                            />
                                                            <Bar
                                                                dataKey="valor"
                                                                fill="#FF4560"
                                                                radius={[4, 4, 0, 0]}
                                                            />
                                                        </BarChart>
                                                    )}
                                                </ResponsiveContainer>
                                            </div>
                                        </div>

                                        {/* Histórico de gastos */}
                                        <div className="col-span-2 bg-[#2c2c2c] p-4 rounded-md">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="font-medium">Histórico de gastos</h3>
                                                <div className="flex gap-2 items-center">
                                                    <button className="p-1.5 bg-[#1F1F1F] rounded-md text-[#8c8888] hover:text-white transition-colors duration-200">
                                                        <FaFilter size={14} />
                                                    </button>
                                                    <button
                                                        className="py-1 px-3 bg-[#1F1F1F] rounded-md text-[#8c8888] hover:text-white transition-colors duration-200 text-sm flex items-center gap-1"
                                                    >
                                                        <FaPlus size={12} />
                                                        Adicionar gasto
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="max-h-64 overflow-y-auto pr-2">
                                                <table className="w-full">
                                                    <thead className="text-left text-[#8c8888] text-sm">
                                                        <tr>
                                                            <th className="pb-2">Descrição</th>
                                                            <th className="pb-2">Tipo</th>
                                                            <th className="pb-2 text-right">Valor</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {(patrimonio.gastos || []).map((gasto) => (
                                                            <tr key={gasto.id} className="border-t border-[#3c3c3c]">
                                                                <td className="py-3">
                                                                    <div>
                                                                        <p className="text-white">{gasto.descricao}</p>
                                                                        <p className="text-[#8c8888] text-xs">{formatarData(gasto.data)}</p>
                                                                    </div>
                                                                </td>
                                                                <td className="py-3">
                                                                    <span className="px-2 py-1 rounded-full text-xs bg-[#1F1F1F]">
                                                                        {gasto.tipo}
                                                                    </span>
                                                                </td>
                                                                <td className="py-3 text-right text-red-500">{formatarPreco(gasto.valor)}</td>
                                                            </tr>
                                                        ))}

                                                        {(!patrimonio.gastos || patrimonio.gastos.length === 0) && (
                                                            <tr>
                                                                <td colSpan={3} className="py-6 text-center text-[#8c8888]">
                                                                    Nenhum gasto registrado para este patrimônio.
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-2 border-t border-[#2c2c2c] flex justify-end">
                            <button
                                className="px-4 py-2 bg-[#2c2c2c] text-white rounded-md hover:bg-[#3c3c3c] transition-colors duration-300"
                                onClick={onClose}
                            >
                                Fechar
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}