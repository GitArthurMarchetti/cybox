'use client'

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navigation/navbar';
import { DepartamentoType, UserType } from '@/lib/types/types';
import { MembroDepartamento } from '@/app/services/membros';
import { motion, AnimatePresence } from 'framer-motion';
import { IoMdSearch } from 'react-icons/io';
import { MdFilterList, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdModeEdit, MdSearch, MdAdd } from 'react-icons/md';
import { RiDeleteBinLine } from 'react-icons/ri';
import { FaShare, FaArrowLeft, FaChartLine, FaFilter, FaPlus } from 'react-icons/fa';
import Image from 'next/image';
import { SidebarCategorias } from '@/app/components/Navigation/SidebarCategorias';
import { useRouter } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { getPatrimoniosByCategoria, removePatrimonio } from '@/app/services/patrimonios';
import { removeCategoria, getCategoriasComTotalPatrimonios } from '@/app/services/categoria';
import { getDepartamentosById, removeDepartamento } from '@/app/services/departamento';
import { toast } from 'sonner';
import {
     CriarCategoriaModal,
     CriarPatrimonioModal,
     EditarCategoriaModal,
     EditarPatrimonioModal,
     ConfiguracoesDepartamentoModal,
     ConfirmarExclusaoModal,
     CompartilharModal,
     DetalhesPatrimonioModal
} from '@/app/components/modals';
import { enviarConvitesPorEmail } from '@/app/services/convites';
import { getPadroesDepreciacao } from '@/app/services/categoria';


// Definindo a interface para o tipo da categoria
interface Category {
     id: number;
     name: string;
     observation: string;
     total: number;
     notebooks?: PatrimonioDetalhadoType[];
     padrao_depreciacao_id?: number | null;
}

// Interface para o patrimônio detalhado
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

// Interface para os gastos
interface GastoType {
     id: number;
     tipo: string;
     descricao: string;
     valor: number;
     data: string;
}

interface CategoriasProps {
     departamento: DepartamentoType;
     user: UserType;
     host: UserType | null;
     membros: MembroDepartamento[];
     categorias: any[];
}

