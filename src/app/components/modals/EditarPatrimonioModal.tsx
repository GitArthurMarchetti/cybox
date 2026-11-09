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
        return valorNumerico.toLocaleString('en-US', {
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
                valor_inicial: patrimonio.preco_inicial ? Number(patrimonio.preco_inicial).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '',
                valor_atual: patrimonio.valor_atual ? Number(patrimonio.valor_atual).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '',
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


            const valorInicialNum = parseFloat(formData.valor_inicial.replace(/,/g, ''));
            const valorAtualNum = parseFloat(formData.valor_atual.replace(/,/g, ''));

            formDataToSend.set('valor_inicial', valorInicialNum.toString());
            formDataToSend.set('valor_atual', valorAtualNum.toString());

            const resultado = await savePatrimonio(formDataToSend);
            if (!resultado.success) {
                toast.error(resultado.error || "Couldn't update the asset");
                return;
            }

            toast.success("Asset updated");
            onClose();
            if (onSuccess) onSuccess();
        } catch (error) {
            toast.error("Couldn't update the asset");
        } finally {
            setIsLoading(false);
        }
    };

    if (!patrimonio) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl">
                        
                        <ModalHeader
                            icone={<MdEdit size={20} />}
                            titulo="Edit asset"
                            subtitulo={<>{patrimonio.name}</>}
                            onClose={onClose}
                        />

                        
                        <div className="p-6 max-h-[70vh] overflow-y-auto">
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                                    <div>
                                        <label className="block text-sm text-muted mb-2">Asset name</label>
                                        <input
                                            autoComplete='off'
                                            type="text"
                                            name="nome"
                                            required
                                            value={formData.nome}
                                            onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                                            className="w-full bg-surface-2 text-white px-4 py-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-subtle transition-all duration-300"
                                            placeholder="e.g. Dell XPS 13"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm text-muted mb-2">Asset code</label>
                                        <input
                                            autoComplete='off'
                                            type="text"
                                            name="codigo"
                                            value={formData.codigo}
                                            onChange={(e) => setFormData(prev => ({ ...prev, codigo: e.target.value }))}
                                            className="w-full bg-surface-2 text-white px-4 py-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-subtle transition-all duration-300"
                                            placeholder="e.g. CYB-0142"
                                        />
                                    </div>
                                </div>

                                
                                <div>
                                    <label className="block text-sm text-muted mb-2">Description</label>
                                    <textarea
                                        name="descricao"
                                        value={formData.descricao}
                                        onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                                        rows={3}
                                        className="w-full bg-surface-2 text-white px-4 py-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none placeholder-subtle transition-all duration-300"
                                        placeholder="Model, specs, serial number…"
                                    />
                                </div>

                                
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                                    <div>
                                        <label className="block text-sm text-muted mb-2">Location</label>
                                        <input
                                            autoComplete='off'
                                            type="text"
                                            name="localizacao"
                                            value={formData.localizacao}
                                            onChange={(e) => setFormData(prev => ({ ...prev, localizacao: e.target.value }))}
                                            className="w-full bg-surface-2 text-white px-4 py-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-subtle transition-all duration-300"
                                            placeholder="e.g. Desk 12, 2nd floor"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm text-muted mb-2">Depreciation rate (% per year)</label>
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
                                        <label className="block text-sm text-muted mb-2">Purchase price ($)</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-subtle">$</span>
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
                                                placeholder="3,500.00"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-muted mb-2">Value today ($)</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-subtle">$</span>
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
                                                placeholder="2,800.00"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-muted mb-2">Purchase date</label>
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
                                    <h4 className="text-white font-medium mb-3">Right now</h4>
                                    <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-3 sm:gap-4">
                                        <div>
                                            <p className="text-subtle">Value today</p>
                                            <p className="text-primary font-medium">
                                                {formData.valor_atual ? `$${formData.valor_atual}` : '$0.00'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-subtle">Value lost</p>
                                            <p className="text-red-400 font-medium">
                                                {formData.valor_inicial && formData.valor_atual ? (
                                                    `$${(
                                                        parseFloat(formData.valor_inicial.replace(/,/g, '')) -
                                                        parseFloat(formData.valor_atual.replace(/,/g, ''))
                                                    ).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                                ) : '$0.00'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-subtle">Value left</p>
                                            <p className="text-green-400 font-medium">
                                                {formData.valor_inicial && formData.valor_atual ? (
                                                    `${Math.round((
                                                        parseFloat(formData.valor_atual.replace(/,/g, '')) /
                                                        parseFloat(formData.valor_inicial.replace(/,/g, ''))
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
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex items-center gap-2 px-8 py-2.5 bg-primary text-black font-medium rounded-lg hover:bg-primary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <>
                                                <AiOutlineLoading3Quarters className="animate-spin h-4 w-4" />
                                                Saving…
                                            </>
                                        ) : (
                                            <>
                                                <MdSave size={16} />
                                                Save changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Modal>
    );
}