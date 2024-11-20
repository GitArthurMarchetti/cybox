import React, { useState } from 'react';
import { IoMdClose } from "react-icons/io";

const EnterDepartmentModal = ({ isOpen, onClose }: {
     isOpen: boolean;
     onClose: () => void;
}) => {
     const [code, setCode] = useState('');

     if (!isOpen) return null;

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          // Add your logic here to handle the department code submission

          onClose();
     };

     return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
               <div className="bg-[#2C2C2C] rounded-2xl p-6 w-[400px] relative">
                    <div className="flex justify-between items-center mb-4">
                         <h2 className="text-xl text-white font-semibold">Entrar em nova sala</h2>
                         <button
                              onClick={onClose}
                              className="text-gray-400 hover:text-white"
                         >
                              <IoMdClose size={24} />
                         </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                         <div>
                              <input
                                   type="text"
                                   placeholder="Digite ou cole o código:"
                                   className="w-full bg-[#3F3F3F] text-white p-3 rounded-lg outline-none"
                                   value={code}
                                   onChange={(e) => setCode(e.target.value)}
                              />
                         </div>

                         <button
                              type="submit"
                              className="w-full bg-[#F6CF45] text-black py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
                         >
                              Entrar
                         </button>
                    </form>
               </div>
          </div>
     );
};

export default EnterDepartmentModal;