"use client"

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { savePatrimonio } from '@/app/services/patrimonios';
import { getPadroesDepreciacao } from '@/app/services/categoria';
import { toast } from 'sonner';
import { MdClose, MdCheck } from 'react-icons/md';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

interface Category {
    id: number;
    name: string;
    observation?: string;
    padrao_depreciacao_id?: number | null;
}

interface CriarPatrimonioModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedCategory: Category | null;
    onSuccess?: () => void;
}

export default function CriarPatrimonioModal({ 
    isOpen, 
    onClose, 
    selectedCategory,
    onSuccess 
}: CriarPatrimonioModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [valorInicial, setValorInicial] = useState('');
    const [valorAtual, setValorAtual] = useState('');
    const [taxaDepreciacao, setTaxaDepreciacao] = useState('');
    const [dataAquisicao, setDataAquisicao] = useState('');
    const [padroesDepreciacao, setPadroesDepreciacao] = useState<any[]>([]);
    const [isLoadingPadroes, setIsLoadingPadroes] = useState(false);

    // Função para formatar valor monetário
    const formatarValor = (valor: string) => {
        const numero = valor.replace(/\D/g, '');
        if (numero === '') return '';
        const valorNumerico = parseInt(numero) / 100;
        return valorNumerico.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    // Função para calcular valor atual baseado na depreciação
    const calcularValorAtual = (valorInicialStr: string, taxaStr: string, dataAquisicaoStr: string) => {
        const valorInicialNum = parseFloat(valorInicialStr.replace(/\./g, '').replace(',', '.'));
        const taxaNum = parseFloat(taxaStr);

        if (!isNaN(valorInicialNum) && !isNaN(taxaNum) && taxaNum >= 0 && taxaNum <= 100 && dataAquisicaoStr) {
            const dataAquisicaoDate = new Date(dataAquisicaoStr);
            const dataAtual = new Date();

            // Calcular diferença em anos
            const diferencaEmAnos = (dataAtual.getTime() - dataAquisicaoDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);

            // Aplicar depreciação baseada no tempo decorrido
            const depreciacaoTotal = Math.min(taxaNum * diferencaEmAnos, 100); // Máximo 100% de depreciação
            const valorAtualCalculado = valorInicialNum * (1 - depreciacaoTotal / 100);

            return Math.max(0, valorAtualCalculado).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }
        return '';
    };

    // Atualizar valor atual quando valor inicial, taxa ou data mudam
    useEffect(() => {
        if (valorInicial && taxaDepreciacao && dataAquisicao) {
            const novoValorAtual = calcularValorAtual(valorInicial, taxaDepreciacao, dataAquisicao);
            setValorAtual(novoValorAtual);
        }
    }, [valorInicial, taxaDepreciacao, dataAquisicao]);

    // Limpar campos e carregar padrões ao abrir modal
    useEffect(() => {
        if (isOpen) {
            // Primeiro limpar campos
            setValorInicial('');
            setValorAtual('');
            setTaxaDepreciacao('');
            setDataAquisicao('');
            
            // Depois carregar padrões
            const carregarPadroes = async () => {
                setIsLoadingPadroes(true);
                try {
                    const padroes = await getPadroesDepreciacao();
                    setPadroesDepreciacao(padroes);
                    
                    // Pre-preencher taxa se a categoria tem padrão
                    if (selectedCategory?.padrao_depreciacao_id) {
                        const padrao = padroes.find(p => p.id === selectedCategory.padrao_depreciacao_id);
                        if (padrao) {
                            setTaxaDepreciacao(padrao.taxa_anual_percent.toString());
                        }
                    }
                } catch (error) {
                    console.error('Erro ao carregar padrões de depreciação:', error);
                } finally {
                    setIsLoadingPadroes(false);
                }
            };
            carregarPadroes();
        }
    }, [isOpen, selectedCategory]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!selectedCategory) return;

        setIsLoading(true);

        try {
            const formData = new FormData(event.currentTarget);
            console.log('DEBUG CriarPatrimonioModal:', {
                selectedCategory,
                selectedCategoryId: selectedCategory?.id,
                formDataKeys: Array.from(formData.keys()),
                id_categoria_value: formData.get('id_categoria')
            });

            // Garantir que o ID da categoria está no FormData
            if (selectedCategory?.id && !formData.get('id_categoria')) {
                formData.set('id_categoria', selectedCategory.id.toString());
            }

            // Converter valores formatados para números
            const valorInicialNum = parseFloat(valorInicial.replace(/\./g, '').replace(',', '.'));
            const valorAtualNum = parseFloat(valorAtual.replace(/\./g, '').replace(',', '.'));

            formData.set('valor_inicial', valorInicialNum.toString());
            formData.set('valor_atual', valorAtualNum.toString());

            await savePatrimonio(formData);

            toast.success("Patrimônio criado com sucesso!");
            onClose();
            if (onSuccess) onSuccess();
        } catch (error) {
            toast.error("Erro ao criar patrimônio");
            console.error('Erro ao criar patrimônio:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!selectedCategory) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="bg-[#1F1F1F] rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl border border-[#2c2c2c]"
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-8">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-1">Adicionar Patrimônio</h2>
                                    <p className="text-sm text-[#8c8888] flex items-center gap-2">
                                        <span className="inline-block w-2 h-2 rounded-full bg-[#F6CF45]"></span>
                                        Categoria: <span className="text-[#F6CF45] font-medium">{selectedCategory.name}</span>
                                    </p>
                                </div>
                                <button
                                    className="group p-2 rounded-lg hover:bg-[#2c2c2c] transition-all duration-300"
                                    onClick={onClose}
                                >
                                    <MdClose className="w-5 h-5 text-[#8c8888] group-hover:text-white transition-colors" />
                                </button>
                            </div>

                            <form className="space-y-6" onSubmit={handleSubmit}>
                                {/* Campo hidden para ID da categoria */}
                                <input type="hidden" name="id_categoria" value={selectedCategory?.id || ''} />
                                {selectedCategory?.id && (
                                    <input type="hidden" name="categoria_id_backup" value={selectedCategory.id} />
                                )}
                                
                                {/* Primeira linha - Nome e Desvalorização */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="group">
                                        <label className="block text-xs text-[#8c8888] mb-2 group-focus-within:text-[#F6CF45] transition-colors">
                                            Nome do Patrimônio
                                        </label>
                                        <input
                                            autoComplete='off'
                                            type="text"
                                            name="nome"
                                            required
                                            className="w-full bg-[#2c2c2c] text-white px-4 py-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-[#F6CF45] focus:border-transparent placeholder-[#666666] transition-all duration-300"
                                            placeholder="Ex: Notebook Dell Inspiron"
                                        />
                                    </div>

                                    <div className="group">
                                        <label className="block text-xs text-[#8c8888] mb-2 group-focus-within:text-[#F6CF45] transition-colors">
                                            Taxa de Depreciação (% ao ano)
                                            {isLoadingPadroes && (
                                                <span className="ml-2 text-[#F6CF45]">carregando...</span>
                                            )}
                                        </label>
                                        <input
                                            autoComplete='off'
                                            type="number"
                                            name="tempo_depreciacao"
                                            required
                                            min="0"
                                            max="100"
                                            step="0.01"
                                            value={taxaDepreciacao}
                                            onChange={(e) => setTaxaDepreciacao(e.target.value)}
                                            className="w-full bg-[#2c2c2c] text-white px-4 py-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-[#F6CF45] focus:border-transparent placeholder-[#666666] transition-all duration-300"
                                            placeholder="20"
                                        />
                                        {selectedCategory?.padrao_depreciacao_id && padroesDepreciacao.length > 0 && (
                                            <p className="text-xs text-[#F6CF45] mt-1">
                                                ✓ Valor baseado no padrão da categoria (editável)
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Segunda linha - Descrição, Localização e Valor Inicial */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="group">
                                        <label className="block text-xs text-[#8c8888] mb-2 group-focus-within:text-[#F6CF45] transition-colors">
                                            Descrição
                                        </label>
                                        <textarea
                                            name="descricao"
                                            rows={3}
                                            className="w-full bg-[#2c2c2c] text-white px-4 py-3 rounded-lg border border-transparent h-[9.3rem] focus:outline-none focus:ring-2 focus:ring-[#F6CF45] focus:border-transparent resize-none placeholder-[#666666] transition-all duration-300"
                                            placeholder="Especificações técnicas, características, modelo..."
                                        ></textarea>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="group">
                                            <label className="block text-xs text-[#8c8888] mb-2 group-focus-within:text-[#F6CF45] transition-colors">
                                                Localização
                                            </label>
                                            <input
                                                autoComplete='off'
                                                type="text"
                                                name="localizacao"
                                                className="w-full bg-[#2c2c2c] text-white px-4 py-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-[#F6CF45] focus:border-transparent placeholder-[#666666] transition-all duration-300"
                                                placeholder="Sala 205, Andar 2, Prédio A"
                                            />
                                        </div>

                                        <div className="group">
                                            <label className="block text-xs text-[#8c8888] mb-2 group-focus-within:text-[#F6CF45] transition-colors">
                                                Valor Inicial (R$)
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#8c8888]">R$</span>
                                                <input
                                                    autoComplete='off'
                                                    type="text"
                                                    name="valor_inicial"
                                                    required
                                                    value={valorInicial}
                                                    onChange={(e) => {
                                                        const formatted = formatarValor(e.target.value);
                                                        setValorInicial(formatted);
                                                    }}
                                                    className="w-full bg-[#2c2c2c] text-white pl-10 pr-4 py-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-[#F6CF45] focus:border-transparent placeholder-[#666666] transition-all duration-300"
                                                    placeholder="3.500,00"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Terceira linha - Código, Data e Valor Atual */}
                                <div className="grid grid-cols-3 gap-6">
                                    <div className="group">
                                        <label className="block text-xs text-[#8c8888] mb-2 group-focus-within:text-[#F6CF45] transition-colors">
                                            Código do Patrimônio
                                        </label>
                                        <input
                                            autoComplete='off'
                                            type="text"
                                            name="codigo"
                                            className="w-full bg-[#2c2c2c] text-white px-4 py-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-[#F6CF45] focus:border-transparent placeholder-[#666666] transition-all duration-300"
                                            placeholder="PAT-2024-001"
                                        />
                                    </div>

                                    <div className="group">
                                        <label className="block text-xs text-[#8c8888] mb-2 group-focus-within:text-[#F6CF45] transition-colors">
                                            Data de Aquisição
                                        </label>
                                        <input
                                            autoComplete='off'
                                            type="date"
                                            name="data_aquisicao"
                                            required
                                            value={dataAquisicao}
                                            onChange={(e) => setDataAquisicao(e.target.value)}
                                            className="w-full bg-[#2c2c2c] text-white px-4 py-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-[#F6CF45] focus:border-transparent transition-all duration-300 [color-scheme:dark]"
                                        />
                                    </div>

                                    <div className="group">
                                        <label className="block text-xs text-[#8c8888] mb-2 group-focus-within:text-[#F6CF45] transition-colors">
                                            Valor Atual (R$)
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#8c8888]">R$</span>
                                            <input
                                                autoComplete='off'
                                                type="text"
                                                name="valor_atual"
                                                required
                                                value={valorAtual}
                                                onChange={(e) => {
                                                    const formatted = formatarValor(e.target.value);
                                                    setValorAtual(formatted);
                                                }}
                                                className="w-full bg-[#2c2c2c] text-white pl-10 pr-4 py-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-[#F6CF45] focus:border-transparent placeholder-[#666666] transition-all duration-300"
                                                placeholder="2.800,00"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Botões de ação */}
                                <div className="flex items-center justify-between pt-6 border-t border-[#2c2c2c]">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-6 py-2.5 text-[#8c8888] hover:text-white transition-colors duration-300"
                                    >
                                        Cancelar
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="group px-8 py-2.5 bg-[#F6CF45] text-black font-medium rounded-lg hover:bg-[#F6CF45]/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {isLoading ? (
                                            <>
                                                <AiOutlineLoading3Quarters className="animate-spin h-4 w-4" />
                                                Salvando...
                                            </>
                                        ) : (
                                            <>
                                                <MdCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                                Salvar Patrimônio
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}