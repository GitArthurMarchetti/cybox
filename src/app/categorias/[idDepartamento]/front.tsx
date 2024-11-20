'use client'

import { useState } from 'react';
import Navbar from '../../components/Navigation/navbar';
import { FaFilter, FaGear, FaPlus, FaShare } from 'react-icons/fa6';
import { MdFilterList, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdModeEdit, MdSearch } from 'react-icons/md';
import { IoMdSearch } from 'react-icons/io';
import React from 'react';
import { DepartamentoType, UserType } from '@/lib/types/types';

// Definindo a interface para o tipo da categoria
interface Category {
     name: string;
     observation: string;
     total: number;
     notebooks?: {
          name: string;
          finalValue: number;
     }[];
}

interface CategoriasProps {
     departamento: DepartamentoType;
     user: UserType;
     host: UserType | null
}



export default function CategoriaFront({ departamento, user, host }: CategoriasProps) {
     const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

     const categories: Category[] = [
          {
               name: "Notebooks",
               observation: "todas salas",
               total: 375,
               notebooks: [
                    { name: "Galaxy Book 2", finalValue: 90 },
                    { name: "Asus TUF f15", finalValue: 78 },
                    { name: "Acer Aspire 5", finalValue: 72 },
                    { name: "Dell G15", finalValue: 64 },
                    { name: "MacBook Pro M2", finalValue: 50 },
               ]
          },
     ];


     return (
          <>
               <Navbar type='2' user={user} />
               <div className="bg-[#0f0f0f] text-white  flex border-t-2 border-[#2c2c2c] h-[89vh]">
                    <aside className="w-1/6 bg-[#0f0f0f] p-4 flex flex-col px-5 border-r-2 border-[#2c2c2c] h-full">
                         <div className="w-11/12 mx-auto">
                              <div className="mb-4 flex flex-col">
                                   <div className="flex flex-row items-center gap-2">
                                        <div className="bg-pink-500 w-16 h-16 rounded-full mb-2"></div>
                                        <div className="text-left ml-2">
                                             <h2 className="text-lg">{departamento.titulo}</h2>
                                             <p className="text-base text-[#8c8888]">
                                                  Administrador: {host?.email === user.email ? "Você" : host?.email}
                                             </p>
                                        </div>
                                   </div>
                                   <p className="text-xs mt-1 w-full text-[#8c8888]">{departamento.descricao}</p>
                              </div>
                              <div className="flex flex-col gap-2 mt-8">
                                   <button className="font-bold flex items-center gap-2 justify-center bg-[#f6cf45] hover:bg-transparent hover:text-[#f6cf45] transition-all duration-300 hover:border-[#f6cf45] hover:border  text-black py-2 relative px-4 mb-2 rounded-full w-11/12 mx-auto"><FaPlus className="absolute left-6 text-2xl" /> Criar categoria</button>
                                   <button className="font-bold flex items-center gap-2 justify-center bg-transparent border-[#f6cf45] hover:bg-[#f6cf45] hover:text-[#000] transition-all duration-300 relative border rounded-full text-[#f6cf45] py-2 px-4 mb-2 w-11/12 mx-auto"><FaGear className="absolute left-6 text-2xl" /> Configurações</button>
                                   <button className="font-bold flex items-center gap-2 justify-center bg-transparent border-[#f6cf45] hover:bg-[#f6cf45] hover:text-[#000] transition-all duration-300 relative border rounded-full text-[#f6cf45] py-2 px-4 mb-2 w-11/12 mx-auto"><FaShare className="absolute left-6 text-2xl" /> Compartilhar</button>
                              </div>
                         </div>
                         <div className="mt-auto flex flex-row items-end gap-1">
                              <div className="flex -space-y-6 flex-col items-center">
                                   <div className="bg-green-500 w-10 h-10 rounded-full border-2 border-white"></div>
                                   <div className="bg-[#6d5632] w-10 h-10 rounded-full border-2 border-white -mt-2"></div>
                                   <div className="bg-purple-500 w-10 h-10 rounded-full border-2 border-white -mt-2"></div>
                              </div>
                              <div className="flex flex-col ml-2">
                                   <p className="text-gray-50 text-sm">n° online</p>
                                   <p className="text-gray-400 text-sm">n° participantes</p>
                              </div>
                         </div>
                    </aside>

                    <main className="flex-1 flex flex-col  overflow-hidden h-full">
                         <section className="flex gap-4 h-full overflow-y-auto px-4">
                              <div className="w-2/3 flex flex-col mt-4">

                                   <div className="rounded-lg bg-[#0f0f0f] border border-[#2c2c2c30] p-4 flex-grow overflow-y-auto">
                                        <table className="w-full">
                                             <thead>
                                                  <tr>
                                                       <th className="text-left text-[#8c888800]">{'..'}</th>
                                                       <th className="text-left text-[#8c8888]">Nome</th>
                                                       <th className="text-left text-[#8c8888]">Observação</th>
                                                       <th className="text-left text-[#8c8888]">Total de Cadastros</th>
                                                       <th className="text-left text-[#8c888800]">{'..'}</th>
                                                  </tr>
                                             </thead>
                                             <tbody>
                                                  <tr>
                                                       <td colSpan={20} className="h-4"></td>
                                                  </tr>
                                             </tbody>
                                             <tbody>
                                                  {categories.map((category, index) => (
                                                       <tr
                                                            key={index}
                                                            className={`hover:bg-[#2c2c2c] cursor-pointer text-xl ${index !== categories.length - 1 ? 'border-b-2 border-[#2c2c2c]' : ''}`}
                                                            onClick={() => setSelectedCategory(category)}
                                                       >
                                                            <td><div className='bg-[#d9d9d9] w-8 h-8 rounded-sm'></div></td>
                                                            <td className="py-4 font-medium">{category.name}</td>
                                                            <td className="py-4 text-[#b4b4b4]">{category.observation}</td>
                                                            <td className="py-4 text-[#b4b4b4]">{category.total}</td>
                                                            <td className="py-4 underline italic font-semibold flex items-center underline-offset-4">ver mais <MdKeyboardArrowRight className='text-2xl' /></td>
                                                       </tr>
                                                  ))}
                                             </tbody>
                                        </table>
                                   </div>
                              </div>
                              {selectedCategory ? (

                                   <div className="w-3/5 px-4 bg-[#0f0f0f] flex flex-col h-full border-l-2 border-[#2c2c2c]">
                                        <div className="flex items-center justify-between my-4">
                                             <div className='flex flex-col'>

                                                  <div className="flex items-center text-sm text-[#8c8888] cursor-pointer" onClick={() => setSelectedCategory(null)}>
                                                       <MdKeyboardArrowLeft className="text-xl" /> Mostrar mais
                                                  </div>
                                                  <h2 className=" font-medium text-base ml-4 text-white">
                                                       {selectedCategory.name}
                                                  </h2>
                                             </div>
                                             {selectedCategory && (
                                                  <div className="flex items-center gap-4">
                                                       <div className="flex gap-2">
                                                            <button className="p-2 text-gray-400 bg-[#2c2c2c] rounded-lg">
                                                                 <MdSearch className="text-xl" />
                                                            </button>
                                                            <button className="p-2 text-gray-400 bg-[#2c2c2c] rounded-lg">
                                                                 <MdFilterList className="text-xl" />
                                                            </button>
                                                       </div>
                                                       <button className="bg-[#F6CF45] text-black py-2 px-4 rounded-lg font-medium flex items-center gap-2">
                                                            <FaPlus /> Novo patrimônio
                                                       </button>
                                                  </div>
                                             )}
                                        </div>

                                        {selectedCategory ? (
                                             <div className="bg-[#2c2c2c] rounded-lg p-4 flex-grow overflow-y-auto">

                                                  {selectedCategory.notebooks?.map((notebook, index) => (
                                                       <div
                                                            key={index}
                                                            className="flex items-center justify-between py-4 px-2 border-b border-[#3c3c3c] last:border-0"
                                                       >
                                                            <div className="flex items-center gap-3">
                                                                 <button className="text-transparent hover:text-white">:</button>
                                                                 <span className="text-white">{notebook.name}</span>
                                                            </div>
                                                            <div className="flex items-center gap-4">
                                                                 <span className={`text-${notebook.finalValue >= 70 ? 'red' : 'white'}-500`}>
                                                                      {notebook.finalValue}% do valor final
                                                                 </span>
                                                                 <button className="text-[#fff] italic underline flex items-center gap-1">
                                                                      ver mais <MdKeyboardArrowRight />
                                                                 </button>
                                                            </div>
                                                       </div>
                                                  ))}
                                             </div>
                                        ) : (
                                             <div className="flex items-center justify-center h-full">
                                                  <h3 className="text-2xl text-[#8c8888] font-medium">
                                                       Selecione alguma categoria
                                                  </h3>
                                             </div>
                                        )}
                                   </div>
                              ) : (
                                   <>
                                        <div className="w-1/3 px-4 bg-[#0f0f0f] flex flex-col h-full border-l-2 border-[#2c2c2c]">

                                             <div className="flex items-center justify-center h-full">
                                                  <h3 className="text-2xl text-[#8c8888] font-medium">
                                                       Selecione alguma categoria
                                                  </h3>
                                             </div>
                                        </div>
                                   </>
                              )}
                         </section>
                    </main>
               </div>

          </>
     );
}