export default function CategoriaFront({
     departamento,
     user,
     host,
     membros = [],
     categorias = []
}: CategoriasProps) {
     // Encontrar o role do usuário atual no departamento
     const currentUserMembro = membros.find(m => m.id === user.id);
     const userRole = currentUserMembro?.role || 'member';
     const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
     const [searchTerm, setSearchTerm] = useState("");
     const [isLoaded, setIsLoaded] = useState(false);
     const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);
     const [isAddNewOpen, setIsAddNewOpen] = useState(false);
     const [isAddPatrimonioOpen, setIsAddPatrimonioOpen] = useState(false);
     const [selectedCategoryForPatrimonio, setSelectedCategoryForPatrimonio] = useState<Category | null>(null);
     const [isEditCategoriaOpen, setIsEditCategoriaOpen] = useState(false);
     const [selectedCategoryForEdit, setSelectedCategoryForEdit] = useState<Category | null>(null);
     const [isEditPatrimonioOpen, setIsEditPatrimonioOpen] = useState(false);
     const [selectedPatrimonioForEdit, setSelectedPatrimonioForEdit] = useState<PatrimonioDetalhadoType | null>(null);
     const [isConfigDepartamentoOpen, setIsConfigDepartamentoOpen] = useState(false);
     const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
     const [itemToDelete, setItemToDelete] = useState<{ tipo: string, nome: string, onConfirm: () => void } | null>(null);
     const [isShareModalOpen, setIsShareModalOpen] = useState(false);
     const router = useRouter();


     // Função para abrir modal de patrimônio
     const handleOpenPatrimonioModal = (category: Category) => {
          setSelectedCategoryForPatrimonio(category);
          setIsAddPatrimonioOpen(true);
     };

     // Estados para o modal de detalhes do patrimônio
     const [isModalOpen, setIsModalOpen] = useState(false);
     const [selectedPatrimonio, setSelectedPatrimonio] = useState<PatrimonioDetalhadoType | null>(null);
     

     // Função para gerar dados de depreciação para o gráfico
     const gerarDadosDepreciacao = (dataAquisicao: string, valorInicial: number, valorAtual: number) => {
          if (!dataAquisicao || !valorInicial) return [];

          const dados = [];
          const dataInicio = new Date(dataAquisicao);
          const dataAtualDate = new Date();
          const mesesTotal = Math.ceil((dataAtualDate.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24 * 30));

          for (let i = 0; i <= Math.min(mesesTotal, 12); i++) {
               const data = new Date(dataInicio);
               data.setMonth(data.getMonth() + i);

               const depreciacaoMensal = (valorInicial - (valorAtual || 0)) / mesesTotal;
               const valorNaData = valorInicial - (depreciacaoMensal * i);

               dados.push({
                    data: data.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
                    valor: Math.max(0, valorNaData)
               });
          }

          return dados;
     };

     // Função para gerar dados de gastos para o gráfico
     const gerarDadosGastos = () => {
          const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
          return meses.map(mes => ({
               mes,
               valor: Math.random() * 500 + 100 // Dados de exemplo
          }));
     };

     // Função para carregar patrimônios de uma categoria
     const carregarPatrimonios = async (categoriaId: number, forceReload = false) => {
          if (patrimoniosPorCategoria[categoriaId] && !forceReload) {
               return; // Já carregados
          }

          setLoadingPatrimonios(prev => ({ ...prev, [categoriaId]: true }));

          try {
               const patrimonios = await getPatrimoniosByCategoria(categoriaId);
               const patrimoniosFormatados = patrimonios.map(p => ({
                    id: p.id,
                    name: p.nome,
                    codigo: p.codigo_patrimonio || `Sem código`,
                    finalValue: p.valor_atual && p.valor_inicial ? Math.round((p.valor_atual / p.valor_inicial) * 100) : 0,
                    especificacoes: p.descricao || null,
                    data_aquisicao: p.data_aquisicao,
                    local: p.localizacao || null,
                    preco_inicial: p.valor_inicial,
                    valor_atual: p.valor_atual,
                    depreciacao_percentual: p.tempo_depreciacao,
                    depreciacao_valor: p.valor_inicial ? p.valor_inicial - (p.valor_atual || 0) : 0,
                    gastos_totais: 0,
                    status: 1,
                    gastos: [],
                    depreciacao_historico: gerarDadosDepreciacao(p.data_aquisicao, p.valor_inicial, p.valor_atual),
                    gastos_mensais: gerarDadosGastos()
               }));

               setPatrimoniosPorCategoria(prev => ({
                    ...prev,
                    [categoriaId]: patrimoniosFormatados
               }));
          } catch (error) {
               console.error('Erro ao carregar patrimônios:', error);
               toast.error('Erro ao carregar patrimônios da categoria');
          } finally {
               setLoadingPatrimonios(prev => ({ ...prev, [categoriaId]: false }));
          }
     };

     // Estado para armazenar patrimônios de cada categoria
     const [patrimoniosPorCategoria, setPatrimoniosPorCategoria] = useState<{ [key: number]: PatrimonioDetalhadoType[] }>({});
     const [loadingPatrimonios, setLoadingPatrimonios] = useState<{ [key: number]: boolean }>({});
     const [categories, setCategories] = useState<Category[]>([]);
     const [padroesDepreciacao, setPadroesDepreciacao] = useState<any[]>([]);
     const [departamentoLocal, setDepartamentoLocal] = useState(departamento);

     // Controlar carregamento inicial para animações
     useEffect(() => {
          if (!hasInitiallyLoaded) {
               setIsLoaded(true);
               setHasInitiallyLoaded(true);
          }
     }, [hasInitiallyLoaded]);

     // Sincronizar departamento local com prop inicial
     useEffect(() => {
          setDepartamentoLocal(departamento);
     }, [departamento]);


     // Atualizar categorias quando patrimônios mudarem
     useEffect(() => {
          const updatedCategories: Category[] = categorias.map(cat => ({
               id: cat.id,
               name: cat.nome,
               observation: cat.descricao || (cat.padrao_categoria ? `Padrão: ${cat.padrao_categoria} (${cat.taxa_anual_percent}% a.a.)` : 'Sem descrição'),
               total: cat.total_patrimonios || 0,
               notebooks: patrimoniosPorCategoria[cat.id] || [],
               padrao_depreciacao_id: cat.padrao_depreciacao_id || null
          }));
          setCategories(updatedCategories);
     }, [categorias, patrimoniosPorCategoria]);


     // Função para recarregar dados do departamento
     const recarregarDepartamento = async () => {
          try {
               const departamentoAtualizado = await getDepartamentosById(Number(departamentoLocal.id_departamentos));
               if (departamentoAtualizado) {
                    setDepartamentoLocal(departamentoAtualizado);
               }
          } catch (error) {
               console.error('Erro ao recarregar departamento:', error);
               toast.error('Erro ao atualizar departamento');
          }
     };

     // Função para recarregar apenas as categorias
     const recarregarCategorias = async () => {
          try {
               const categoriasAtualizadas = await getCategoriasComTotalPatrimonios(Number(departamentoLocal.id_departamentos));
               
               // Atualizar o array de categorias com os novos dados
               const updatedCategories: Category[] = categoriasAtualizadas.map(cat => ({
                    id: cat.id,
                    name: cat.nome,
                    observation: cat.descricao || (cat.padrao_categoria ? `Padrão: ${cat.padrao_categoria} (${cat.taxa_anual_percent}% a.a.)` : 'Sem descrição'),
                    total: cat.total_patrimonios || 0,
                    notebooks: patrimoniosPorCategoria[cat.id] || [],
                    padrao_depreciacao_id: cat.padrao_depreciacao_id || null
               }));
               
               setCategories(updatedCategories);
          } catch (error) {
               console.error('Erro ao recarregar categorias:', error);
               toast.error('Erro ao atualizar categorias');
          }
     };

     // Função para atualizar departamento editado
     const handleDepartamentoSuccess = async (departamentoAtualizado: DepartamentoType) => {
          setIsConfigDepartamentoOpen(false);
          setDepartamentoLocal(departamentoAtualizado); // Atualizar estado local com dados atualizados
     };

     // Função para atualizar categoria editada
     const handleCategoriaSuccess = async () => {
          setIsEditCategoriaOpen(false);
          await recarregarCategorias(); // Recarregar apenas as categorias
     };

     // Função para enviar convites
     const handleInvite = async (emails: string[]) => {
          try {
               const result = await enviarConvitesPorEmail(
                    Number(departamentoLocal.id_departamentos),
                    user.id as string,
                    emails
               );

               if (result.success) {
                    toast.success(result.message);
               } else {
                    toast.error(result.message);
               }
          } catch (error) {
               console.error('Erro ao enviar convites:', error);
               toast.error('Erro ao enviar convites');
          }
     };

     // Obter categoria selecionada atualizada
     const getUpdatedSelectedCategory = () => {
          if (!selectedCategory) return null;
          return categories.find(cat => cat.id === selectedCategory.id) || selectedCategory;
     };

     // Filtrar categorias baseado na busca
     const filteredCategories = categories.filter(cat =>
          cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cat.observation.toLowerCase().includes(searchTerm.toLowerCase())
     );

     // Função para abrir o modal de detalhes do patrimônio
     const handleOpenModal = (patrimonio: PatrimonioDetalhadoType) => {
          setSelectedPatrimonio(patrimonio);
          setIsModalOpen(true);
     };

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

     // Carregar padrões de depreciação na inicialização
     useEffect(() => {
          const carregarPadroes = async () => {
               try {
                    const padroes = await getPadroesDepreciacao();
                    setPadroesDepreciacao(padroes);
               } catch (error) {
                    console.error('Erro ao carregar padrões de depreciação:', error);
               }
          };
          carregarPadroes();
     }, []);


     // Variantes de animação - só animam no carregamento inicial
     const containerVariants = hasInitiallyLoaded ? {
          visible: { opacity: 1 }
     } : {
          hidden: { opacity: 0 },
          visible: {
               opacity: 1,
               transition: {
                    duration: 0.4,
                    when: "beforeChildren",
                    staggerChildren: 0.1
               }
          }
     };

     const itemVariants = hasInitiallyLoaded ? {
          visible: { y: 0, opacity: 1 }
     } : {
          hidden: { y: 20, opacity: 0 },
          visible: {
               y: 0,
               opacity: 1,
               transition: { duration: 0.3 }
          }
     };

     return (
          <div className="min-h-screen bg-[#0F0F0F] text-white">
               {/* Navbar */}
               <Navbar type='2' user={user} />

               {/* Container principal */}
               <motion.div
                    className="flex border-t border-[#2c2c2c] h-[calc(100vh-5rem)]"
                    initial={hasInitiallyLoaded ? "visible" : "hidden"}
                    animate="visible"
                    variants={containerVariants}
               >
                    {/* Sidebar esquerda - Informações do departamento */}
                    <SidebarCategorias
                         departamento={departamentoLocal}
                         user={user}
                         host={host}
                         membros={membros}
                         onAddCategoryClick={() => setIsAddNewOpen(true)}
                         onConfigClick={() => setIsConfigDepartamentoOpen(true)}
                         onShareClick={() => setIsShareModalOpen(true)}
                         hasInitiallyLoaded={hasInitiallyLoaded}
                    />

                    {/* Conteúdo principal - Lista de categorias */}
                    <motion.main className="flex-1 flex flex-col overflow-hidden" variants={itemVariants}>
                         <motion.div className="flex items-center justify-between p-6 border-b border-[#2c2c2c]" variants={itemVariants}>
                              <h1 className="text-xl font-bold">Categorias</h1>
                              <div className="flex items-center gap-4">
                                   <div className="relative">
                                        <input
                                             autoComplete='off'
                                             type="text"
                                             placeholder="Buscar categoria..."
                                             className="bg-[#2c2c2c] text-white pl-10 pr-4 py-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-[#F6CF45]/50"
                                             value={searchTerm}
                                             onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8c8888]" size={20} />
                                   </div>
                                   <button className="p-2 bg-[#2c2c2c] text-[#8c8888] hover:text-white rounded-lg transition-colors duration-300">
                                        <MdFilterList size={20} />
                                   </button>
                              </div>
                         </motion.div>

                         <div className="flex flex-1 overflow-hidden">
                              {/* Painel esquerdo - Lista de categorias */}
                              <div className="w-2/3 overflow-y-auto p-6">
                                   {filteredCategories.length > 0 ? (
                                        <motion.div 
                                             className="space-y-4" 
                                             variants={containerVariants}
                                             initial={hasInitiallyLoaded ? "visible" : "hidden"}
                                             animate="visible"
                                        >
                                             {filteredCategories.map((category, index) => (
                                                  <motion.div
                                                       key={category.id}
                                                       className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${selectedCategory?.id === category.id
                                                            ? 'bg-[#2c2c2c] border-l-4 border-[#F6CF45]'
                                                            : 'bg-[#1a1a1a] hover:bg-[#2c2c2c]'
                                                            }`}
                                                       onClick={async () => {
                                                            // Primeiro carrega os patrimônios
                                                            await carregarPatrimonios(category.id);
                                                            // Depois seleciona a categoria
                                                            setSelectedCategory(category);
                                                       }}
                                                       variants={itemVariants}
                                                       initial={hasInitiallyLoaded ? "visible" : "hidden"}
                                                       animate="visible"
                                                       whileHover={hasInitiallyLoaded ? {} : { x: 5 }}
                                                       custom={index}
                                                  >
                                                       <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-4">
                                                                 <div className="w-12 h-12 bg-[#2c2c2c] rounded-lg flex items-center justify-center text-[#F6CF45]">
                                                                      {category.name.charAt(0)}
                                                                 </div>
                                                                 <div>
                                                                      <h3 className="font-medium text-white">{category.name}</h3>
                                                                      <p className="text-sm text-[#b4b4b4]">{category.observation}</p>
                                                                 </div>
                                                            </div>
                                                            <div className="flex items-center gap-6">
                                                                 <div className="text-right">
                                                                      <span className="text-sm text-[#b4b4b4]">Total de itens</span>
                                                                      <p className="text-lg font-semibold text-white">{category.total}</p>
                                                                 </div>
                                                                 <button className="text-[#F6CF45] hover:text-white transition-colors duration-300">
                                                                      <MdKeyboardArrowRight size={24} />
                                                                 </button>
                                                            </div>
                                                       </div>
                                                  </motion.div>
                                             ))}
                                        </motion.div>
                                   ) : (
                                        <motion.div className="flex flex-col items-center justify-center h-full text-center" variants={itemVariants}>
                                             <div className="bg-[#2c2c2c] p-6 rounded-xl mb-4">
                                                  <MdSearch className="text-[#F6CF45]" size={48} />
                                             </div>
                                             <h3 className="text-xl font-medium mb-2">Nenhuma categoria encontrada</h3>
                                             <p className="text-[#8c8888] max-w-md">
                                                  Não encontramos categorias com este termo. Tente outra busca ou crie uma nova categoria.
                                             </p>
                                             <button
                                                  className="mt-4 flex items-center gap-2 bg-[#F6CF45] text-black px-4 py-2 rounded-lg hover:bg-[#F6CF45]/90 transition-colors duration-300"
                                                  onClick={() => {
                                                       setSearchTerm("");
                                                       setIsAddNewOpen(true);
                                                  }}
                                             >
                                                  <MdAdd /> Criar nova categoria
                                             </button>
                                        </motion.div>
                                   )}
                              </div>

                              {/* Painel direito - Detalhes da categoria selecionada */}
                              <div className="w-1/3 border-l border-[#2c2c2c] overflow-y-auto">
                                   <AnimatePresence>
                                        {(() => {
                                             const currentCategory = getUpdatedSelectedCategory();
                                             return currentCategory ? (
                                                  <motion.div
                                                       className="p-6"
                                                       initial={{ opacity: 0, x: 20 }}
                                                       animate={{ opacity: 1, x: 0 }}
                                                       exit={{ opacity: 0, x: 20 }}
                                                       transition={{ duration: 0.3 }}
                                                  >
                                                       <div className="flex items-center gap-2 text-sm text-[#8c8888] cursor-pointer mb-4" onClick={() => setSelectedCategory(null)}>
                                                            <MdKeyboardArrowLeft size={20} /> Voltar para lista
                                                       </div>

                                                       <div className="flex items-center justify-between mb-6">
                                                            <h2 className="text-xl font-bold">{currentCategory.name}</h2>
                                                            <div className="flex items-center gap-2">
                                                                 <button
                                                                      className="p-2 bg-[#2c2c2c] text-[#F6CF45] hover:text-white rounded-lg transition-colors duration-300"
                                                                      onClick={() => {
                                                                           setSelectedCategoryForEdit(currentCategory);
                                                                           setIsEditCategoriaOpen(true);
                                                                      }}
                                                                 >
                                                                      <MdModeEdit size={18} />
                                                                 </button>
                                                                 <button
                                                                      className="p-2 bg-[#2c2c2c] text-red-500 hover:text-white rounded-lg transition-colors duration-300"
                                                                      onClick={() => {
                                                                           setItemToDelete({
                                                                                tipo: 'categoria',
                                                                                nome: currentCategory.name,
                                                                                onConfirm: async () => {
                                                                                     try {
                                                                                          await removeCategoria(currentCategory.id, Number(departamentoLocal.id_departamentos));
                                                                                          toast.success('Categoria excluída com sucesso!');
                                                                                          setSelectedCategory(null);
                                                                                          // Recarregar categorias para refletir a exclusão
                                                                                          await recarregarCategorias();
                                                                                     } catch (error) {
                                                                                          toast.error('Erro ao excluir categoria');
                                                                                          console.error('Erro ao excluir categoria:', error);
                                                                                     }
                                                                                }
                                                                           });
                                                                           setIsConfirmDeleteOpen(true);
                                                                      }}
                                                                 >
                                                                      <RiDeleteBinLine size={18} />
                                                                 </button>
                                                            </div>
                                                       </div>

                                                       <div className="bg-[#1a1a1a] p-4 rounded-xl mb-6">
                                                            <p className="text-[#b4b4b4] text-sm mb-2">Observação</p>
                                                            <p className="text-white">{currentCategory.observation}</p>
                                                       </div>

                                                       <div className="flex justify-between items-center mb-4">
                                                            <h3 className="font-medium">Patrimônios cadastrados</h3>
                                                            <button
                                                                 className="flex items-center gap-1 text-sm border-0 text-[#F6CF45] hover:text-white transition-colors duration-300"
                                                                 onClick={() => handleOpenPatrimonioModal(currentCategory)}
                                                            >
                                                                 <MdAdd size={16} /> Novo patrimônio
                                                            </button>
                                                       </div>

                                                       <div className="space-y-3">
                                                            {loadingPatrimonios[currentCategory.id] ? (
                                                                 <div className="flex items-center justify-center py-8">
                                                                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F6CF45]"></div>
                                                                      <span className="ml-3 text-[#8c8888]">Carregando patrimônios...</span>
                                                                 </div>
                                                            ) : (currentCategory.notebooks?.length || 0) > 0 ? (
                                                                 currentCategory.notebooks?.map((item, index) => (
                                                                      <motion.div
                                                                           key={index}
                                                                           className="bg-[#2c2c2c] p-3 rounded-lg flex items-center justify-between cursor-pointer hover:bg-[#353535] transition-colors"
                                                                           initial={hasInitiallyLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                                                                           animate={{ opacity: 1, y: 0 }}
                                                                           transition={hasInitiallyLoaded ? {} : { delay: index * 0.05, duration: 0.2 }}
                                                                           whileHover={hasInitiallyLoaded ? {} : { scale: 1.02 }}
                                                                           onClick={() => handleOpenModal(item)}
                                                                      >
                                                                           <div className="flex items-center gap-3">
                                                                                <div className={`w-10 h-10 rounded-lg ${item.finalValue >= 70 ? 'bg-green-500' : item.finalValue >= 50 ? 'bg-yellow-500' : 'bg-red-500'} flex items-center justify-center text-white font-bold`}>
                                                                                     {item.name.charAt(0)}
                                                                                </div>
                                                                                <span className="font-medium">{item.name}</span>
                                                                           </div>
                                                                           <div className="flex items-center gap-4">
                                                                                <div className="flex flex-col items-end">
                                                                                     <span className={`text-sm ${item.finalValue >= 70 ? 'text-green-500' : item.finalValue >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                                                                                          {item.finalValue}% valor
                                                                                     </span>
                                                                                     <span className="text-xs text-[#8c8888]">
                                                                                          Depreciação: {100 - item.finalValue}%
                                                                                     </span>
                                                                                </div>
                                                                                <button className="text-[#b4b4b4] hover:text-white transition-colors duration-300">
                                                                                     <MdKeyboardArrowRight size={20} />
                                                                                </button>
                                                                           </div>
                                                                      </motion.div>
                                                                 ))
                                                            ) : (
                                                                 <div className="text-center py-8 text-[#8c8888]">
                                                                      <p>Nenhum patrimônio cadastrado nesta categoria.</p>
                                                                      <button
                                                                           className="mt-2 text-[#F6CF45] hover:text-white transition-colors"
                                                                           onClick={() => handleOpenPatrimonioModal(currentCategory)}
                                                                      >
                                                                           Adicionar primeiro patrimônio
                                                                      </button>
                                                                 </div>
                                                            )}
                                                       </div>
                                                  </motion.div>
                                             ) : (
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
                                        })()}
                                   </AnimatePresence>
                              </div>
                         </div>
                    </motion.main>
               </motion.div>

               {/* Modal de detalhes do patrimônio */}
               <DetalhesPatrimonioModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    patrimonio={selectedPatrimonio}
                    onEdit={(patrimonio) => {
                         setSelectedPatrimonioForEdit(patrimonio);
                         setIsEditPatrimonioOpen(true);
                         setIsModalOpen(false);
                    }}
                    onDelete={(patrimonio) => {
                         setItemToDelete({
                              tipo: 'patrimonio',
                              nome: patrimonio.name,
                              onConfirm: async () => {
                                   try {
                                        if (patrimonio.id && selectedCategory) {
                                             await removePatrimonio(patrimonio.id, selectedCategory.id);
                                             toast.success('Patrimônio excluído com sucesso!');
                                             setIsModalOpen(false);
                                             carregarPatrimonios(selectedCategory.id, true);
                                        }
                                   } catch (error) {
                                        toast.error('Erro ao excluir patrimônio');
                                        console.error('Erro ao excluir patrimônio:', error);
                                   }
                              }
                         });
                         setIsConfirmDeleteOpen(true);
                         setIsModalOpen(false);
                    }}
               />

               {/* Modais */}
               <CriarCategoriaModal
                    isOpen={isAddNewOpen}
                    onClose={() => setIsAddNewOpen(false)}
                    departamentoId={departamentoLocal.id_departamentos}
                    onSuccess={async () => {
                         setIsAddNewOpen(false);
                         await recarregarCategorias();
                    }}
               />

               <CriarPatrimonioModal
                    isOpen={isAddPatrimonioOpen}
                    onClose={() => setIsAddPatrimonioOpen(false)}
                    selectedCategory={selectedCategoryForPatrimonio}
                    onSuccess={() => {
                         if (selectedCategoryForPatrimonio) {
                              carregarPatrimonios(selectedCategoryForPatrimonio.id, true);
                         }
                    }}
               />

               <EditarCategoriaModal
                    isOpen={isEditCategoriaOpen}
                    onClose={() => setIsEditCategoriaOpen(false)}
                    categoria={selectedCategoryForEdit}
                    departamentoId={departamentoLocal.id_departamentos}
                    onSuccess={handleCategoriaSuccess}
               />

               <EditarPatrimonioModal
                    isOpen={isEditPatrimonioOpen}
                    onClose={() => setIsEditPatrimonioOpen(false)}
                    patrimonio={selectedPatrimonioForEdit}
                    categoryId={selectedCategory?.id}
                    onSuccess={() => {
                         if (selectedCategory) {
                              carregarPatrimonios(selectedCategory.id, true);
                         }
                    }}
               />

               <ConfiguracoesDepartamentoModal
                    isOpen={isConfigDepartamentoOpen}
                    onClose={() => setIsConfigDepartamentoOpen(false)}
                    departamento={departamentoLocal}
                    membros={membros}
                    isAdmin={userRole === 'owner' || userRole === 'admin'}
                    isOwner={userRole === 'owner'}
                    onSuccess={handleDepartamentoSuccess}
                    onDelete={() => {
                         setItemToDelete({
                              tipo: 'departamento',
                              nome: departamentoLocal.titulo,
                              onConfirm: async () => {
                                   try {
                                        await removeDepartamento(departamentoLocal);
                                        toast.success('Departamento excluído com sucesso!');
                                        window.location.href = '/departamentos';
                                   } catch (error) {
                                        toast.error('Erro ao excluir departamento');
                                        console.error('Erro ao excluir departamento:', error);
                                   }
                              }
                         });
                         setIsConfirmDeleteOpen(true);
                         setIsConfigDepartamentoOpen(false);
                    }}
               />

               <ConfirmarExclusaoModal
                    isOpen={isConfirmDeleteOpen}
                    onClose={() => {
                         setIsConfirmDeleteOpen(false);
                         setItemToDelete(null);
                    }}
                    onConfirm={() => {
                         if (itemToDelete) {
                              itemToDelete.onConfirm();
                         }
                         setIsConfirmDeleteOpen(false);
                         setItemToDelete(null);
                    }}
                    titulo={`Excluir ${itemToDelete?.tipo || 'item'}`}
                    descricao={`Tem certeza que deseja excluir este ${itemToDelete?.tipo || 'item'}? Esta ação não pode ser desfeita.`}
                    itemNome={itemToDelete?.nome}
                    tipo={itemToDelete?.tipo as any}
               />

               <CompartilharModal
                    isOpen={isShareModalOpen}
                    onClose={() => setIsShareModalOpen(false)}
                    departamento={departamento}
                    onInvite={handleInvite}
               />
          </div>
     );
}