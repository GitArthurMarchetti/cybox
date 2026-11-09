'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiBox, FiChevronRight, FiEdit2, FiLayers, FiPercent, FiPlus, FiTrash2, FiTrendingDown, FiDollarSign } from 'react-icons/fi';
import { serieDepreciacao } from '@/lib/depreciacao-calculo';
import { DepartamentoType } from '@/lib/types/types';
import { Category, PatrimonioDetalhadoType, CategoriasProps } from '@/lib/types/categoria.types';
import { SidebarCategorias } from '@/app/components/Navigation/SidebarCategorias';
import { BarraTopoMobile, GavetaLateral } from '@/app/components/Navigation/GavetaMobile';
import SearchBar from '@/app/components/SearchBar';
import { getPatrimoniosByCategoria, removePatrimonio } from '@/app/services/patrimonios';
import { removeCategoria, getCategoriasComTotalPatrimonios } from '@/app/services/categoria';
import { removeDepartamento } from '@/app/services/departamento';
import { enviarConvitesPorEmail } from '@/app/services/convites';
import { Backdrop } from '@/app/components/home/landing/Backdrop';
import { useDemo } from '@/app/components/demo/DemoContext';
import { money, compactMoney, monthYear, valueTone } from '@/lib/format';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';
import CriarCategoriaModal from '@/app/components/modals/CriarCategoriaModal';
import CriarPatrimonioModal from '@/app/components/modals/CriarPatrimonioModal';
import EditarCategoriaModal from '@/app/components/modals/EditarCategoriaModal';
import EditarPatrimonioModal from '@/app/components/modals/EditarPatrimonioModal';
import ConfiguracoesDepartamentoModal from '@/app/components/modals/ConfiguracoesDepartamentoModal';
import ConfirmarExclusaoModal from '@/app/components/modals/ConfirmarExclusaoModal';
import { CompartilharModal } from '@/app/components/modals/CompartilharModal';

// The asset detail modal carries the chart library, so it loads after the page instead of with it.
const DetalhesPatrimonioModal = dynamic(
     () => import('@/app/components/modals/DetalhesPatrimonioModal').then(m => m.DetalhesPatrimonioModal),
     { ssr: false }
);

type SortId = 'a-z' | 'z-a' | 'mais-itens' | 'menos-itens' | 'com-itens' | 'vazias' | 'desvalorizados';

const CATEGORY_FILTERS: { id: SortId; label: string }[] = [
     { id: 'a-z', label: 'A–Z' },
     { id: 'mais-itens', label: 'Most items' },
     { id: 'desvalorizados', label: 'Most depreciated' },
     { id: 'com-itens', label: 'With items' },
     { id: 'vazias', label: 'Empty' },
];

