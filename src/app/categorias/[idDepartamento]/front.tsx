'use client'

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navigation/navbar';
import { DepartamentoType, UserType } from '@/lib/types/types';
import { motion, AnimatePresence } from 'framer-motion';
import { IoMdSearch } from 'react-icons/io';
import { MdFilterList, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdModeEdit, MdSearch, MdAdd } from 'react-icons/md';
import { RiDeleteBinLine } from 'react-icons/ri';
import { FaShare, FaArrowLeft, FaChartLine, FaFilter, FaPlus } from 'react-icons/fa';
import Image from 'next/image';
import { SidebarCategorias } from '@/app/components/Navigation/SidebarCategorias';
import { useRouter } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import ModalPatrimonio from '@/app/components/ModalPatrimonio';


// Definindo a interface para o tipo da categoria
interface Category {
     id: number;
     name: string;
     observation: string;
     total: number;
     notebooks?: PatrimonioDetalhadoType[];
}

// Interface para o patrimônio detalhado
interface PatrimonioDetalhadoType {
     id?: number;
     name: string;
     codigo?: string;
     finalValue: number;
     especificacoes?: string;
     data_aquisicao?: string;
     local?: string;
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
     categorias: Category[];
}

export default function CategoriaFront({
     departamento,
     user,
     host,
     categorias = [] // Valor padrão caso não seja fornecido
}: CategoriasProps) {
     const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
     const [searchTerm, setSearchTerm] = useState("");
     const [isLoaded, setIsLoaded] = useState(false);
     const [isAddNewOpen, setIsAddNewOpen] = useState(false);
     const router = useRouter();

     // Estados para o modal de detalhes do patrimônio
     const [isModalOpen, setIsModalOpen] = useState(false);
     const [selectedPatrimonio, setSelectedPatrimonio] = useState<PatrimonioDetalhadoType | null>(null);
     const [activeTab, setActiveTab] = useState<string>("depreciacao");

     // Simulação de categorias com dados mais completos para os patrimônios
     const categories: Category[] = [
          {
               id: 1,
               name: "Notebooks",
               observation: "todas salas",
               total: 375,
               notebooks: [
                    {
                         name: "Galaxy Book 2",
                         codigo: "246657655",
                         finalValue: 90,
                         especificacoes: "Galaxy Book 2, Intel Core i7 11ªgen, 8GB, 256GB SSD, Intel Iris Xe, 15.6\" Full HD LED, 1.85kg",
                         data_aquisicao: "2020-07-20",
                         local: "Lab 12",
                         preco_inicial: 3000,
                         valor_atual: 2700,
                         depreciacao_percentual: 10,
                         gastos_totais: 600,
                         gastos: [
                              { id: 1, tipo: "Custo de energia", descricao: "Consumo mensal", valor: 100, data: "2023-10-15" },
                              { id: 2, tipo: "Custo de energia", descricao: "Consumo mensal", valor: 100, data: "2023-09-15" },
                              { id: 3, tipo: "Custo de energia", descricao: "Consumo mensal", valor: 100, data: "2023-08-15" },
                              { id: 4, tipo: "Custo de energia", descricao: "Consumo mensal", valor: 100, data: "2023-07-15" },
                              { id: 5, tipo: "Custo de manutenção", descricao: "Troca de teclado", valor: 4500, data: "2023-09-20" },
                         ],
                         depreciacao_historico: [
                              { data: "jan", valor: 2950 },
                              { data: "fev", valor: 2900 },
                              { data: "mar", valor: 2850 },
                              { data: "abr", valor: 2800 },
                              { data: "mai", valor: 2750 },
                              { data: "jun", valor: 2700 },
                         ],
                         gastos_mensais: [
                              { mes: "jan", valor: 100 },
                              { mes: "fev", valor: 100 },
                              { mes: "mar", valor: 50 },
                              { mes: "abr", valor: 200 },
                              { mes: "mai", valor: 150 },
                              { mes: "jun", valor: 0 },
                         ]
                    },
                    {
                         name: "Asus TUF f15",
                         codigo: "387508367",
                         finalValue: 78,
                         especificacoes: "Asus TUF F15, Intel Core i5 12ªgen, 16GB, 512GB SSD, RTX 3050, 15.6\" 144Hz, 2.3kg",
                         data_aquisicao: "2021-06-25",
                         local: "Lab 15",
                         preco_inicial: 4500,
                         valor_atual: 3510,
                         depreciacao_percentual: 22,
                         gastos_totais: 800,
                         depreciacao_historico: [
                              { data: "jan", valor: 4000 },
                              { data: "fev", valor: 3900 },
                              { data: "mar", valor: 3800 },
                              { data: "abr", valor: 3700 },
                              { data: "mai", valor: 3600 },
                              { data: "jun", valor: 3510 },
                         ],
                         gastos_mensais: [
                              { mes: "jan", valor: 100 },
                              { mes: "fev", valor: 100 },
                              { mes: "mar", valor: 200 },
                              { mes: "abr", valor: 150 },
                              { mes: "mai", valor: 250 },
                              { mes: "jun", valor: 0 },
                         ],
                         gastos: [
                              { id: 1, tipo: "Custo de energia", descricao: "Consumo mensal", valor: 100, data: "2023-10-15" },
                              { id: 2, tipo: "Custo de energia", descricao: "Consumo mensal", valor: 100, data: "2023-09-15" },
                         ]
                    },
                    {
                         name: "Acer Aspire 5",
                         codigo: "736088438",
                         finalValue: 72,
                         especificacoes: "Acer Aspire 5, AMD Ryzen 5, 8GB, 256GB SSD, Radeon Graphics, 15.6\" Full HD, 1.9kg",
                         data_aquisicao: "2021-08-10",
                         local: "Recepção",
                         preco_inicial: 2800,
                         valor_atual: 2016,
                         depreciacao_percentual: 28,
                         gastos_totais: 350,
                         depreciacao_historico: [
                              { data: "jan", valor: 2500 },
                              { data: "fev", valor: 2400 },
                              { data: "mar", valor: 2300 },
                              { data: "abr", valor: 2200 },
                              { data: "mai", valor: 2100 },
                              { data: "jun", valor: 2016 },
                         ],
                         gastos_mensais: [
                              { mes: "jan", valor: 50 },
                              { mes: "fev", valor: 50 },
                              { mes: "mar", valor: 50 },
                              { mes: "abr", valor: 100 },
                              { mes: "mai", valor: 50 },
                              { mes: "jun", valor: 50 },
                         ],
                         gastos: [
                              { id: 1, tipo: "Custo de energia", descricao: "Consumo mensal", valor: 100, data: "2023-10-15" },
                         ]
                    },
                    {
                         name: "Dell G15",
                         codigo: "760945709",
                         finalValue: 64,
                         especificacoes: "Dell G15, Intel Core i7 12ªgen, 16GB, 512GB SSD, RTX 3060, 15.6\" 165Hz, 2.4kg",
                         data_aquisicao: "2021-08-29",
                         local: "Sala de design",
                         preco_inicial: 5200,
                         valor_atual: 3328,
                         depreciacao_percentual: 36,
                         gastos_totais: 1200,
                         depreciacao_historico: [
                              { data: "jan", valor: 4800 },
                              { data: "fev", valor: 4600 },
                              { data: "mar", valor: 4400 },
                              { data: "abr", valor: 4000 },
                              { data: "mai", valor: 3600 },
                              { data: "jun", valor: 3328 },
                         ],
                         gastos_mensais: [
                              { mes: "jan", valor: 200 },
                              { mes: "fev", valor: 200 },
                              { mes: "mar", valor: 200 },
                              { mes: "abr", valor: 300 },
                              { mes: "mai", valor: 200 },
                              { mes: "jun", valor: 100 },
                         ],
                         gastos: [
                              { id: 1, tipo: "Custo de energia", descricao: "Consumo mensal", valor: 100, data: "2023-10-15" },
                              { id: 2, tipo: "Custo de manutenção", descricao: "Limpeza interna", valor: 200, data: "2023-08-12" },
                         ]
                    },
                    {
                         name: "MacBook Pro M2",
                         codigo: "687095699",
                         finalValue: 50,
                         especificacoes: "MacBook Pro, Apple M2, 16GB, 512GB SSD, 14\" Retina, 1.6kg",
                         data_aquisicao: "2022-09-01",
                         local: "Diretoria",
                         preco_inicial: 9800,
                         valor_atual: 4900,
                         depreciacao_percentual: 50,
                         gastos_totais: 800,
                         depreciacao_historico: [
                              { data: "jan", valor: 9000 },
                              { data: "fev", valor: 8500 },
                              { data: "mar", valor: 7500 },
                              { data: "abr", valor: 6500 },
                              { data: "mai", valor: 5500 },
                              { data: "jun", valor: 4900 },
                         ],
                         gastos_mensais: [
                              { mes: "jan", valor: 100 },
                              { mes: "fev", valor: 150 },
                              { mes: "mar", valor: 100 },
                              { mes: "abr", valor: 200 },
                              { mes: "mai", valor: 150 },
                              { mes: "jun", valor: 100 },
                         ],
                         gastos: [
                              { id: 1, tipo: "Custo de energia", descricao: "Consumo mensal", valor: 100, data: "2023-10-15" },
                              { id: 2, tipo: "Custo de energia", descricao: "Consumo mensal", valor: 100, data: "2023-09-15" },
                         ]
                    },
               ]
          },
          {
               id: 2,
               name: "Monitores",
               observation: "sala de TI",
               total: 42,
               notebooks: [
                    { name: "Dell P2419H", finalValue: 85 },
                    { name: "LG UltraWide", finalValue: 72 },
                    { name: "Samsung Odyssey G7", finalValue: 95 },
               ]
          },
          {
               id: 3,
               name: "Mobiliário",
               observation: "escritório central",
               total: 128,
               notebooks: [
                    { name: "Mesa de escritório", finalValue: 65 },
                    { name: "Cadeira ergonômica", finalValue: 80 },
                    { name: "Armário de arquivo", finalValue: 50 },
               ]
          },
     ];

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
     const formatarPreco = (valor: number) => {
          if (!valor) return "R$ 0,00";
          return valor.toLocaleString('pt-BR', {
               style: 'currency',
               currency: 'BRL'
          });
     };

     // Efeito para animação de carregamento da página
     useEffect(() => {
          setIsLoaded(true);
     }, []);

     // Variantes de animação
     const containerVariants = {
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

     const itemVariants = {
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
                    initial="hidden"
                    animate={isLoaded ? "visible" : "hidden"}
                    variants={containerVariants}
               >
                    {/* Sidebar esquerda - Informações do departamento */}
                    <SidebarCategorias
                         departamento={departamento}
                         user={user}
                         host={host}
                         onAddCategoryClick={() => setIsAddNewOpen(true)}
                    />

                    {/* Conteúdo principal - Lista de categorias */}
                    <motion.main className="flex-1 flex flex-col overflow-hidden" variants={itemVariants}>
                         <motion.div className="flex items-center justify-between p-6 border-b border-[#2c2c2c]" variants={itemVariants}>
                              <h1 className="text-xl font-bold">Categorias</h1>
                              <div className="flex items-center gap-4">
                                   <div className="relative">
                                        <input
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
                                        <motion.div className="space-y-4" variants={containerVariants}>
                                             {filteredCategories.map((category, index) => (
                                                  <motion.div
                                                       key={category.id}
                                                       className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${selectedCategory?.id === category.id
                                                            ? 'bg-[#2c2c2c] border-l-4 border-[#F6CF45]'
                                                            : 'bg-[#1a1a1a] hover:bg-[#2c2c2c]'
                                                            }`}
                                                       onClick={() => setSelectedCategory(category)}
                                                       variants={itemVariants}
                                                       whileHover={{ x: 5 }}
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
                                        {selectedCategory ? (
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
                                                       <h2 className="text-xl font-bold">{selectedCategory.name}</h2>
                                                       <div className="flex items-center gap-2">
                                                            <button className="p-2 bg-[#2c2c2c] text-[#F6CF45] hover:text-white rounded-lg transition-colors duration-300">
                                                                 <MdModeEdit size={18} />
                                                            </button>
                                                            <button className="p-2 bg-[#2c2c2c] text-red-500 hover:text-white rounded-lg transition-colors duration-300">
                                                                 <RiDeleteBinLine size={18} />
                                                            </button>
                                                       </div>
                                                  </div>

                                                  <div className="bg-[#1a1a1a] p-4 rounded-xl mb-6">
                                                       <p className="text-[#b4b4b4] text-sm mb-2">Observação</p>
                                                       <p className="text-white">{selectedCategory.observation}</p>
                                                  </div>

                                                  <div className="flex justify-between items-center mb-4">
                                                       <h3 className="font-medium">Patrimônios cadastrados</h3>
                                                       <button
                                                            className="flex items-center gap-1 text-sm text-[#F6CF45] hover:text-white transition-colors duration-300"
                                                       >
                                                            <MdAdd size={16} /> Novo patrimônio
                                                       </button>
                                                  </div>

                                                  <div className="space-y-3">
                                                       {selectedCategory.notebooks?.map((item, index) => (
                                                            <motion.div
                                                                 key={index}
                                                                 className="bg-[#2c2c2c] p-3 rounded-lg flex items-center justify-between"
                                                                 initial={{ opacity: 0, y: 10 }}
                                                                 animate={{ opacity: 1, y: 0 }}
                                                                 transition={{ delay: index * 0.05, duration: 0.2 }}
                                                                 whileHover={{ scale: 1.02 }}
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
                                                       ))}
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
                                        )}
                                   </AnimatePresence>
                              </div>
                         </div>
                    </motion.main>
               </motion.div>

               {/* Modal de detalhes do patrimônio */}
               <AnimatePresence>
                    {isModalOpen && selectedPatrimonio && (
                         <motion.div
                              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              onClick={() => setIsModalOpen(false)}
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
                                                  onClick={() => setIsModalOpen(false)}
                                             >
                                                  <FaArrowLeft size={14} />
                                                  <span className="text-sm">Voltar para categorias</span>
                                             </button>
                                        </div>
                                        <div className="flex gap-2">
                                             <button className="p-2 bg-[#F6CF45] rounded-md hover:bg-[#F6CF45]/90 transition-colors duration-300">
                                                  <MdModeEdit size={18} />
                                             </button>
                                             <button className="p-2 bg-red-500 rounded-md hover:bg-red-600 transition-colors duration-300">
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
                                                       <div className={`w-16 h-16 flex items-center justify-center rounded-md text-2xl font-bold ${selectedPatrimonio.finalValue >= 70 ? 'bg-green-500' : selectedPatrimonio.finalValue >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}>
                                                            {selectedPatrimonio.name.charAt(0)}
                                                       </div>
                                                       <div>
                                                            <h1 className="text-2xl font-bold">{selectedPatrimonio.name}</h1>
                                                            <p className="text-[#8c8888] text-sm">{selectedPatrimonio.codigo}</p>
                                                       </div>
                                                  </div>

                                                  <div className="space-y-4">
                                                       <div className="bg-[#2c2c2c] p-4 rounded-md">
                                                            <p className="text-[#8c8888] text-sm mb-1">Especificações</p>
                                                            <p className="text-white">{selectedPatrimonio.especificacoes || "Não especificado"}</p>
                                                       </div>

                                                       <div className="bg-[#2c2c2c] p-4 rounded-md">
                                                            <p className="text-[#8c8888] text-sm mb-1">Data de aquisição</p>
                                                            <p className="text-white">{formatarData(selectedPatrimonio.data_aquisicao || "")}</p>
                                                       </div>

                                                       <div className="bg-[#2c2c2c] p-4 rounded-md">
                                                            <p className="text-[#8c8888] text-sm mb-1">Localização</p>
                                                            <p className="text-white">{selectedPatrimonio.local || "Não especificado"}</p>
                                                       </div>

                                                       <div className="bg-[#2c2c2c] p-4 rounded-md">
                                                            <div className="flex justify-between mb-2">
                                                                 <p className="text-[#8c8888] text-sm">Preço inicial</p>
                                                                 <p className="text-white">{formatarPreco(selectedPatrimonio.preco_inicial || 0)}</p>
                                                            </div>
                                                            <div className="flex justify-between mb-2">
                                                                 <p className="text-[#8c8888] text-sm">Valor atual</p>
                                                                 <p className="text-[#F6CF45]">{formatarPreco(selectedPatrimonio.valor_atual || 0)}</p>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                 <p className="text-[#8c8888] text-sm">Total de gastos</p>
                                                                 <p className="text-red-500">{formatarPreco(selectedPatrimonio.gastos_totais || 0)}</p>
                                                            </div>
                                                       </div>

                                                       <div className="bg-[#2c2c2c] p-4 rounded-md">
                                                            <p className="text-[#8c8888] text-sm mb-1">Status</p>
                                                            <p className={`text-xl font-bold ${selectedPatrimonio.finalValue >= 70 ? 'text-green-500' : selectedPatrimonio.finalValue >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                                                                 {selectedPatrimonio.finalValue}% do valor final
                                                            </p>
                                                            <p className="text-[#8c8888] text-sm mt-1">
                                                                 Depreciação: {selectedPatrimonio.depreciacao_percentual || (100 - selectedPatrimonio.finalValue)}%
                                                            </p>
                                                       </div>
                                                  </div>
                                             </div>

                                             {/* Coluna 2 - Gráficos */}
                                             <div className="col-span-2 space-y-6">
                                                  {/* Tabs */}
                                                  <div className="flex gap-4 mb-2">
                                                       <button
                                                            className={`py-2 px-4 rounded-md transition-colors duration-300 flex items-center gap-2 ${activeTab === 'depreciacao' ? 'bg-[#F6CF45] text-black' : 'bg-[#2c2c2c] text-white hover:bg-[#3c3c3c]'}`}
                                                            onClick={() => setActiveTab('depreciacao')}
                                                       >
                                                            <FaChartLine />
                                                            Depreciação <span className="text-sm opacity-80">{selectedPatrimonio.depreciacao_percentual || (100 - selectedPatrimonio.finalValue)}%</span>
                                                       </button>
                                                       <button
                                                            className={`py-2 px-4 rounded-md transition-colors duration-300 flex items-center gap-2 ${activeTab === 'gastos' ? 'bg-[#F6CF45] text-black' : 'bg-[#2c2c2c] text-white hover:bg-[#3c3c3c]'}`}
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
                                                                           {activeTab === 'depreciacao' ? selectedPatrimonio.depreciacao_percentual : 5}%
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
                                                                           <LineChart data={selectedPatrimonio.depreciacao_historico || []}>
                                                                                <CartesianGrid strokeDasharray="3 3" stroke="#3c3c3c" />
                                                                                <XAxis dataKey="data" stroke="#8c8888" />
                                                                                <YAxis stroke="#8c8888" />
                                                                                <Tooltip
                                                                                     contentStyle={{ backgroundColor: '#1F1F1F', borderColor: '#3c3c3c' }}
                                                                                     labelStyle={{ color: '#8c8888' }}
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
                                                                           <BarChart data={selectedPatrimonio.gastos_mensais || []}>
                                                                                <CartesianGrid strokeDasharray="3 3" stroke="#3c3c3c" />
                                                                                <XAxis dataKey="mes" stroke="#8c8888" />
                                                                                <YAxis stroke="#8c8888" />
                                                                                <Tooltip
                                                                                     contentStyle={{ backgroundColor: '#1F1F1F', borderColor: '#3c3c3c' }}
                                                                                     labelStyle={{ color: '#8c8888' }}
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
                                                                           {(selectedPatrimonio.gastos || []).map((gasto) => (
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

                                                                           {(!selectedPatrimonio.gastos || selectedPatrimonio.gastos.length === 0) && (
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
                                   <div className="p-6 border-t border-[#2c2c2c] flex justify-end">
                                        <button
                                             className="px-4 py-2 bg-[#2c2c2c] text-white rounded-md hover:bg-[#3c3c3c] transition-colors duration-300"
                                             onClick={() => setIsModalOpen(false)}
                                        >
                                             Fechar
                                        </button>
                                   </div>
                              </motion.div>
                         </motion.div>
                    )}
               </AnimatePresence>

               {/* Modal para adicionar nova categoria */}
               <AnimatePresence>
                    {isAddNewOpen && (
                         <motion.div
                              className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                         >
                              <motion.div
                                   className="bg-[#1a1a1a] rounded-xl w-full max-w-md overflow-hidden"
                                   initial={{ scale: 0.9, opacity: 0 }}
                                   animate={{ scale: 1, opacity: 1 }}
                                   exit={{ scale: 0.9, opacity: 0 }}
                                   transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                              >
                                   <div className="p-6 border-b border-[#2c2c2c]">
                                        <div className="flex items-center justify-between">
                                             <h2 className="text-xl font-bold">Nova Categoria</h2>
                                             <button
                                                  className="text-[#8c8888] hover:text-white transition-colors duration-300"
                                                  onClick={() => setIsAddNewOpen(false)}
                                             >
                                                  <MdKeyboardArrowLeft size={24} />
                                             </button>
                                        </div>
                                   </div>

                                   <div className="p-6">
                                        <form className="space-y-4">
                                             <div>
                                                  <label className="block text-sm text-[#b4b4b4] mb-1">Nome da categoria</label>
                                                  <input
                                                       type="text"
                                                       className="w-full bg-[#2c2c2c] text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6CF45]/50"
                                                       placeholder="Ex: Notebooks, Mobiliário, etc."
                                                  />
                                             </div>

                                             <div>
                                                  <label className="block text-sm text-[#b4b4b4] mb-1">Observação</label>
                                                  <textarea
                                                       className="w-full bg-[#2c2c2c] text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6CF45]/50 resize-none h-32"
                                                       placeholder="Adicione uma descrição ou observação sobre esta categoria..."
                                                  ></textarea>
                                             </div>

                                             <div className="flex items-center justify-end gap-3">
                                                  <button
                                                       type="button"
                                                       className="px-4 py-2 text-[#b4b4b4] hover:text-white transition-colors duration-300"
                                                       onClick={() => setIsAddNewOpen(false)}
                                                  >
                                                       Cancelar
                                                  </button>
                                                  <button
                                                       type="submit"
                                                       className="px-4 py-2 bg-[#F6CF45] text-black font-medium rounded-lg hover:bg-[#F6CF45]/90 transition-colors duration-300"
                                                  >
                                                       Criar Categoria
                                                  </button>
                                             </div>
                                        </form>
                                   </div>
                              </motion.div>
                         </motion.div>
                    )}
               </AnimatePresence>
          </div>
     );
}