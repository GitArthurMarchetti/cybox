"use client"

import { Modal, ModalHeader } from '@/components/ui/modal';
import { useState, useEffect } from 'react';
import { savePatrimonio } from '@/app/services/patrimonios';
import { getPadroesDepreciacao } from '@/app/services/categoria';
import { PadraoDepreciacaoType } from '@/lib/types/types';
import { toast } from 'sonner';
import { MdAddBox, MdCheck } from 'react-icons/md';
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
    const [padroesDepreciacao, setPadroesDepreciacao] = useState<PadraoDepreciacaoType[]>([]);
    const [isLoadingPadroes, setIsLoadingPadroes] = useState(false);

    const formatarValor = (valor: string) => {
        const numero = valor.replace(/\D/g, '');
        if (numero === '') return '';
        const valorNumerico = parseInt(numero) / 100;
        return valorNumerico.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const calcularValorAtual = (valorInicialStr: string, taxaStr: string, dataAquisicaoStr: string) => {
        const valorInicialNum = parseFloat(valorInicialStr.replace(/\./g, '').replace(',', '.'));
        const taxaNum = parseFloat(taxaStr);

        if (!isNaN(valorInicialNum) && !isNaN(taxaNum) && taxaNum >= 0 && taxaNum <= 100 && dataAquisicaoStr) {
            const dataAquisicaoDate = new Date(dataAquisicaoStr);
            const dataAtual = new Date();

            const diferencaEmAnos = (dataAtual.getTime() - dataAquisicaoDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);

            const depreciacaoTotal = Math.min(taxaNum * diferencaEmAnos, 100);
            const valorAtualCalculado = valorInicialNum * (1 - depreciacaoTotal / 100);

            return Math.max(0, valorAtualCalculado).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }
        return '';
    };

    useEffect(() => {
        if (valorInicial && taxaDepreciacao && dataAquisicao) {
            const novoValorAtual = calcularValorAtual(valorInicial, taxaDepreciacao, dataAquisicao);
            setValorAtual(novoValorAtual);
        }
    }, [valorInicial, taxaDepreciacao, dataAquisicao]);

    useEffect(() => {
        if (isOpen) {
            setValorInicial('');
            setValorAtual('');
            setTaxaDepreciacao('');
            setDataAquisicao('');
            
            const carregarPadroes = async () => {
                setIsLoadingPadroes(true);
                try {
                    const padroes = await getPadroesDepreciacao();
                    setPadroesDepreciacao(padroes);
                    
                    if (selectedCategory?.padrao_depreciacao_id) {
                        const padrao = padroes.find(p => p.id === selectedCategory.padrao_depreciacao_id);
                        if (padrao) {
                            setTaxaDepreciacao(padrao.taxa_anual_percent.toString());
                        }
                    }
                } catch (error) {
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

            if (selectedCategory?.id && !formData.get('id_categoria')) {
                formData.set('id_categoria', selectedCategory.id.toString());
            }

            const valorInicialNum = parseFloat(valorInicial.replace(/\./g, '').replace(',', '.'));
            const valorAtualNum = parseFloat(valorAtual.replace(/\./g, '').replace(',', '.'));

            formData.set('valor_inicial', valorInicialNum.toString());
            formData.set('valor_atual', valorAtualNum.toString());

            const resultado = await savePatrimonio(formData);
            if (!resultado.success) {
                toast.error(resultado.error || 'Erro ao criar patrimônio');
                return;
            }

            toast.success("Patrimônio criado com sucesso!");
            onClose();
            if (onSuccess) onSuccess();
        } catch (error) {
            toast.error("Erro ao criar patrimônio");
        } finally {
            setIsLoading(false);
        }
    };

    if (!selectedCategory) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-3xl">
                        <ModalHeader
                            icone={<MdAddBox size={20} />}
                            titulo="Adicionar patrimônio"
                            subtitulo={<>Categoria: <span className="font-medium text-primary">{selectedCategory.name}</span></>}
                            onClose={onClose}
                        />
                        <div className="p-5 sm:p-8">

                            <form className="space-y-6" onSubmit={handleSubmit}>
                                
                                <input type="hidden" name="id_categoria" value={selectedCategory?.id || ''} />
                                {selectedCategory?.id && (
                                    <input type="hidden" name="categoria_id_backup" value={selectedCategory.id} />
                                )}
                                
                                
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                                    <div className="group">
                                        <label className="block text-xs text-subtle mb-2 group-focus-within:text-primary transition-colors">
                                            Nome do Patrimônio
                                        </label>
                                        <input
                                            autoComplete='off'
                                            type="text"
                                            name="nome"
                                            required
                                            className="w-full bg-surface-2 text-white px-4 py-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-subtle transition-all duration-300"
                                            placeholder="Ex: Notebook Dell Inspiron"
                                        />
                                    </div>

                                    <div className="group">
                                        <label className="block text-xs text-subtle mb-2 group-focus-within:text-primary transition-colors">
                                            Taxa de Depreciação (% ao ano)
                                            {isLoadingPadroes && (
                                                <span className="ml-2 text-primary">carregando...</span>
                                            )}
                                        </label>
                                        <input
                                            autoComplete='off'
                                            type="number"
                                            name="tempo_depreciacao"
                                            required
                                            min="0.01"
                                            max="100"
                                            step="0.01"
                                            value={taxaDepreciacao}
                                            onChange={(e) => setTaxaDepreciacao(e.target.value)}
                                            className="w-full bg-surface-2 text-white px-4 py-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-subtle transition-all duration-300"
                                            placeholder="20"
                                        />
                                        {selectedCategory?.padrao_depreciacao_id && padroesDepreciacao.length > 0 && (
                                            <p className="text-xs text-primary mt-1">
                                                ✓ Valor baseado no padrão da categoria (editável)
                                            </p>
                                        )}
                                    </div>
                                </div>

                                
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                                    <div className="group">
                                        <label className="block text-xs text-subtle mb-2 group-focus-within:text-primary transition-colors">
                                            Descrição
                                        </label>
                                        <textarea
                                            name="descricao"
                                            rows={3}
                                            className="w-full bg-surface-2 text-white px-4 py-3 rounded-lg border border-transparent h-[9.3rem] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none placeholder-subtle transition-all duration-300"
                                            placeholder="Especificações técnicas, características, modelo..."
                                        ></textarea>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="group">
                                            <label className="block text-xs text-subtle mb-2 group-focus-within:text-primary transition-colors">
                                                Localização
                                            </label>
                                            <input
                                                autoComplete='off'
                                                type="text"
                                                name="localizacao"
                                                className="w-full bg-surface-2 text-white px-4 py-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-subtle transition-all duration-300"
                                                placeholder="Sala 205, Andar 2, Prédio A"
                                            />
                                        </div>

                                        <div className="group">
                                            <label className="block text-xs text-subtle mb-2 group-focus-within:text-primary transition-colors">
                                                Valor Inicial (R$)
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-subtle">R$</span>
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
                                                    className="w-full bg-surface-2 text-white pl-10 pr-4 py-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-subtle transition-all duration-300"
                                                    placeholder="3.500,00"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
                                    <div className="group">
                                        <label className="block text-xs text-subtle mb-2 group-focus-within:text-primary transition-colors">
                                            Código do Patrimônio
                                        </label>
                                        <input
                                            autoComplete='off'
                                            type="text"
                                            name="codigo"
                                            className="w-full bg-surface-2 text-white px-4 py-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-subtle transition-all duration-300"
                                            placeholder="PAT-2024-001"
                                        />
                                    </div>

                                    <div className="group">
                                        <label className="block text-xs text-subtle mb-2 group-focus-within:text-primary transition-colors">
                                            Data de Aquisição
                                        </label>
                                        <input
                                            autoComplete='off'
                                            type="date"
                                            name="data_aquisicao"
                                            required
                                            max={new Date().toLocaleDateString('en-CA')}
                                            value={dataAquisicao}
                                            onChange={(e) => setDataAquisicao(e.target.value)}
                                            className="w-full bg-surface-2 text-white px-4 py-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 [color-scheme:dark]"
                                        />
                                    </div>

                                    <div className="group">
                                        <label className="block text-xs text-subtle mb-2 group-focus-within:text-primary transition-colors">
                                            Valor Atual (R$)
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-subtle">R$</span>
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
                                                className="w-full bg-surface-2 text-white pl-10 pr-4 py-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-subtle transition-all duration-300"
                                                placeholder="2.800,00"
                                            />
                                        </div>
                                    </div>
                                </div>

                                
                                <div className="flex items-center justify-between pt-6 border-t border-line">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-6 py-2.5 text-subtle hover:text-white transition-colors duration-300"
                                    >
                                        Cancelar
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="group px-8 py-2.5 bg-primary text-black font-medium rounded-lg hover:bg-primary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                    </Modal>
    );
}