function ValueBar({ pct, className = '' }: { pct: number; className?: string }) {
     const tone = valueTone(pct);
     return (
          <div className={`h-1.5 overflow-hidden rounded-full bg-white/10 ${className}`}>
               <motion.div
                    className={`h-full rounded-full ${tone.bg}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
               />
          </div>
     );
}

function Stat({ icon: Icon, label, value, hint }: { icon: React.ComponentType<{ size?: number }>; label: string; value: React.ReactNode; hint?: React.ReactNode }) {
     return (
          <div className="rounded-2xl border border-white/[0.07] bg-surface/80 p-4">
               <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                    <span className="text-primary"><Icon size={12} /></span>
                    {label}
               </div>
               <p className="mt-2 font-display text-xl font-semibold tracking-tight text-white sm:text-2xl">{value}</p>
               {hint && <div className="mt-1 text-xs text-white/45">{hint}</div>}
          </div>
     );
}

export default function CategoriaFront({
     departamento,
     user,
     host,
     membros = [],
     categorias = []
}: CategoriasProps) {
     const { blockIfDemo } = useDemo();
     const currentUserMembro = membros.find(m => m.id === user.id);
     const userRole = currentUserMembro?.role || 'member';
     const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
     const [isMenuMobileOpen, setIsMenuMobileOpen] = useState(false);
     const fecharMenuMobile = useCallback(() => setIsMenuMobileOpen(false), []);
     const [searchTerm, setSearchTerm] = useState("");
     const [isSearchFocused, setIsSearchFocused] = useState(false);
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
     const [filtroSelecionado, setFiltroSelecionado] = useState<SortId | null>(null);
     const [isModalOpen, setIsModalOpen] = useState(false);
     const [selectedPatrimonio, setSelectedPatrimonio] = useState<PatrimonioDetalhadoType | null>(null);
     const [patrimoniosPorCategoria, setPatrimoniosPorCategoria] = useState<{ [key: number]: PatrimonioDetalhadoType[] }>({});
     const [loadingPatrimonios, setLoadingPatrimonios] = useState<{ [key: number]: boolean }>({});
     const [categoriasBase, setCategoriasBase] = useState(categorias);
     const [departamentoLocal, setDepartamentoLocal] = useState(departamento);

     const handleOpenPatrimonioModal = (category: Category) => {
          setSelectedCategoryForPatrimonio(category);
          setIsAddPatrimonioOpen(true);
     };

     const carregarPatrimonios = async (categoriaId: number, forceReload = false) => {
          if (patrimoniosPorCategoria[categoriaId] && !forceReload) return;

          setLoadingPatrimonios(prev => ({ ...prev, [categoriaId]: true }));

          try {
               const patrimonios = await getPatrimoniosByCategoria(categoriaId);
               const formatted = patrimonios.map(p => ({
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

               setPatrimoniosPorCategoria(prev => ({ ...prev, [categoriaId]: formatted }));
          } catch {
               toast.error("Couldn't load this category's assets");
          } finally {
               setLoadingPatrimonios(prev => ({ ...prev, [categoriaId]: false }));
          }
     };

     useEffect(() => { setDepartamentoLocal(departamento); }, [departamento]);
     useEffect(() => { setCategoriasBase(categorias); }, [categorias]);

     const categories: Category[] = useMemo(() => categoriasBase.map(cat => ({
          id: cat.id,
          name: cat.nome,
          observation: cat.descricao || (cat.padrao_categoria ? `Preset: ${cat.padrao_categoria} (${cat.taxa_anual_percent}% / year)` : ''),
          total: Number(cat.total_patrimonios) || 0,
          percentualValor: cat.percentual_valor != null ? Number(cat.percentual_valor) : null,
          valorTotal: Number(cat.valor_total) || 0,
          taxa: cat.taxa_anual_percent != null ? Number(cat.taxa_anual_percent) : null,
          notebooks: patrimoniosPorCategoria[cat.id] || [],
          padrao_depreciacao_id: cat.padrao_depreciacao_id || null
     })), [categoriasBase, patrimoniosPorCategoria]);

     // Room-level summary built from the per-category totals.
     const summary = useMemo(() => {
          const value = categories.reduce((s, c) => s + (c.valorTotal || 0), 0);
          const assets = categories.reduce((s, c) => s + c.total, 0);
          const initial = categories.reduce((s, c) => s + (c.percentualValor ? (c.valorTotal || 0) / (c.percentualValor / 100) : 0), 0);
          return { value, assets, count: categories.length, pctLeft: initial > 0 ? Math.round((value / initial) * 100) : null };
     }, [categories]);

     const recarregarCategorias = async () => {
          try {
               setCategoriasBase(await getCategoriasComTotalPatrimonios(Number(departamentoLocal.id_departamentos)));
          } catch {
               toast.error("Couldn't refresh the categories");
          }
     };

     const recarregarPatrimoniosETotais = async (categoriaId: number) => {
          await Promise.all([carregarPatrimonios(categoriaId, true), recarregarCategorias()]);
     };

     const handleDepartamentoSuccess = async (updated: DepartamentoType) => {
          setIsConfigDepartamentoOpen(false);
          setDepartamentoLocal(updated);
     };

     const handleCategoriaSuccess = async () => {
          setIsEditCategoriaOpen(false);
          await recarregarCategorias();
     };

     const handleInvite = async (emails: string[]) => {
          try {
               const result = await enviarConvitesPorEmail(Number(departamentoLocal.id_departamentos), emails);
               if (result.success) toast.success(result.message);
               else toast.error(result.message);
               return result.success;
          } catch {
               toast.error("Couldn't send the invites");
               return false;
          }
     };

     const currentCategory = selectedCategory ? categories.find(c => c.id === selectedCategory.id) || selectedCategory : null;

     const filteredCategories = useMemo(() => {
          const term = searchTerm.toLowerCase();
          let list = categories.filter(c => c.name.toLowerCase().includes(term) || c.observation.toLowerCase().includes(term));
          switch (filtroSelecionado) {
               case 'a-z': list = [...list].sort((a, b) => a.name.localeCompare(b.name)); break;
               case 'z-a': list = [...list].sort((a, b) => b.name.localeCompare(a.name)); break;
               case 'mais-itens': list = [...list].sort((a, b) => b.total - a.total); break;
               case 'menos-itens': list = [...list].sort((a, b) => a.total - b.total); break;
               case 'com-itens': list = list.filter(c => c.total > 0); break;
               case 'vazias': list = list.filter(c => c.total === 0); break;
               case 'desvalorizados':
                    list = list.filter(c => c.percentualValor != null && c.percentualValor < 100)
                         .sort((a, b) => (a.percentualValor ?? 100) - (b.percentualValor ?? 100));
                    break;
          }
          return list;
     }, [categories, searchTerm, filtroSelecionado]);

     const selectCategory = (category: Category) => {
          setSelectedCategory(category);
          carregarPatrimonios(category.id);
     };

     const confirmDeleteCategory = (category: Category) => {
          setItemToDelete({
               tipo: 'categoria',
               nome: category.name,
               onConfirm: async () => {
                    if (blockIfDemo()) return;
                    try {
                         await removeCategoria(category.id);
                         toast.success('Category deleted');
                         setSelectedCategory(null);
                         await recarregarCategorias();
                    } catch {
                         toast.error("Couldn't delete the category");
                    }
               }
          });
          setIsConfirmDeleteOpen(true);
     };

     const assets = currentCategory?.notebooks ?? [];

     return (
          <div className="relative min-h-screen text-white">
               <Backdrop />
               <div className="flex h-screen">
                    <GavetaLateral aberta={isMenuMobileOpen} onFechar={fecharMenuMobile}>
                         <SidebarCategorias
                              departamento={departamentoLocal}
                              user={user}
                              host={host}
                              membros={membros}
                              onAddCategoryClick={() => setIsAddNewOpen(true)}
                              onConfigClick={() => setIsConfigDepartamentoOpen(true)}
                              onShareClick={() => setIsShareModalOpen(true)}
                              hasInitiallyLoaded
                         />
                    </GavetaLateral>

                    <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
                         <BarraTopoMobile onAbrirMenu={() => setIsMenuMobileOpen(true)} titulo={departamentoLocal.titulo} />

                         <div className="flex-1 overflow-y-auto">
                              {/* room header + summary */}
                              <motion.header
                                   initial={{ opacity: 0, y: 12 }}
                                   animate={{ opacity: 1, y: 0 }}
                                   transition={{ duration: 0.4 }}
                                   className="px-4 pt-6 sm:px-8 sm:pt-8"
                              >
                                   <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
                                        <Link href="/departamentos" className="transition-colors hover:text-primary">Rooms</Link>
                                        <FiChevronRight size={12} aria-hidden />
                                        <span className="truncate text-primary/80">{departamentoLocal.titulo}</span>
                                   </nav>
                                   <div className="flex flex-wrap items-end justify-between gap-4">
                                        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{departamentoLocal.titulo}</h1>
                                        <button
                                             type="button"
                                             onClick={() => setIsAddNewOpen(true)}
                                             className="inline-flex h-11 items-center gap-1.5 rounded-full bg-primary px-5 text-sm font-semibold text-black shadow-[0_0_30px_-10px_rgba(246,207,69,0.7)] transition-colors hover:bg-primary-hover"
                                        >
                                             <FiPlus aria-hidden /> New category
                                        </button>
                                   </div>

                                   <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                                        <Stat icon={FiDollarSign} label="Value today" value={compactMoney(summary.value)} hint={money(summary.value)} />
                                        <Stat icon={FiBox} label="Assets" value={summary.assets} hint="tracked in this room" />
                                        <Stat icon={FiLayers} label="Categories" value={summary.count} hint="each with its own rate" />
                                        <Stat
                                             icon={FiPercent}
                                             label="Value left"
                                             value={summary.pctLeft != null ? <span className={valueTone(summary.pctLeft).text}>{summary.pctLeft}%</span> : '—'}
                                             hint={summary.pctLeft != null ? <ValueBar pct={summary.pctLeft} className="mt-2" /> : 'add assets to see it'}
                                        />
                                   </div>
                              </motion.header>

                              {/* categories + detail */}
                              <div className="grid grid-cols-1 gap-6 px-4 pb-10 pt-8 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
                                   <section aria-label="Categories" className={currentCategory ? 'hidden lg:block' : 'block'}>
                                        <div className="mb-4 flex items-center justify-between">
                                             <h2 className="font-display text-base font-semibold tracking-tight">Categories</h2>
                                             <span className="font-mono text-[11px] text-white/35">{filteredCategories.length} of {categories.length}</span>
                                        </div>
                                        <SearchBar
                                             value={searchTerm}
                                             onChange={setSearchTerm}
                                             isSearchFocused={isSearchFocused}
                                             onFocus={() => setIsSearchFocused(true)}
                                             onBlur={() => setIsSearchFocused(false)}
                                             itemVariants={{ hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0, transition: {} } }}
                                             placeholder="Search categories"
                                        />
                                        <div className="no-scrollbar -mt-2 mb-4 flex gap-2 overflow-x-auto pb-1">
                                             {CATEGORY_FILTERS.map(f => (
                                                  <button
                                                       key={f.id}
                                                       type="button"
                                                       aria-pressed={filtroSelecionado === f.id}
                                                       onClick={() => setFiltroSelecionado(cur => cur === f.id ? null : f.id)}
                                                       className={`shrink-0 rounded-full px-3 py-1.5 text-xs transition-colors ${filtroSelecionado === f.id ? 'bg-primary text-black' : 'border border-white/10 text-white/60 hover:border-white/25 hover:text-white'}`}
                                                  >
                                                       {f.label}
                                                  </button>
                                             ))}
                                        </div>

                                        {filteredCategories.length > 0 ? (
                                             <ul className="space-y-2.5">
                                                  {filteredCategories.map((category, index) => {
                                                       const active = currentCategory?.id === category.id;
                                                       const pct = category.percentualValor;
                                                       return (
                                                            <motion.li
                                                                 key={category.id}
                                                                 initial={{ opacity: 0, y: 10 }}
                                                                 animate={{ opacity: 1, y: 0 }}
                                                                 transition={{ delay: Math.min(index, 8) * 0.04 }}
                                                            >
                                                                 <button
                                                                      type="button"
                                                                      aria-pressed={active}
                                                                      onClick={() => selectCategory(category)}
                                                                      className={`group relative w-full rounded-2xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${active ? 'border-primary/50 bg-primary/[0.06]' : 'border-white/[0.07] bg-surface/80 hover:border-white/20'}`}
                                                                 >
                                                                      {active && <motion.span layoutId="category-active" className="absolute inset-y-4 left-0 w-[3px] rounded-full bg-primary" />}
                                                                      <div className="flex items-center gap-3">
                                                                           <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-display text-sm font-semibold ${active ? 'bg-primary text-black' : 'bg-white/[0.06] text-primary'}`}>
                                                                                {category.name.charAt(0).toUpperCase()}
                                                                           </span>
                                                                           <div className="min-w-0 flex-1">
                                                                                <p className="truncate font-medium text-white">{category.name}</p>
                                                                                <p className="mt-0.5 truncate text-xs text-white/45">
                                                                                     {category.total} {category.total === 1 ? 'asset' : 'assets'}
                                                                                     {category.taxa != null && <> · {category.taxa}% / year</>}
                                                                                </p>
                                                                           </div>
                                                                           <div className="text-right">
                                                                                <p className="text-sm font-semibold text-white">{category.total ? compactMoney(category.valorTotal) : '—'}</p>
                                                                                {pct != null && <p className={`font-mono text-[11px] ${valueTone(pct).text}`}>{pct}% left</p>}
                                                                           </div>
                                                                           <FiChevronRight className="shrink-0 text-white/30 transition-colors group-hover:text-primary" aria-hidden />
                                                                      </div>
                                                                      {pct != null && <ValueBar pct={pct} className="ml-[3.25rem] mt-3" />}
                                                                 </button>
                                                            </motion.li>
                                                       );
                                                  })}
                                             </ul>
                                        ) : (
                                             <div className="flex flex-col items-center rounded-3xl border border-dashed border-white/10 px-6 py-12 text-center">
                                                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                                                       <FiLayers size={20} />
                                                  </div>
                                                  <p className="font-display font-semibold">{categories.length ? 'No categories match' : 'No categories yet'}</p>
                                                  <p className="mt-2 max-w-xs text-sm text-white/50">
                                                       {categories.length ? 'Try another search or clear the filter.' : 'Categories group your assets and set how fast they depreciate.'}
                                                  </p>
                                                  <button
                                                       type="button"
                                                       className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-black hover:bg-primary-hover"
                                                       onClick={() => { setSearchTerm(''); setFiltroSelecionado(null); setIsAddNewOpen(true); }}
                                                  >
                                                       <FiPlus aria-hidden /> Create a category
                                                  </button>
                                             </div>
                                        )}
                                   </section>

                                   <section aria-label="Category details" className={currentCategory ? 'block' : 'hidden lg:block'}>
                                        <AnimatePresence mode="wait">
                                             {currentCategory ? (
                                                  <motion.div
                                                       key={currentCategory.id}
                                                       className="rounded-3xl border border-white/[0.07] bg-surface/80 p-4 sm:p-6"
                                                       initial={{ opacity: 0, x: 16 }}
                                                       animate={{ opacity: 1, x: 0 }}
                                                       exit={{ opacity: 0, x: 16 }}
                                                       transition={{ duration: 0.25 }}
                                                  >
                                                       <button
                                                            type="button"
                                                            className="-ml-2 mb-3 flex h-9 items-center gap-1.5 rounded-full px-3 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white lg:hidden"
                                                            onClick={() => setSelectedCategory(null)}
                                                       >
                                                            <FiArrowLeft aria-hidden /> All categories
                                                       </button>

                                                       <div className="flex items-start justify-between gap-3">
                                                            <div className="min-w-0">
                                                                 <h2 className="break-words font-display text-xl font-semibold tracking-tight">{currentCategory.name}</h2>
                                                                 <p className="mt-1 text-sm text-white/50">
                                                                      {currentCategory.total} {currentCategory.total === 1 ? 'asset' : 'assets'} · <span className="text-primary">{money(currentCategory.valorTotal)}</span> today
                                                                      {currentCategory.taxa != null && <> · {currentCategory.taxa}% / year</>}
                                                                 </p>
                                                            </div>
                                                            <div className="flex shrink-0 items-center gap-1.5">
                                                                 <button
                                                                      type="button"
                                                                      aria-label="Edit category"
                                                                      title="Edit category"
                                                                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-white/70 transition-colors hover:border-primary/50 hover:text-primary"
                                                                      onClick={() => { setSelectedCategoryForEdit(currentCategory); setIsEditCategoriaOpen(true); }}
                                                                 >
                                                                      <FiEdit2 size={15} />
                                                                 </button>
                                                                 <button
                                                                      type="button"
                                                                      aria-label="Delete category"
                                                                      title="Delete category"
                                                                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-white/70 transition-colors hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-300"
                                                                      onClick={() => confirmDeleteCategory(currentCategory)}
                                                                 >
                                                                      <FiTrash2 size={15} />
                                                                 </button>
                                                            </div>
                                                       </div>

                                                       {currentCategory.observation && (
                                                            <p className="mt-4 rounded-2xl bg-white/[0.03] px-4 py-3 text-sm leading-relaxed text-white/65">{currentCategory.observation}</p>
                                                       )}

                                                       <div className="mb-3 mt-6 flex items-center justify-between">
                                                            <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">Assets</h3>
                                                            <button
                                                                 type="button"
                                                                 className="inline-flex h-9 items-center gap-1.5 rounded-full border border-primary/40 px-3 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                                                                 onClick={() => handleOpenPatrimonioModal(currentCategory)}
                                                            >
                                                                 <FiPlus aria-hidden /> New asset
                                                            </button>
                                                       </div>

                                                       {loadingPatrimonios[currentCategory.id] ? (
                                                            <div className="space-y-2" aria-label="Loading assets">
                                                                 {[0, 1, 2].map(i => <div key={i} className="h-14 animate-pulse rounded-xl bg-white/[0.04]" />)}
                                                            </div>
                                                       ) : assets.length > 0 ? (
                                                            <div className="overflow-hidden rounded-2xl ring-1 ring-white/10">
                                                                 <table className="w-full text-left text-sm">
                                                                      <thead className="bg-white/[0.03] font-mono text-[10px] uppercase tracking-wider text-white/40">
                                                                           <tr>
                                                                                <th className="px-3 py-2.5 font-normal sm:px-4">Asset</th>
                                                                                <th className="hidden px-3 py-2.5 font-normal xl:table-cell">Acquired</th>
                                                                                <th className="hidden px-3 py-2.5 text-right font-normal sm:table-cell">Purchase</th>
                                                                                <th className="px-3 py-2.5 text-right font-normal">Today</th>
                                                                                <th className="px-3 py-2.5 font-normal sm:w-36">Value left</th>
                                                                           </tr>
                                                                      </thead>
                                                                      <tbody>
                                                                           {assets.map((item, index) => {
                                                                                const tone = valueTone(item.finalValue);
                                                                                return (
                                                                                     <motion.tr
                                                                                          key={item.id ?? index}
                                                                                          initial={{ opacity: 0 }}
                                                                                          animate={{ opacity: 1 }}
                                                                                          transition={{ delay: Math.min(index, 10) * 0.03 }}
                                                                                          tabIndex={0}
                                                                                          role="button"
                                                                                          aria-label={`Open ${item.name}`}
                                                                                          onClick={() => { setSelectedPatrimonio(item); setIsModalOpen(true); }}
                                                                                          onKeyDown={(e) => { if (e.key === 'Enter') { setSelectedPatrimonio(item); setIsModalOpen(true); } }}
                                                                                          className="cursor-pointer border-t border-white/[0.05] transition-colors hover:bg-white/[0.04] focus-visible:bg-white/[0.05] focus-visible:outline-none"
                                                                                     >
                                                                                          <td className="px-3 py-3 sm:px-4">
                                                                                               <div className="flex items-center gap-3">
                                                                                                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white ${tone.bg}`}>{item.name.charAt(0)}</span>
                                                                                                    <div className="min-w-0">
                                                                                                         <p className="truncate text-white">{item.name}</p>
                                                                                                         {item.codigo && <p className="font-mono text-[10px] text-white/35">{item.codigo}</p>}
                                                                                                    </div>
                                                                                               </div>
                                                                                          </td>
                                                                                          <td className="hidden whitespace-nowrap px-3 py-3 text-white/55 xl:table-cell">{monthYear(item.data_aquisicao)}</td>
                                                                                          <td className="hidden px-3 py-3 text-right text-white/55 sm:table-cell">{money(item.preco_inicial)}</td>
                                                                                          <td className="px-3 py-3 text-right font-medium text-white">{money(item.valor_atual)}</td>
                                                                                          <td className="px-3 py-3">
                                                                                               <div className="flex items-center gap-2">
                                                                                                    <ValueBar pct={item.finalValue} className="hidden flex-1 sm:block" />
                                                                                                    <span className={`w-9 text-right font-mono text-[11px] ${tone.text}`}>{item.finalValue}%</span>
                                                                                               </div>
                                                                                          </td>
                                                                                     </motion.tr>
                                                                                );
                                                                           })}
                                                                      </tbody>
                                                                 </table>
                                                            </div>
                                                       ) : (
                                                            <div className="rounded-2xl border border-dashed border-white/10 px-6 py-10 text-center">
                                                                 <FiTrendingDown className="mx-auto text-white/30" size={22} aria-hidden />
                                                                 <p className="mt-3 text-sm text-white/60">No assets in this category yet.</p>
                                                                 <button
                                                                      type="button"
                                                                      className="mt-3 text-sm font-medium text-primary hover:underline"
                                                                      onClick={() => handleOpenPatrimonioModal(currentCategory)}
                                                                 >
                                                                      Add the first asset
                                                                 </button>
                                                            </div>
                                                       )}
                                                  </motion.div>
                                             ) : (
                                                  <motion.div
                                                       key="empty"
                                                       initial={{ opacity: 0 }}
                                                       animate={{ opacity: 1 }}
                                                       className="sticky top-6 flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 px-6 py-20 text-center"
                                                  >
                                                       <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-white/40">
                                                            <FiBox size={22} />
                                                       </div>
                                                       <p className="font-display font-semibold">Pick a category</p>
                                                       <p className="mt-2 max-w-xs text-sm text-white/50">Its assets, what they cost and what they&apos;re worth today will show up here.</p>
                                                  </motion.div>
                                             )}
                                        </AnimatePresence>
                                   </section>
                              </div>
                         </div>
                    </main>
               </div>

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
                                   if (blockIfDemo()) return;
                                   try {
                                        if (patrimonio.id && selectedCategory) {
                                             await removePatrimonio(patrimonio.id);
                                             toast.success('Asset deleted');
                                             setIsModalOpen(false);
                                             await recarregarPatrimoniosETotais(selectedCategory.id);
                                        }
                                   } catch {
                                        toast.error("Couldn't delete the asset");
                                   }
                              }
                         });
                         setIsConfirmDeleteOpen(true);
                         setIsModalOpen(false);
                    }}
               />

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
                         if (selectedCategoryForPatrimonio) recarregarPatrimoniosETotais(selectedCategoryForPatrimonio.id);
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
                         if (selectedCategory) recarregarPatrimoniosETotais(selectedCategory.id);
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
                                   if (blockIfDemo()) return;
                                   try {
                                        await removeDepartamento(departamentoLocal);
                                        toast.success('Room deleted');
                                        window.location.href = '/departamentos';
                                   } catch {
                                        toast.error("Couldn't delete the room");
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
                         if (itemToDelete) await itemToDelete.onConfirm();
                         setIsConfirmDeleteOpen(false);
                         setItemToDelete(null);
                    }}
                    titulo={`Delete ${itemToDelete?.tipo === 'patrimonio' ? 'asset' : itemToDelete?.tipo === 'categoria' ? 'category' : itemToDelete?.tipo === 'departamento' ? 'room' : 'item'}`}
                    descricao={
                         itemToDelete?.tipo === 'categoria' ? 'Every asset in this category will be deleted too.'
                              : itemToDelete?.tipo === 'departamento' ? 'Every category and asset in this room will be deleted too.'
                                   : 'This asset and its history will be removed.'
                    }
                    itemNome={itemToDelete?.nome}
                    tipo={itemToDelete?.tipo as 'categoria' | 'patrimonio' | 'departamento'}
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
