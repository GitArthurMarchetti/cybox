'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose, MdLogin } from "react-icons/md";
import { FaKey } from "react-icons/fa";

const EnterDepartmentModal = ({ isOpen, onClose }: {
     isOpen: boolean;
     onClose: () => void;
}) => {
     const [code, setCode] = useState('');
     const [isLoading, setIsLoading] = useState(false);

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          if (!code.trim()) return;
          
          setIsLoading(true);
          try {
               // Add your logic here to handle the department code submission
               await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay
               onClose();
          } catch (error) {
               console.error('Erro ao entrar no departamento:', error);
          } finally {
               setIsLoading(false);
          }
     };

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
                              className="bg-[#1F1F1F] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-[#2c2c2c]"
                              initial={{ scale: 0.9, opacity: 0, y: 20 }}
                              animate={{ scale: 1, opacity: 1, y: 0 }}
                              exit={{ scale: 0.9, opacity: 0, y: 20 }}
                              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                              onClick={(e) => e.stopPropagation()}
                         >
                              <div className="p-6 border-b border-[#2c2c2c] flex items-center justify-between h-28">
                                   <div className="flex items-center gap-3">
                                        <div className="p-2 bg-[#F6CF45] rounded-lg">
                                             <MdLogin className="text-black" size={20} />
                                        </div>
                                        <div>
                                             <h2 className="text-xl font-bold text-white">Entrar no Departamento</h2>
                                             <p className="text-[#8c8888] text-sm">Digite o código de convite recebido</p>
                                        </div>
                                   </div>
                                   <button
                                        onClick={onClose}
                                        className="p-2 hover:bg-[#2c2c2c] rounded-lg transition-colors duration-300 text-[#8c8888] hover:text-white"
                                   >
                                        <MdClose size={24} />
                                   </button>
                              </div>

                              <div className="p-8">
                                   <form onSubmit={handleSubmit} className="space-y-6">
                                        <motion.div
                                             initial={{ opacity: 0, y: 20 }}
                                             animate={{ opacity: 1, y: 0 }}
                                             transition={{ duration: 0.3, delay: 0.1 }}
                                        >
                                             <label className="block text-sm font-medium text-[#b4b4b4] mb-2">
                                                  Código do Convite
                                             </label>
                                             <div className="relative">
                                                  <FaKey className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#8c8888]" size={16} />
                                                  <input
                                                       type="text"
                                                       placeholder="Digite o código (ex: INV-ABC123)"
                                                       className="w-full bg-[#2c2c2c] text-white pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6CF45]/50 placeholder-[#6c6c6c]"
                                                       value={code}
                                                       onChange={(e) => setCode(e.target.value.toUpperCase())}
                                                       maxLength={20}
                                                  />
                                             </div>
                                             <p className="text-xs text-[#8c8888] mt-2">
                                                  O código deve ter sido enviado pelo administrador do departamento
                                             </p>
                                        </motion.div>

                                        <motion.div 
                                             className="flex items-center justify-between pt-6 border-t border-[#2c2c2c]"
                                             initial={{ opacity: 0 }}
                                             animate={{ opacity: 1 }}
                                             transition={{ duration: 0.3, delay: 0.2 }}
                                        >
                                             <div className="text-sm text-[#8c8888]">
                                                  Você será adicionado ao departamento
                                             </div>
                                             <div className="flex items-center gap-3">
                                                  <button
                                                       type="button"
                                                       className="px-6 py-3 text-[#b4b4b4] hover:text-white hover:bg-[#2c2c2c] rounded-lg transition-all duration-300"
                                                       onClick={onClose}
                                                  >
                                                       Cancelar
                                                  </button>
                                                  <button
                                                       type="submit"
                                                       disabled={isLoading || !code.trim()}
                                                       className="px-6 py-3 bg-[#F6CF45] text-black font-medium rounded-lg hover:bg-[#F6CF45]/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                  >
                                                       {isLoading ? (
                                                            <>
                                                                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                                                                 Entrando...
                                                            </>
                                                       ) : (
                                                            <>
                                                                 <MdLogin size={16} />
                                                                 Entrar
                                                            </>
                                                       )}
                                                  </button>
                                             </div>
                                        </motion.div>
                                   </form>
                              </div>
                         </motion.div>
                    </motion.div>
               )}
          </AnimatePresence>
     );
};

export default EnterDepartmentModal;