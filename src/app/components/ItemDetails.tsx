'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdKeyboardArrowLeft, MdEdit, MdDelete, MdSave, MdCancel, MdHistory } from 'react-icons/md';
import { FaMoneyBillWave, FaCalendarAlt, FaChartLine } from 'react-icons/fa';

interface ItemDetailsProps {
     item: {
          id: number;
          name: string;
          description?: string;
          initialValue: number;
          currentValue: number;
          acquisitionDate: string;
          depreciationPeriod: number; // em meses
          history?: {
               date: string;
               value: number;
          }[];
     };
     onClose: () => void;
}

export function ItemDetails({ item, onClose }: ItemDetailsProps) {
     const [isEditing, setIsEditing] = useState(false);
     const [activeTab, setActiveTab] = useState('info'); // 'info' ou 'history'

     // Calcular percentual de depreciação
     const depreciationPercent = Math.round((1 - (item.currentValue / item.initialValue)) * 100);

     // Formatar valores monetários
     const formatCurrency = (value: number) => {
          return new Intl.NumberFormat('pt-BR', {
               style: 'currency',
               currency: 'BRL'
          }).format(value);
     };

     // Formatar datas
     const formatDate = (dateString: string) => {
          const date = new Date(dateString);
          return new Intl.DateTimeFormat('pt-BR').format(date);
     };

     // Determinar cor baseada no percentual de depreciação
     const getValueColor = () => {
          if (depreciationPercent < 30) return "text-green-500";
          if (depreciationPercent < 60) return "text-yellow-500";
          return "text-red-500";
     };

     return (
          <motion.div
               className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
          >
               <motion.div
                    className="bg-[#1a1a1a] rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
               >
                    {/* Cabeçalho */}
                    <div className="p-6 border-b border-[#2c2c2c] flex items-center justify-between">
                         <div className="flex items-center gap-3">
                              <button
                                   className="p-2 bg-[#2c2c2c] rounded-lg text-[#8c8888] hover:text-white transition-colors duration-300"
                                   onClick={onClose}
                              >
                                   <MdKeyboardArrowLeft size={20} />
                              </button>
                              <h2 className="text-xl font-bold text-white">{item.name}</h2>
                         </div>
                         <div className="flex items-center gap-2">
                              {isEditing ? (
                                   <>
                                        <button
                                             className="p-2 bg-[#2c2c2c] rounded-lg text-green-500 hover:text-white transition-colors duration-300"
                                             onClick={() => setIsEditing(false)}
                                        >
                                             <MdSave size={20} />
                                        </button>
                                        <button
                                             className="p-2 bg-[#2c2c2c] rounded-lg text-[#8c8888] hover:text-white transition-colors duration-300"
                                             onClick={() => setIsEditing(false)}
                                        >
                                             <MdCancel size={20} />
                                        </button>
                                   </>
                              ) : (
                                   <>
                                        <button
                                             className="p-2 bg-[#2c2c2c] rounded-lg text-[#F6CF45] hover:text-white transition-colors duration-300"
                                             onClick={() => setIsEditing(true)}
                                        >
                                             <MdEdit size={20} />
                                        </button>
                                        <button
                                             className="p-2 bg-[#2c2c2c] rounded-lg text-red-500 hover:text-white transition-colors duration-300"
                                        >
                                             <MdDelete size={20} />
                                        </button>
                                   </>
                              )}
                         </div>
                    </div>

                    {/* Tabs de navegação */}
                    <div className="border-b border-[#2c2c2c] px-6">
                         <div className="flex">
                              <button
                                   className={`py-4 px-6 text-sm font-medium relative ${activeTab === 'info' ? 'text-[#F6CF45]' : 'text-[#8c8888] hover:text-white'
                                        } transition-colors duration-300`}
                                   onClick={() => setActiveTab('info')}
                              >
                                   Informações
                                   {activeTab === 'info' && (
                                        <motion.div
                                             className="absolute bottom-0 left-0 w-full h-0.5 bg-[#F6CF45]"
                                             layoutId="activeTab"
                                        />
                                   )}
                              </button>
                              <button
                                   className={`py-4 px-6 text-sm font-medium relative ${activeTab === 'history' ? 'text-[#F6CF45]' : 'text-[#8c8888] hover:text-white'
                                        } transition-colors duration-300`}
                                   onClick={() => setActiveTab('history')}
                              >
                                   Histórico de Depreciação
                                   {activeTab === 'history' && (
                                        <motion.div
                                             className="absolute bottom-0 left-0 w-full h-0.5 bg-[#F6CF45]"
                                             layoutId="activeTab"
                                        />
                                   )}
                              </button>
                         </div>
                    </div>

                    {/* Conteúdo */}
                    <div className="p-6">
                         <AnimatePresence mode="wait">
                              {activeTab === 'info' ? (
                                   <motion.div
                                        key="info"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.2 }}
                                        className="space-y-6"
                                   >
                                        {/* Resumo de valores */}
                                        <div className="grid grid-cols-2 gap-4">
                                             <div className="bg-[#2c2c2c] p-4 rounded-lg">
                                                  <div className="flex items-center gap-3 mb-2">
                                                       <FaMoneyBillWave className="text-[#F6CF45]" />
                                                       <p className="text-[#8c8888]">Valor inicial</p>
                                                  </div>
                                                  <p className="text-xl font-bold text-white">{formatCurrency(item.initialValue)}</p>
                                             </div>
                                             <div className="bg-[#2c2c2c] p-4 rounded-lg">
                                                  <div className="flex items-center gap-3 mb-2">
                                                       <FaChartLine className="text-[#F6CF45]" />
                                                       <p className="text-[#8c8888]">Valor atual</p>
                                                  </div>
                                                  <p className={`text-xl font-bold ${getValueColor()}`}>{formatCurrency(item.currentValue)}</p>
                                             </div>
                                        </div>

                                        {/* Informações adicionais */}
                                        <div className="space-y-4">
                                             {/* Data de aquisição */}
                                             <div className="flex items-center justify-between">
                                                  <div className="flex items-center gap-3">
                                                       <div className="p-2 bg-[#2c2c2c] rounded-lg">
                                                            <FaCalendarAlt className="text-[#F6CF45]" />
                                                       </div>
                                                       <p className="text-[#8c8888]">Data de aquisição</p>
                                                  </div>
                                                  <p className="text-white">{formatDate(item.acquisitionDate)}</p>
                                             </div>

                                             {/* Período de depreciação */}
                                             <div className="flex items-center justify-between">
                                                  <div className="flex items-center gap-3">
                                                       <div className="p-2 bg-[#2c2c2c] rounded-lg">
                                                            <MdHistory className="text-[#F6CF45]" />
                                                       </div>
                                                       <p className="text-[#8c8888]">Período de depreciação</p>
                                                  </div>
                                                  <p className="text-white">{item.depreciationPeriod} meses</p>
                                             </div>

                                             {/* Percentual de depreciação */}
                                             <div className="flex items-center justify-between">
                                                  <div className="flex items-center gap-3">
                                                       <div className="p-2 bg-[#2c2c2c] rounded-lg">
                                                            <FaChartLine className="text-[#F6CF45]" />
                                                       </div>
                                                       <p className="text-[#8c8888]">Depreciação acumulada</p>
                                                  </div>
                                                  <p className={`font-medium ${getValueColor()}`}>{depreciationPercent}%</p>
                                             </div>
                                        </div>

                                        {/* Descrição */}
                                        <div>
                                             <h3 className="text-white font-medium mb-2">Descrição</h3>
                                             <div className="bg-[#2c2c2c] p-4 rounded-lg">
                                                  <p className="text-[#b4b4b4]">
                                                       {item.description || "Nenhuma descrição disponível."}
                                                  </p>
                                             </div>
                                        </div>

                                        {/* Progresso de depreciação */}
                                        <div>
                                             <div className="flex justify-between items-center mb-2">
                                                  <h3 className="text-white font-medium">Progresso de depreciação</h3>
                                                  <p className={`text-sm ${getValueColor()}`}>{depreciationPercent}%</p>
                                             </div>
                                             <div className="w-full h-2 bg-[#2c2c2c] rounded-full overflow-hidden">
                                                  <motion.div
                                                       className={`h-full ${depreciationPercent < 30 ? 'bg-green-500' :
                                                                 depreciationPercent < 60 ? 'bg-yellow-500' : 'bg-red-500'
                                                            }`}
                                                       style={{ width: `${depreciationPercent}%` }}
                                                       initial={{ width: '0%' }}
                                                       animate={{ width: `${depreciationPercent}%` }}
                                                       transition={{ duration: 1, ease: "easeOut" }}
                                                  />
                                             </div>
                                        </div>
                                   </motion.div>
                              ) : (
                                   <motion.div
                                        key="history"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.2 }}
                                        className="space-y-6"
                                   >
                                        {item.history && item.history.length > 0 ? (
                                             <div className="space-y-4">
                                                  {item.history.map((record, index) => (
                                                       <div key={index} className="bg-[#2c2c2c] p-4 rounded-lg flex justify-between items-center">
                                                            <div>
                                                                 <p className="text-white font-medium">{formatDate(record.date)}</p>
                                                                 <p className="text-[#8c8888] text-sm">Valor registrado</p>
                                                            </div>
                                                            <p className="text-lg font-bold text-white">{formatCurrency(record.value)}</p>
                                                       </div>
                                                  ))}
                                             </div>
                                        ) : (
                                             <div className="flex flex-col items-center justify-center py-10 text-center">
                                                  <div className="p-4 bg-[#2c2c2c] rounded-full mb-4">
                                                       <MdHistory className="text-[#8c8888]" size={32} />
                                                  </div>
                                                  <h3 className="text-lg font-medium text-white mb-2">Sem histórico de depreciação</h3>
                                                  <p className="text-[#8c8888] max-w-md">
                                                       Este item ainda não possui registros históricos de depreciação.
                                                  </p>
                                             </div>
                                        )}
                                   </motion.div>
                              )}
                         </AnimatePresence>
                    </div>

                    {/* Rodapé */}
                    <div className="p-6 border-t border-[#2c2c2c] flex justify-end">
                         <button
                              className="px-4 py-2 bg-[#2c2c2c] text-white rounded-lg hover:bg-[#3c3c3c] transition-colors duration-300"
                              onClick={onClose}
                         >
                              Fechar
                         </button>
                    </div>
               </motion.div>
          </motion.div>
     );
}