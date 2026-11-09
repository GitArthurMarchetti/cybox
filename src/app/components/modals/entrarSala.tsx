'use client'

import { Modal, ModalHeader } from '@/components/ui/modal';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MdLogin } from "react-icons/md";
import { FaKey } from "react-icons/fa";

const EnterDepartmentModal = ({ isOpen, onClose }: {
     isOpen: boolean;
     onClose: () => void;
}) => {
     const [code, setCode] = useState('');
     const [isLoading, setIsLoading] = useState(false);
     const router = useRouter();

     const handleSubmit = (e: React.FormEvent) => {
          e.preventDefault();
          const codigo = code.trim().toUpperCase();
          if (!codigo) return;

          setIsLoading(true);
          router.push(`/convite/${encodeURIComponent(codigo)}`);
     };

     return (
          <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
                              <ModalHeader
                                  icone={<MdLogin size={20} />}
                                  titulo="Join a room"
                                  subtitulo="Paste the invite code a teammate shared with you"
                                  onClose={onClose}
                              />

                              <div className="p-8">
                                   <form onSubmit={handleSubmit} className="space-y-6">
                                        <motion.div
                                             initial={{ opacity: 0, y: 20 }}
                                             animate={{ opacity: 1, y: 0 }}
                                             transition={{ duration: 0.3, delay: 0.1 }}
                                        >
                                             <label className="block text-sm font-medium text-muted mb-2">
                                                  Invite code
                                             </label>
                                             <div className="relative">
                                                  <FaKey className="absolute left-4 top-1/2 transform -translate-y-1/2 text-subtle" size={16} />
                                                  <input
                                                       type="text"
                                                       placeholder="e.g. DEPT-AB12CD34EF"
                                                       className="w-full bg-surface-2 text-white pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder-subtle"
                                                       value={code}
                                                       onChange={(e) => setCode(e.target.value.toUpperCase())}
                                                       maxLength={20}
                                                  />
                                             </div>
                                             <p className="text-xs text-subtle mt-2">
                                                  Ask the room&apos;s owner or an admin for it
                                             </p>
                                        </motion.div>

                                        <motion.div 
                                             className="flex items-center justify-between pt-6 border-t border-line"
                                             initial={{ opacity: 0 }}
                                             animate={{ opacity: 1 }}
                                             transition={{ duration: 0.3, delay: 0.2 }}
                                        >
                                             <div className="text-sm text-subtle">
                                                  You&apos;ll join the room as a member
                                             </div>
                                             <div className="flex items-center gap-3">
                                                  <button
                                                       type="button"
                                                       className="px-6 py-3 text-muted hover:text-white hover:bg-surface-2 rounded-lg transition-all duration-300"
                                                       onClick={onClose}
                                                  >
                                                       Cancel
                                                  </button>
                                                  <button
                                                       type="submit"
                                                       disabled={isLoading || !code.trim()}
                                                       className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-primary px-6 py-3 font-semibold text-black transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                                                  >
                                                       {isLoading ? (
                                                            <>
                                                                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                                                                 Joining…
                                                            </>
                                                       ) : (
                                                            <>
                                                                 <MdLogin size={16} />
                                                                 Join room
                                                            </>
                                                       )}
                                                  </button>
                                             </div>
                                        </motion.div>
                                   </form>
                              </div>
                         </Modal>
     );
};

export default EnterDepartmentModal;