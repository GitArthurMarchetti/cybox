'use client'

import { useState } from 'react';
import Navbar from '../components/Navigation/navbar';
import { FaFilter, FaPlus, FaShare } from 'react-icons/fa6';
import { MdFilterList, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdModeEdit, MdSearch } from 'react-icons/md';
import { IoMdSearch } from 'react-icons/io';

// Definindo a interface para o tipo da categoria
interface Category {
     name: string;
     observation: string;
     total: number;
     acquisitionDate?: string;
     location?: string;
     initialPrice?: string;
     currentValue?: string;
     totalExpenses?: string;
}


export default function Categorias() {
     const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

     // Definindo o array de categorias com o tipo Category[]
     const categories: Category[] = [
          { name: "Notebooks", observation: "todas salas", total: 375, acquisitionDate: "20/07/2010", location: "Lab 12", initialPrice: "R$ 3.000,00", currentValue: "R$ 600,00", totalExpenses: "R$ 45.600,00" },
          { name: "Chromes", observation: "bloco 4", total: 459, acquisitionDate: "15/03/2015", location: "Bloco B", initialPrice: "R$ 2.500,00", currentValue: "R$ 500,00", totalExpenses: "R$ 30.000,00" },
          { name: "Carregadores", observation: "todas salas", total: 1050, acquisitionDate: "10/01/2012", location: "Armazém", initialPrice: "R$ 150,00", currentValue: "R$ 50,00", totalExpenses: "R$ 5.250,00" },
     ];

     return (
          <>
               <Navbar type='2' />
               <div className="bg-[#0f0f0f] text-white  flex border-t-2 border-[#2c2c2c] h-[82vh]">
                    <aside className="w-1/6 bg-[#0f0f0f] p-4 flex flex-col px-5 border-r-2 border-[#2c2c2c] h-full">
                         <div className="w-11/12 mx-auto">
                              <div className="mb-4 flex flex-col">
                                   <div className="flex flex-row items-center gap-2">
                                        <div className="bg-pink-500 w-16 h-16 rounded-full mb-2"></div>
                                        <div className="text-left ml-2">
                                             <h2 className="text-lg">Eletrônicos</h2>
                                             <p className="text-base text-[#8c8888]">Administrador</p>
                                        </div>
                                   </div>
                                   <p className="text-xs mt-1 w-full text-[#8c8888]">Departamento de gerenciamento de eletrônicos do Senai Floripa</p>
                              </div>
                              <div className="flex flex-col gap-2 mt-8">
                                   <button className="font-bold flex items-center gap-2 justify-center bg-[#f6cf45] text-black py-2 relative px-4 mb-2 rounded-full w-11/12 mx-auto"><FaPlus className="absolute left-6 text-2xl" /> Criar categoria</button>
                                   <button className="font-bold flex items-center gap-2 justify-center bg-transparent border-[#f6cf45] relative border rounded-full text-[#f6cf45] py-2 px-4 mb-2 w-11/12 mx-auto"><MdModeEdit className="absolute left-6 text-2xl" /> Editar sala</button>
                                   <button className="font-bold flex items-center gap-2 justify-center bg-transparent border-[#f6cf45] relative border rounded-full text-[#f6cf45] py-2 px-4 mb-2 w-11/12 mx-auto"><FaShare className="absolute left-6 text-2xl" /> Compartilhar</button>
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
                                   <div className="flex mb-4">
                                        <button className="flex items-center text-white mr-4">
                                             <FaFilter className="text-xl text-[#8C8888]" />
                                        </button>
                                        <label className="flex items-center bg-[#2C2C2C] w-full px-4 rounded-full">
                                             <input
                                                  type="text"
                                                  placeholder="Pesquise por sua categoria"
                                                  className="flex-grow p-3 bg-[#2C2C2C] text-white rounded-lg outline-none placeholder:text-sm"
                                             />
                                             <IoMdSearch className="text-[#8C8888] text-xl" />
                                        </label>
                                   </div>
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

                              <div className="w-3/5 px-4 bg-[#0f0f0f] flex flex-col h-full border-l-2 border-[#2c2c2c]">
                                   <div className="flex items-center justify-between my-4">
                                        <h2 className="text-sm text-[#8c8888] flex items-center">
                                             <MdKeyboardArrowLeft className="text-xl" /> Mostrar mais
                                        </h2>
                                        <h3 className="text-lg text-white font-semibold">{selectedCategory ? selectedCategory.name : "Selecione uma categoria"}</h3>
                                        <div className="flex gap-2">
                                             <button className="p-2 text-gray-400 bg-[#2c2c2c] rounded-md">
                                                  <MdSearch className="text-lg" />
                                             </button>
                                             <button className="p-2 text-gray-400 bg-[#2c2c2c] rounded-md">
                                                  <MdFilterList className="text-lg" />
                                             </button>
                                             <button className="bg-yellow-500 text-black py-2 px-4 rounded-md font-semibold">
                                                  + Novo patrimônio
                                             </button>
                                        </div>
                                   </div>

                                   {selectedCategory ? (
                                        <div className="bg-[#2c2c2c] rounded-lg p-4 flex-grow overflow-y-auto">
                                             <p className="text-gray-300 text-xl">Percentual do valor final: <span className="text-red-500 font-semibold">{selectedCategory.total}%</span></p>
                                        </div>
                                   ) : (
                                        <p className="text-gray-400 text-center mt-4">Selecione uma categoria para ver os detalhes</p>
                                   )}
                              </div>

                         </section>
                    </main>
               </div>

          </>
     );
}
