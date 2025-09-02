"use client"

import { motion } from 'framer-motion';
import { MdModeEdit, MdAdd } from 'react-icons/md';
import { RiDeleteBinLine } from 'react-icons/ri';
import { FaShare, FaChartLine } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Category, PatrimonioDetalhadoType } from '@/lib/types/categoria.types';

interface CategoriaDetailsProps {
    category: Category | null;
    patrimonios: PatrimonioDetalhadoType[];
    loading: boolean;
    userRole: string;
    onEdit: () => void;
    onDelete: () => void;
    onAddPatrimonio: () => void;
    onPatrimonioClick: (patrimonio: PatrimonioDetalhadoType) => void;
    formatarPreco: (preco: number) => string;
    formatarData: (data: string) => string;
    gerarDadosDepreciacao: (patrimonios: PatrimonioDetalhadoType[]) => { mes: string; valor: number }[];
    gerarDadosGastos: () => { mes: string; valor: number }[];
}

export default function CategoriaDetails({
    category,
    patrimonios,
    loading,
    userRole,
    onEdit,
    onDelete,
    onAddPatrimonio,
    onPatrimonioClick,
    formatarPreco,
    formatarData,
    gerarDadosDepreciacao,
    gerarDadosGastos
}: CategoriaDetailsProps) {
    if (!category) {
        return (
            <motion.div
                className="flex flex-col items-center justify-center h-full text-center p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <div className="bg-[#2c2c2c] p-6 rounded-full mb-4">
                    <FaShare className="text-[#8c8888]" size={32} />
                </div>
                <h3 className="text-xl font-medium mb-2">Selecione uma categoria</h3>
                <p className="text-[#8c8888] max-w-md">
                    Selecione uma categoria para visualizar seus detalhes e itens.
                </p>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white">{category.name}</h2>
                    <p className="text-[#b4b4b4]">{category.observation}</p>
                    <span className="inline-block mt-2 px-3 py-1 bg-[#F6CF45]/20 text-[#F6CF45] rounded-full text-sm">
                        {category.total} {category.total === 1 ? 'item' : 'itens'}
                    </span>
                </div>
                {(userRole === 'owner' || userRole === 'admin') && (
                    <div className="flex gap-2">
                        <button 
                            onClick={onEdit}
                            className="p-2 bg-[#2c2c2c] text-[#F6CF45] hover:text-white rounded-lg transition-colors duration-300"
                        >
                            <MdModeEdit size={20} />
                        </button>
                        <button 
                            onClick={onDelete}
                            className="p-2 bg-[#2c2c2c] text-red-400 hover:text-red-300 rounded-lg transition-colors duration-300"
                        >
                            <RiDeleteBinLine size={20} />
                        </button>
                    </div>
                )}
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Patrimônios</h3>
                    {(userRole === 'owner' || userRole === 'admin') && (
                        <button
                            onClick={onAddPatrimonio}
                            className="flex items-center gap-2 bg-[#F6CF45] text-black px-3 py-2 rounded-lg hover:bg-[#F6CF45]/90 transition-colors duration-300"
                        >
                            <MdAdd size={16} />
                            Adicionar
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F6CF45]"></div>
                    </div>
                ) : patrimonios.length > 0 ? (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {patrimonios.map((patrimonio, index) => (
                            <motion.div
                                key={patrimonio.id}
                                className="p-4 bg-[#1a1a1a] rounded-lg hover:bg-[#2c2c2c] cursor-pointer transition-all duration-300"
                                onClick={() => onPatrimonioClick(patrimonio)}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.02 }}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h4 className="font-medium text-white mb-1">{patrimonio.name}</h4>
                                        {patrimonio.codigo && (
                                            <p className="text-xs text-[#8c8888] mb-2">#{patrimonio.codigo}</p>
                                        )}
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div>
                                                <span className="text-[#8c8888]">Valor atual:</span>
                                                <p className="text-[#F6CF45] font-medium">
                                                    {formatarPreco(patrimonio.valor_atual || 0)}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-[#8c8888]">Aquisição:</span>
                                                <p className="text-white">
                                                    {patrimonio.data_aquisicao ? formatarData(patrimonio.data_aquisicao) : 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="bg-[#2c2c2c] p-6 rounded-xl mb-4 w-16 h-16 flex items-center justify-center">
                            <FaChartLine className="text-[#8c8888]" size={24} />
                        </div>
                        <h4 className="text-lg font-medium mb-2">Nenhum patrimônio</h4>
                        <p className="text-[#8c8888] max-w-md mb-4">
                            Esta categoria ainda não possui patrimônios cadastrados.
                        </p>
                        {(userRole === 'owner' || userRole === 'admin') && (
                            <button
                                className="mt-2 text-[#F6CF45] hover:text-white transition-colors"
                                onClick={onAddPatrimonio}
                            >
                                Adicionar primeiro patrimônio
                            </button>
                        )}
                    </div>
                )}
            </div>

            {patrimonios.length > 0 && (
                <div className="mt-6 space-y-4">
                    <h4 className="text-lg font-semibold text-white">Gráfico de Depreciação</h4>
                    <div className="bg-[#1a1a1a] p-4 rounded-lg">
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={gerarDadosDepreciacao(patrimonios)}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2c2c2c" />
                                <XAxis dataKey="mes" stroke="#8c8888" />
                                <YAxis stroke="#8c8888" />
                                <Tooltip 
                                    contentStyle={{
                                        backgroundColor: '#1a1a1a',
                                        border: '1px solid #2c2c2c',
                                        borderRadius: '8px',
                                        color: '#ffffff'
                                    }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="valor" 
                                    stroke="#F6CF45" 
                                    strokeWidth={2}
                                    dot={{ fill: '#F6CF45', r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <h4 className="text-lg font-semibold text-white">Gastos Mensais</h4>
                    <div className="bg-[#1a1a1a] p-4 rounded-lg">
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={gerarDadosGastos()}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2c2c2c" />
                                <XAxis dataKey="mes" stroke="#8c8888" />
                                <YAxis stroke="#8c8888" />
                                <Tooltip 
                                    contentStyle={{
                                        backgroundColor: '#1a1a1a',
                                        border: '1px solid #2c2c2c',
                                        borderRadius: '8px',
                                        color: '#ffffff'
                                    }}
                                />
                                <Bar dataKey="valor" fill="#F6CF45" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </motion.div>
    );
}