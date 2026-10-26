'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { serieDepreciacao } from '@/lib/depreciacao-calculo';
import { DepartamentoType } from '@/lib/types/types';
import { Category, PatrimonioDetalhadoType, CategoriasProps } from '@/lib/types/categoria.types';
import { motion, AnimatePresence } from 'framer-motion';
import { MdFilterList, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdModeEdit, MdSearch, MdAdd, MdSortByAlpha, MdClear } from 'react-icons/md';
import { RiDeleteBinLine } from 'react-icons/ri';
import { FaShare, FaSortAmountDown, FaSortAmountUp, FaBoxOpen, FaInbox, FaChartLine } from 'react-icons/fa';
import { SidebarCategorias } from '@/app/components/Navigation/SidebarCategorias';
import { BarraTopoMobile, GavetaLateral } from '@/app/components/Navigation/GavetaMobile';
import { getPatrimoniosByCategoria, removePatrimonio } from '@/app/services/patrimonios';
import { removeCategoria, getCategoriasComTotalPatrimonios } from '@/app/services/categoria';
import { removeDepartamento } from '@/app/services/departamento';
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

export default function CategoriaFront({
     departamento,
     user,
     host,
     membros = [],
     categorias = []
}: CategoriasProps) {
     const currentUserMembro = membros.find(m => m.id === user.id);
     const userRole = currentUserMembro?.role || 'member';
     const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
     const [isMenuMobileOpen, setIsMenuMobileOpen] = useState(false);
     const fecharMenuMobile = useCallback(() => setIsMenuMobileOpen(false), []);
     const [searchTerm, setSearchTerm] = useState("");
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
     const [itemToDelete, setItemToDelete] = useState<{ tipo: string, nome: string, onConfirm: () => Promise<void> | void } | null>(null);
     const [isShareModalOpen, setIsShareModalOpen] = useState(false);
     const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
     const [filtroSelecionado, setFiltroSelecionado] = useState<string | null>(null);
     const handleOpenPatrimonioModal = (category: Category) => {
          setSelectedCategoryForPatrimonio(category);
          setIsAddPatrimonioOpen(true);
     };

     const [isModalOpen, setIsModalOpen] = useState(false);
     const [selectedPatrimonio, setSelectedPatrimonio] = useState<PatrimonioDetalhadoType | null>(null);
     
     const carregarPatrimonios = async (categoriaId: number, forceReload = false) => {
          if (patrimoniosPorCategoria[categoriaId] && !forceReload) {
               return; 
          }

          setLoadingPatrimonios(prev => ({ ...prev, [categoriaId]: true }));

          try {
               const patrimonios = await getPatrimoniosByCategoria(categoriaId);
               const patrimoniosFormatados = patrimonios.map(p => ({
                    id: p.id,
                    name: p.nome,
                    codigo: p.codigo_patrimonio || '',
                    finalValue: p.valor_atual && p.valor_inicial ? Math.round((p.valor_atual / p.valor_inicial) * 100) : 0,
                    especificacoes: p.descricao || null,
                    data_aquisicao: p.data_aquisicao,
                    local: p.localizacao || null,
                    preco_inicial: p.valor_inicial,
                    valor_atual: p.valor_atual,
                    depreciacao_percentual: p.tempo_depreciacao,
                    depreciacao_valor: p.valor_inicial ? p.valor_inicial - (p.valor_atual || 0) : 0,
                    depreciacao_historico: serieDepreciacao(p.valor_inicial, p.tempo_depreciacao, p.data_aquisicao)
               }));

               setPatrimoniosPorCategoria(prev => ({
                    ...prev,
                    [categoriaId]: patrimoniosFormatados
               }));
          } catch (error) {
               toast.error('Erro ao carregar patrimônios da categoria');
          } finally {
               setLoadingPatrimonios(prev => ({ ...prev, [categoriaId]: false }));
          }
     };
     const [patrimoniosPorCategoria, setPatrimoniosPorCategoria] = useState<{ [key: number]: PatrimonioDetalhadoType[] }>({});
     const [loadingPatrimonios, setLoadingPatrimonios] = useState<{ [key: number]: boolean }>({});
     const [categories, setCategories] = useState<Category[]>([]);
     const [categoriasBase, setCategoriasBase] = useState(categorias);
     const filtroRef = useRef<HTMLDivElement>(null);
     const [departamentoLocal, setDepartamentoLocal] = useState(departamento);
     useEffect(() => {
          setHasInitiallyLoaded(true);
     }, []);

     useEffect(() => {
          const handleClickOutside = (event: MouseEvent) => {
               if (isFilterDropdownOpen && filtroRef.current && !filtroRef.current.contains(event.target as Node)) {
                    setIsFilterDropdownOpen(false);
               }
          };

          document.addEventListener('mousedown', handleClickOutside);
          return () => document.removeEventListener('mousedown', handleClickOutside);
     }, [isFilterDropdownOpen]);
     useEffect(() => {
          setDepartamentoLocal(departamento);
     }, [departamento]);
     
     useEffect(() => {
          setCategoriasBase(categorias);
     }, [categorias]);

     useEffect(() => {
          setCategories(categoriasBase.map(cat => ({
               id: cat.id,
               name: cat.nome,
               observation: cat.descricao || (cat.padrao_categoria ? `Padrão: ${cat.padrao_categoria} (${cat.taxa_anual_percent}% a.a.)` : 'Sem descrição'),
               total: Number(cat.total_patrimonios) || 0,
               percentualValor: cat.percentual_valor ?? null,
               notebooks: patrimoniosPorCategoria[cat.id] || [],
               padrao_depreciacao_id: cat.padrao_depreciacao_id || null
          })));
     }, [categoriasBase, patrimoniosPorCategoria]);

     const recarregarCategorias = async () => {
          try {
               setCategoriasBase(await getCategoriasComTotalPatrimonios(Number(departamentoLocal.id_departamentos)));
          } catch (error) {
               toast.error('Erro ao atualizar categorias');
          }
     };

     const recarregarPatrimoniosETotais = async (categoriaId: number) => {
          await Promise.all([carregarPatrimonios(categoriaId, true), recarregarCategorias()]);
     };
     const handleDepartamentoSuccess = async (departamentoAtualizado: DepartamentoType) => {
          setIsConfigDepartamentoOpen(false);
          setDepartamentoLocal(departamentoAtualizado); 
     };
     const handleCategoriaSuccess = async () => {
          setIsEditCategoriaOpen(false);
          await recarregarCategorias(); 
     };

     const handleInvite = async (emails: string[]) => {
          try {
               const result = await enviarConvitesPorEmail(
                    Number(departamentoLocal.id_departamentos),
                    emails
               );

               if (result.success) {
                    toast.success(result.message);
               } else {
                    toast.error(result.message);
               }
               return result.success;
          } catch (error) {
               toast.error('Erro ao enviar convites');
               return false;
          }
     };
     const getUpdatedSelectedCategory = () => {
          if (!selectedCategory) return null;
          return categories.find(cat => cat.id === selectedCategory.id) || selectedCategory;
     };

     const aplicarFiltros = (cats: Category[]) => {
          let resultado = [...cats];

          if (!filtroSelecionado) return resultado;

          switch (filtroSelecionado) {
               case 'a-z':
                    resultado.sort((a, b) => a.name.localeCompare(b.name));
                    break;
               case 'z-a':
                    resultado.sort((a, b) => b.name.localeCompare(a.name));
                    break;
               case 'mais-itens':
                    resultado.sort((a, b) => b.total - a.total);
                    break;
               case 'menos-itens':
                    resultado.sort((a, b) => a.total - b.total);
                    break;
               case 'com-itens':
                    resultado = resultado.filter(cat => cat.total > 0);
                    break;
               case 'vazias':
                    resultado = resultado.filter(cat => cat.total === 0);
                    break;
               case 'desvalorizados':
                    resultado = resultado
                         .filter(cat => cat.percentualValor != null && cat.percentualValor < 100)
                         .sort((a, b) => (a.percentualValor ?? 100) - (b.percentualValor ?? 100));
                    break;
          }

          return resultado;
     };

     const filteredCategories = aplicarFiltros(
          categories.filter(cat =>
               cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               cat.observation.toLowerCase().includes(searchTerm.toLowerCase())
          )
     );
     const handleOpenModal = (patrimonio: PatrimonioDetalhadoType) => {
          setSelectedPatrimonio(patrimonio);
          setIsModalOpen(true);
     };
     
     const containerVariants = hasInitiallyLoaded ? {
          hidden: { opacity: 1 },
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
          hidden: { y: 0, opacity: 1 },
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
          <div className="min-h-screen bg-page text-white">
               {/* Container principal */}
               <motion.div
                    className="flex h-screen"
                    initial={hasInitiallyLoaded ? "visible" : "hidden"}
                    animate="visible"
                    variants={containerVariants}
               >
                    {/* Sidebar esquerda - Informações do departamento */}
                    <GavetaLateral aberta={isMenuMobileOpen} onFechar={fecharMenuMobile}>
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
                    </GavetaLateral>

                    {/* Conteúdo principal - Lista de categorias */}
                    <motion.main className="flex min-w-0 flex-1 flex-col overflow-hidden" variants={itemVariants}>
                         <BarraTopoMobile onAbrirMenu={() => setIsMenuMobileOpen(true)} titulo={departamentoLocal.titulo} />
                         <motion.div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4 sm:p-6" variants={itemVariants}>
                              <h1 className="text-xl font-bold">Categorias</h1>
                              <div className="flex w-full items-center gap-3 sm:w-auto sm:gap-4">
                                   <div className="relative flex-1 sm:flex-none">
                                        <input
                                             autoComplete='off'
                                             type="text"
                                             placeholder="Buscar categoria..."
                                             aria-label="Buscar categoria"
                                             className="bg-surface-2 text-white pl-10 pr-4 py-2 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                             value={searchTerm}
                                             onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-subtle" size={20} />
                                   </div>
                                   <div className="relative" ref={filtroRef}>
                                        <button
                                             type="button"
                                             aria-label="Filtrar e ordenar categorias"
                                             aria-expanded={isFilterDropdownOpen}
                                             className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${filtroSelecionado ? 'bg-primary text-black' : 'bg-surface-2 text-subtle hover:text-white'}`}
                                             onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                                        >
                                             <MdFilterList size={20} />
                                        </button>

                                        <AnimatePresence>
                                             {isFilterDropdownOpen && (
                                                  <motion.div
                                                       className="absolute right-0 mt-2 w-64 bg-[#1a1a1a] border border-line rounded-xl shadow-xl z-50 overflow-hidden"
                                                       initial={{ opacity: 0, y: -10 }}
                                                       animate={{ opacity: 1, y: 0 }}
                                                       exit={{ opacity: 0, y: -10 }}
                                                       transition={{ duration: 0.2 }}
                                                  >
                                                       <div className="p-2">
                                                            <div className="px-3 py-2 text-xs font-semibold text-subtle uppercase">Ordenar</div>

                                                            <button
                                                                 className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white hover:bg-surface-2 rounded-lg transition-colors duration-200"
                                                                 onClick={() => {
                                                                      setFiltroSelecionado('a-z');
                                                                      setIsFilterDropdownOpen(false);
                                                                 }}
                                                            >
                                                                 <MdSortByAlpha size={18} className="text-primary" />
                                                                 <span>A-Z</span>
                                                            </button>

                                                            <button
                                                                 className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white hover:bg-surface-2 rounded-lg transition-colors duration-200"
                                                                 onClick={() => {
                                                                      setFiltroSelecionado('z-a');
                                                                      setIsFilterDropdownOpen(false);
                                                                 }}
                                                            >
                                                                 <MdSortByAlpha size={18} className="text-primary transform rotate-180" />
                                                                 <span>Z-A</span>
                                                            </button>

                                                            <button
                                                                 className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white hover:bg-surface-2 rounded-lg transition-colors duration-200"
                                                                 onClick={() => {
                                                                      setFiltroSelecionado('mais-itens');
                                                                      setIsFilterDropdownOpen(false);
                                                                 }}
                                                            >
                                                                 <FaSortAmountDown size={16} className="text-primary" />
                                                                 <span>Mais itens</span>
                                                            </button>

                                                            <button
                                                                 className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white hover:bg-surface-2 rounded-lg transition-colors duration-200"
                                                                 onClick={() => {
                                                                      setFiltroSelecionado('menos-itens');
                                                                      setIsFilterDropdownOpen(false);
                                                                 }}
                                                            >
                                                                 <FaSortAmountUp size={16} className="text-primary" />
                                                                 <span>Menos itens</span>
                                                            </button>

                                                            <div className="my-2 border-t border-line"></div>

                                                            <div className="px-3 py-2 text-xs font-semibold text-subtle uppercase">Filtrar</div>

                                                            <button
                                                                 className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white hover:bg-surface-2 rounded-lg transition-colors duration-200"
                                                                 onClick={() => {
                                                                      setFiltroSelecionado('com-itens');
                                                                      setIsFilterDropdownOpen(false);
                                                                 }}
                                                            >
                                                                 <FaBoxOpen size={16} className="text-primary" />
                                                                 <span>Com itens</span>
                                                            </button>

                                                            <button
                                                                 className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white hover:bg-surface-2 rounded-lg transition-colors duration-200"
                                                                 onClick={() => {
                                                                      setFiltroSelecionado('vazias');
                                                                      setIsFilterDropdownOpen(false);
                                                                 }}
                                                            >
                                                                 <FaInbox size={16} className="text-primary" />
                                                                 <span>Vazias</span>
                                                            </button>

                                                            <button
                                                                 className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white hover:bg-surface-2 rounded-lg transition-colors duration-200"
                                                                 onClick={() => {
                                                                      setFiltroSelecionado('desvalorizados');
                                                                      setIsFilterDropdownOpen(false);
                                                                 }}
                                                            >
                                                                 <FaChartLine size={16} className="text-red-500" />
                                                                 <span>Mais desvalorizados</span>
                                                            </button>

                                                            {filtroSelecionado && (
                                                                 <>
                                                                      <div className="my-2 border-t border-line"></div>
                                                                      <button
                                                                           className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-surface-2 rounded-lg transition-colors duration-200"
                                                                           onClick={() => {
                                                                                setFiltroSelecionado(null);
                                                                                setIsFilterDropdownOpen(false);
                                                                           }}
                                                                      >
                                                                           <MdClear size={18} />
                                                                           <span>Limpar filtros</span>
                                                                      </button>
                                                                 </>
                                                            )}
                                                       </div>
                                                  </motion.div>
                                             )}
                                        </AnimatePresence>
                                   </div>
                              </div>
                         </motion.div>

                         <div className="flex flex-1 overflow-hidden">
                              {/* Painel esquerdo - Lista de categorias */}
                              <div className={`${selectedCategory ? 'hidden lg:block' : 'block'} w-full overflow-y-auto p-4 sm:p-6 lg:w-3/5 2xl:w-2/3`}>
                                   {filteredCategories.length > 0 ? (
                                        <motion.div 
                                             className="space-y-4" 
                                             variants={containerVariants}
                                             initial={hasInitiallyLoaded ? "visible" : "hidden"}
                                             animate="visible"
                                        >
                                             {filteredCategories.map((category, index) => (
                                                  <motion.button
                                                       type="button"
                                                       key={category.id}
                                                       aria-pressed={selectedCategory?.id === category.id}
                                                       className={`block w-full p-4 text-left rounded-xl cursor-pointer transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${selectedCategory?.id === category.id
                                                            ? 'bg-surface-2 border-l-4 border-primary'
                                                            : 'bg-[#1a1a1a] hover:bg-surface-2'
                                                            }`}
                                                       onClick={() => {
                                                            setSelectedCategory(category);
                                                            carregarPatrimonios(category.id);
                                                       }}
                                                       variants={itemVariants}
                                                       initial={hasInitiallyLoaded ? "visible" : "hidden"}
                                                       animate="visible"
                                                       whileHover={hasInitiallyLoaded ? {} : { x: 5 }}
                                                       custom={index}
                                                  >
                                                       <div className="flex items-center justify-between gap-3">
                                                            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                                                                 <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-primary sm:h-12 sm:w-12">
                                                                      {category.name.charAt(0)}
                                                                 </div>
                                                                 <div className="min-w-0">
                                                                      <h3 className="truncate font-medium text-white">{category.name}</h3>
                                                                      <p className="line-clamp-2 text-sm text-muted sm:line-clamp-1">{category.observation}</p>
                                                                 </div>
                                                            </div>
                                                            <div className="flex shrink-0 items-center gap-2 sm:gap-6">
                                                                 <div className="text-right">
                                                                      <span className="hidden text-sm text-muted sm:inline">Total de itens</span>
                                                                      <p className="text-lg font-semibold text-white">{category.total}</p>
                                                                 </div>
                                                                 <MdKeyboardArrowRight size={24} className="text-primary" aria-hidden />
                                                            </div>
                                                       </div>
                                                  </motion.button>
                                             ))}
                                        </motion.div>
                                   ) : (
                                        <motion.div className="flex flex-col items-center justify-center h-full text-center" variants={itemVariants}>
                                             <div className="bg-surface-2 p-6 rounded-xl mb-4">
                                                  <MdSearch className="text-primary" size={48} />
                                             </div>
                                             <h3 className="text-xl font-medium mb-2">Nenhuma categoria encontrada</h3>
                                             <p className="text-subtle max-w-md">
                                                  Não encontramos categorias com este termo. Tente outra busca ou crie uma nova categoria.
                                             </p>
                                             <button
                                                  className="mt-4 flex items-center gap-2 bg-primary text-black px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors duration-300"
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
                              <div className={`${selectedCategory ? 'block' : 'hidden lg:block'} w-full overflow-y-auto lg:w-2/5 lg:border-l lg:border-line 2xl:w-1/3`}>
                                   <AnimatePresence>
                                        {(() => {
                                             const currentCategory = getUpdatedSelectedCategory();
                                             return currentCategory ? (
                                                  <motion.div
                                                       className="p-4 sm:p-6"
                                                       initial={{ opacity: 0, x: 20 }}
                                                       animate={{ opacity: 1, x: 0 }}
                                                       exit={{ opacity: 0, x: 20 }}
                                                       transition={{ duration: 0.3 }}
                                                  >
                                                       <button
                                                            type="button"
                                                            className="-ml-2 mb-2 flex h-10 items-center gap-1 rounded-lg px-2 text-sm text-muted transition-colors hover:bg-white/5 hover:text-white"
                                                            onClick={() => setSelectedCategory(null)}
                                                       >
                                                            <MdKeyboardArrowLeft size={20} aria-hidden /> Voltar para lista
                                                       </button>

                                                       <div className="mb-6 flex items-start justify-between gap-3">
                                                            <h2 className="min-w-0 break-words text-xl font-bold">{currentCategory.name}</h2>
                                                            <div className="flex shrink-0 items-center gap-2">
                                                                 <button
                                                                      type="button"
                                                                      aria-label="Editar categoria"
                                                                      title="Editar categoria"
                                                                      className="flex h-10 w-10 items-center justify-center bg-surface-2 text-primary hover:bg-surface-3 hover:text-white rounded-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                                                      onClick={() => {
                                                                           setSelectedCategoryForEdit(currentCategory);
                                                                           setIsEditCategoriaOpen(true);
                                                                      }}
                                                                 >
                                                                      <MdModeEdit size={18} />
                                                                 </button>
                                                                 <button
                                                                      type="button"
                                                                      aria-label="Excluir categoria"
                                                                      title="Excluir categoria"
                                                                      className="flex h-10 w-10 items-center justify-center bg-surface-2 text-red-400 hover:bg-red-500/15 hover:text-red-300 rounded-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                                                      onClick={() => {
                                                                           setItemToDelete({
                                                                                tipo: 'categoria',
                                                                                nome: currentCategory.name,
                                                                                onConfirm: async () => {
                                                                                     try {
                                                                                          await removeCategoria(currentCategory.id);
                                                                                          toast.success('Categoria excluída com sucesso!');
                                                                                          setSelectedCategory(null);
                                                                                          
                                                                                          await recarregarCategorias();
                                                                                     } catch (error) {
                                                                                          toast.error('Erro ao excluir categoria');
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
                                                            <p className="text-muted text-sm mb-2">Observação</p>
                                                            <p className="text-white">{currentCategory.observation}</p>
                                                       </div>

                                                       <div className="flex justify-between items-center mb-4">
                                                            <h3 className="font-medium">Patrimônios cadastrados</h3>
                                                            <button
                                                                 type="button"
                                                                 className="flex h-9 items-center gap-1 rounded-lg px-2 -mr-2 text-sm text-primary hover:bg-primary/10 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                                                 onClick={() => handleOpenPatrimonioModal(currentCategory)}
                                                            >
                                                                 <MdAdd size={16} /> Novo patrimônio
                                                            </button>
                                                       </div>

                                                       <div className="space-y-3">
                                                            {loadingPatrimonios[currentCategory.id] ? (
                                                                 <div className="flex items-center justify-center py-8">
                                                                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                                                      <span className="ml-3 text-subtle">Carregando patrimônios...</span>
                                                                 </div>
                                                            ) : (currentCategory.notebooks?.length || 0) > 0 ? (
                                                                 currentCategory.notebooks?.map((item, index) => (
                                                                      <motion.button
                                                                           type="button"
                                                                           key={item.id ?? index}
                                                                           className="w-full gap-3 bg-surface-2 p-3 text-left rounded-lg flex items-center justify-between cursor-pointer hover:bg-[#353535] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                                                           initial={hasInitiallyLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                                                                           animate={{ opacity: 1, y: 0 }}
                                                                           transition={hasInitiallyLoaded ? {} : { delay: index * 0.05, duration: 0.2 }}
                                                                           whileHover={hasInitiallyLoaded ? {} : { scale: 1.02 }}
                                                                           onClick={() => handleOpenModal(item)}
                                                                      >
                                                                           <div className="flex min-w-0 items-center gap-3">
                                                                                <div className={`w-10 h-10 shrink-0 rounded-lg ${item.finalValue >= 70 ? 'bg-green-500' : item.finalValue >= 50 ? 'bg-yellow-500' : 'bg-red-500'} flex items-center justify-center text-white font-bold`}>
                                                                                     {item.name.charAt(0)}
                                                                                </div>
                                                                                <span className="truncate font-medium">{item.name}</span>
                                                                           </div>
                                                                           <div className="flex shrink-0 items-center gap-2 sm:gap-4">
                                                                                <div className="flex flex-col items-end">
                                                                                     <span className={`text-sm ${item.finalValue >= 70 ? 'text-green-500' : item.finalValue >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                                                                                          {item.finalValue}% valor
                                                                                     </span>
                                                                                     <span className="text-xs text-subtle">
                                                                                          Depreciação: {100 - item.finalValue}%
                                                                                     </span>
                                                                                </div>
                                                                                <MdKeyboardArrowRight size={20} className="text-muted" aria-hidden />
                                                                           </div>
                                                                      </motion.button>
                                                                 ))
                                                            ) : (
                                                                 <div className="text-center py-8 text-subtle">
                                                                      <p>Nenhum patrimônio cadastrado nesta categoria.</p>
                                                                      <button
                                                                           className="mt-2 text-primary hover:text-white transition-colors"
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
                                                       <div className="bg-surface-2 p-6 rounded-full mb-4">
                                                            <FaShare className="text-subtle" size={32} />
                                                       </div>
                                                       <h3 className="text-xl font-medium mb-2">Selecione uma categoria</h3>
                                                       <p className="text-subtle max-w-md">
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
                                             await removePatrimonio(patrimonio.id);
                                             toast.success('Patrimônio excluído com sucesso!');
                                             setIsModalOpen(false);
                                             await recarregarPatrimoniosETotais(selectedCategory.id);
                                        }
                                   } catch (error) {
                                        toast.error('Erro ao excluir patrimônio');
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
                              recarregarPatrimoniosETotais(selectedCategoryForPatrimonio.id);
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
                              recarregarPatrimoniosETotais(selectedCategory.id);
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
                    onConfirm={async () => {
                         if (itemToDelete) {
                              await itemToDelete.onConfirm();
                         }
                         setIsConfirmDeleteOpen(false);
                         setItemToDelete(null);
                    }}
                    titulo={`Excluir ${itemToDelete?.tipo === 'patrimonio' ? 'patrimônio' : itemToDelete?.tipo || 'item'}`}
                    descricao={
                         itemToDelete?.tipo === 'categoria' ? 'Os patrimônios desta categoria também serão excluídos.'
                              : itemToDelete?.tipo === 'departamento' ? 'Todas as categorias e patrimônios do departamento também serão excluídos.'
                                   : 'Tem certeza que deseja excluir este item?'
                    }
                    itemNome={itemToDelete?.nome}
                    tipo={itemToDelete?.tipo as any}
               />

               <CompartilharModal
                    isOpen={isShareModalOpen}
                    onClose={() => setIsShareModalOpen(false)}
                    departamento={departamentoLocal}
                    onInvite={handleInvite}
               />
          </div>
     );
}