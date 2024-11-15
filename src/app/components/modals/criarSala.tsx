import React, { useState } from 'react';
import { IoMdClose } from "react-icons/io";
import { FaUpload } from "react-icons/fa";
import { saveDepartamento } from '../../services/departamento';

const CreateDepartmentModal = ({ isOpen, onClose, userId }: {
     isOpen: boolean;
     onClose: () => void;
     userId: string;
}) => {
     const [formData, setFormData] = useState({
          titulo: '',
          descricao: '',
     });

     if (!isOpen) return null;

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          const data = new FormData();
          data.append('titulo', formData.titulo);
          data.append('descricao', formData.descricao);

          try {
               await saveDepartamento(data, userId);
               onClose();
          } catch (error) {
               console.error('Error creating department:', error);
          }
     };

     return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
               <div className="bg-[#2C2C2C] rounded-2xl p-6 w-[500px] relative">
                    <div className="flex justify-between items-center mb-4">
                         <h2 className="text-xl text-white font-semibold">Criar nova sala</h2>
                         <button
                              onClick={onClose}
                              className="text-gray-400 hover:text-white"
                         >
                              <IoMdClose size={24} />
                         </button>
                    </div>

                    <p className="text-gray-400 text-sm mb-6">
                         Alguma frase que explique etc
                    </p>

                    <div className="mb-6">
                         <button className="w-full border-2 border-dashed border-gray-600 rounded-lg p-4 flex flex-col items-center justify-center text-gray-400 hover:border-yellow-400 hover:text-yellow-400 transition-colors">
                              <FaUpload size={24} className="mb-2" />
                              <span>upload do ícone</span>
                         </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                         <div>
                              <input
                                   type="text"
                                   placeholder="Nome:"
                                   className="w-full bg-[#3F3F3F] text-white p-3 rounded-lg outline-none"
                                   value={formData.titulo}
                                   onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                              />
                         </div>

                         <div>
                              <textarea
                                   placeholder="Descrição:"
                                   className="w-full bg-[#3F3F3F] text-white p-3 rounded-lg outline-none resize-none h-32"
                                   value={formData.descricao}
                                   onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                              />
                         </div>

                         <button
                              type="submit"
                              className="w-full bg-[#F6CF45] text-black py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
                         >
                              Concluído
                         </button>
                    </form>
               </div>
          </div>
     );
};

export default CreateDepartmentModal;