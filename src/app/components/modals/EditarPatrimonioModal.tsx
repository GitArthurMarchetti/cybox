"use client"

import { Modal, ModalHeader } from '@/components/ui/modal';
import { useState, useEffect } from 'react';
import { MdEdit, MdSave } from 'react-icons/md';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { savePatrimonio } from '@/app/services/patrimonios';
import { toast } from 'sonner';

interface PatrimonioDetalhado {
    id?: number;
    name: string;
    codigo?: string;
    especificacoes?: string | null;
    data_aquisicao?: string;
    local?: string | null;
    preco_inicial?: number;
    valor_atual?: number;
    depreciacao_percentual?: number;
}

interface EditarPatrimonioModalProps {
    isOpen: boolean;
    onClose: () => void;
    patrimonio: PatrimonioDetalhado | null;
    categoryId?: number | null;
    onSuccess?: () => void;
}

export default function EditarPatrimonioModal({ 
    isOpen, 
    onClose, 
    patrimonio,
    categoryId,
    onSuccess 
}: EditarPatrimonioModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        nome: '',
        codigo: '',
        descricao: '',
        localizacao: '',
        valor_inicial: '',
        valor_atual: '',
        taxa_depreciacao: '',
        data_aquisicao: ''
    });

    const formatarValor = (valor: string) => {
        const numero = valor.replace(/\D/g, '');
        if (numero === '') return '';
        const valorNumerico = parseInt(numero) / 100;
        return valorNumerico.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    useEffect(() => {
        if (isOpen && patrimonio) {
            setFormData({
                nome: patrimonio.name || '',
                codigo: patrimonio.codigo || '',
                descricao: patrimonio.especificacoes || '',
                localizacao: patrimonio.local || '',
                valor_inicial: patrimonio.preco_inicial ? patrimonio.preco_inicial.toString().replace('.', ',') : '',
                valor_atual: patrimonio.valor_atual ? patrimonio.valor_atual.toString().replace('.', ',') : '',
                taxa_depreciacao: patrimonio.depreciacao_percentual?.toString() || '',
                data_aquisicao: patrimonio.data_aquisicao ? patrimonio.data_aquisicao.split('T')[0] : ''
            });
        }
    }, [isOpen, patrimonio]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!patrimonio?.id) return;

        setIsLoading(true);

        try {
            const formDataToSend = new FormData(event.currentTarget);
            formDataToSend.append('id', patrimonio.id.toString());
            
            if (categoryId) {
                formDataToSend.append('id_categoria', categoryId.toString());
            }


            const valorInicialNum = parseFloat(formData.valor_inicial.replace(/\./g, '').replace(',', '.'));
            const valorAtualNum = parseFloat(formData.valor_atual.replace(/\./g, '').replace(',', '.'));

            formDataToSend.set('valor_inicial', valorInicialNum.toString());
            formDataToSend.set('valor_atual', valorAtualNum.toString());

            const resultado = await savePatrimonio(formDataToSend);
            if (!resultado.success) {
                toast.error(resultado.error || 'Erro ao atualizar patrimônio');
                return;
            }

            toast.success("Patrimônio atualizado com sucesso!");
            onClose();
            if (onSuccess) onSuccess();
        } catch (error) {
            toast.error("Erro ao atualizar patrimônio");
        } finally {
            setIsLoading(false);
        }
    };

    if (!patrimonio) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl">
                        
                        <ModalHeader
                            icone={<MdEdit size={20} />}
                            titulo="Editar Patrimônio"
                            subtitulo={<>{patrimonio.name}</>}
                            onClose={onClose}
                        />

                        
                        <div className="p-6 max-h-[70vh] overflow-y-auto">
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                                    <div>
                                        <label className="block text-sm text-muted mb-2">Nome do Patrimônio</label>
                                        <input
                                            autoComplete='off'
                                            type="text"
                                            name="nome"
                                            required
                                            value={formData.nome}
                                            onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                                            className="w-full bg-surface-2 text-white px-4 py-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-subtle transition-all duration-300"
                                            placeholder="Ex: Notebook Dell Inspiron"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm text-muted mb-2">Código do Patrimônio</label>
                                        <input
                                            autoComplete='off'
                                            type="text"
                                            name="codigo"
                                            value={formData.codigo}
                                            onChange={(e) => setFormData(prev => ({ ...prev, codigo: e.target.value }))}
                                            className="w-full bg-surface-2 text-white px-4 py-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-subtle transition-all duration-300"
                                            placeholder="PAT-2024-001"
                                        />
                                    </div>
                                </div>

                                
                                <div>
                                    <label className="block text-sm text-muted mb-2">Descrição</label>
                                    <textarea
                                        name="descricao"
                                        value={formData.descricao}
                                        onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                                        rows={3}
                                        className="w-full bg-surface-2 text-white px-4 py-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none placeholder-subtle transition-all duration-300"
                                        placeholder="Especificações técnicas, características, modelo..."
                                    />
                                </div>

                                
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                                    <div>
                                        <label className="block text-sm text-muted mb-2">Localização</label>
                                        <input
                                            autoComplete='off'
                                            type="text"
                                            name="localizacao"
                                            value={formData.localizacao}
                                            onChange={(e) => setFormData(prev => ({ ...prev, localizacao: e.target.value }))}
                                            className="w-full bg-surface-2 text-white px-4 py-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-subtle transition-all duration-300"
                                            placeholder="Sala 205, Andar 2, Prédio A"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm text-muted mb-2">Taxa de Depreciação (% ao ano)</label>
                                        <input
                                            autoComplete='off'
                                            type="number"
                                            name="tempo_depreciacao"
                                            required
                                            min="0.01"
                                            max="100"
                                            step="0.01"
                                            value={formData.taxa_depreciacao}
                                            onChange={(e) => setFormData(prev => ({ ...prev, taxa_depreciacao: e.target.value }))}
                                            className="w-full bg-surface-2 text-white px-4 py-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-subtle transition-all duration-300"
                                            placeholder="20"
                                        />
                                    </div>
                                </div>

                                
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
                                    <div>
                                        <label className="block text-sm text-muted mb-2">Valor Inicial (R$)</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-subtle">R$</span>
                                            <input
                                                autoComplete='off'
                                                type="text"
                                                name="valor_inicial"
                                                required
                                                value={formData.valor_inicial}
                                                onChange={(e) => {
                                                    const formatted = formatarValor(e.target.value);
                                                    setFormData(prev => ({ ...prev, valor_inicial: formatted }));
                                                }}
                                                className="w-full bg-surface-2 text-white pl-10 pr-4 py-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-subtle transition-all duration-300"
                                                placeholder="3.500,00"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-muted mb-2">Valor Atual (R$)</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-subtle">R$</span>
                                            <input
                                                autoComplete='off'
                                                type="text"
                                                name="valor_atual"
                                                required
                                                value={formData.valor_atual}
                                                onChange={(e) => {
                                                    const formatted = formatarValor(e.target.value);
                                                    setFormData(prev => ({ ...prev, valor_atual: formatted }));
                                                }}
                                                className="w-full bg-surface-2 text-white pl-10 pr-4 py-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-subtle transition-all duration-300"
                                                placeholder="2.800,00"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-muted mb-2">Data de Aquisição</label>
                                        <input
                                            autoComplete='off'
                                            type="date"
                                            name="data_aquisicao"
                                            required
                                            max={new Date().toLocaleDateString('en-CA')}
                                            value={formData.data_aquisicao}
                                            onChange={(e) => setFormData(prev => ({ ...prev, data_aquisicao: e.target.value }))}
                                            className="w-full bg-surface-2 text-white px-4 py-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 [color-scheme:dark]"
                                        />
                                    </div>
                                </div>

                                
                                <div className="bg-surface-2 rounded-lg p-4 border border-surface-3">
                                    <h4 className="text-white font-medium mb-3">Status Atual</h4>
                                    <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-3 sm:gap-4">
                                        <div>
                                            <p className="text-subtle">Valor de mercado</p>
                                            <p className="text-primary font-medium">
                                                {formData.valor_atual ? `R$ ${formData.valor_atual}` : 'R$ 0,00'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-subtle">Depreciação total</p>
                                            <p className="text-red-400 font-medium">
                                                {formData.valor_inicial && formData.valor_atual ? (
                                                    `R$ ${(
                                                        parseFloat(formData.valor_inicial.replace(/\./g, '').replace(',', '.')) -
                                                        parseFloat(formData.valor_atual.replace(/\./g, '').replace(',', '.'))
                                                    ).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                                ) : 'R$ 0,00'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-subtle">Percentual restante</p>
                                            <p className="text-green-400 font-medium">
                                                {formData.valor_inicial && formData.valor_atual ? (
                                                    `${Math.round((
                                                        parseFloat(formData.valor_atual.replace(/\./g, '').replace(',', '.')) /
                                                        parseFloat(formData.valor_inicial.replace(/\./g, '').replace(',', '.'))
                                                    ) * 100)}%`
                                                ) : '0%'}
                                            </p>
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
                                        className="flex items-center gap-2 px-8 py-2.5 bg-primary text-black font-medium rounded-lg hover:bg-primary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <>
                                                <AiOutlineLoading3Quarters className="animate-spin h-4 w-4" />
                                                Salvando...
                                            </>
                                        ) : (
                                            <>
                                                <MdSave size={16} />
                                                Salvar Alterações
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Modal>
    );
}