import Image from "next/image";
import { FaInstagram, FaLinkedin } from "react-icons/fa6";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";
import logo from "../../../../public/logo-completa-branca.png"

export function HomeFooter() {
     return (
          <footer id="Contato" className="w-full bg-[#2E2E2E] rounded-t-[120px] pt-20 pb-10">
               <div className="w-10/12 mx-auto">
                    <div className="grid grid-cols-4 gap-8 mb-12">
                         <div className="col-span-1">
                              <Image src={logo} alt="CyBox Logo" width={100} className="mb-4" />
                              <p className="text-gray-400 text-sm">
                                   Gestão Estratégica de Ativos: Monitorando, Avaliando e Otimizando Seu Patrimônio Empresarial
                              </p>
                              <p className="text-[#F6CF45] text-sm mt-2 font-medium">
                                   Pensando dentro e fora da caixa
                              </p>
                         </div>

                         <div className="col-span-1">
                              <h3 className="text-white font-semibold text-lg mb-4">Links Úteis</h3>
                              <ul className="space-y-2">
                                   <li><a href="#" className="text-gray-400 hover:text-[#F6CF45] transition-colors text-sm">Home</a></li>
                                   <li><a href="#" className="text-gray-400 hover:text-[#F6CF45] transition-colors text-sm">Planos</a></li>
                                   <li><a href="#" className="text-gray-400 hover:text-[#F6CF45] transition-colors text-sm">Sobre nós</a></li>
                                   <li><a href="#" className="text-gray-400 hover:text-[#F6CF45] transition-colors text-sm">Contato</a></li>
                                   <li><a href="#" className="text-gray-400 hover:text-[#F6CF45] transition-colors text-sm">Política de Privacidade</a></li>
                                   <li><a href="#" className="text-gray-400 hover:text-[#F6CF45] transition-colors text-sm">Termos de Uso</a></li>
                              </ul>
                         </div>

                         <div className="col-span-1">
                              <h3 className="text-white font-semibold text-lg mb-4">Nossos Serviços</h3>
                              <ul className="space-y-2">
                                   <li className="text-gray-400 text-sm">Cálculo de Depreciação</li>
                                   <li className="text-gray-400 text-sm">Gestão de Ativos</li>
                                   <li className="text-gray-400 text-sm">Análise LCC</li>
                                   <li className="text-gray-400 text-sm">Relatórios em Tempo Real</li>
                              </ul>
                         </div>

                         <div className="col-span-1">
                              <h3 className="text-white font-semibold text-lg mb-4">Contato</h3>
                              <div className="space-y-3">
                                   <div className="flex items-center gap-3">
                                        <MdEmail className="text-[#F6CF45]" size={20} />
                                        <a href="mailto:contato@cybox.com.br" className="text-gray-400 hover:text-[#F6CF45] transition-colors text-sm">
                                             contato@cybox.com.br
                                        </a>
                                   </div>
                                   <div className="flex items-center gap-3">
                                        <MdPhone className="text-[#F6CF45]" size={20} />
                                        <a href="tel:+551140028922" className="text-gray-400 hover:text-[#F6CF45] transition-colors text-sm">
                                             (48) 99999-9999
                                        </a>
                                   </div>
                                   <div className="flex items-center gap-3">
                                        <MdLocationOn className="text-[#F6CF45]" size={20} />
                                        <p className="text-gray-400 text-sm">
                                             Florianópolis, SC - Brasil
                                        </p>
                                   </div>
                              </div>

                              <div className="mt-6">
                                   <h4 className="text-white font-medium mb-3">Siga-nos</h4>
                                   <div className="flex gap-4">
                                        <a href="#" className="text-gray-400 hover:text-[#F6CF45] transition-colors">
                                             <FaLinkedin size={24} />
                                        </a>
                                        <a href="#" className="text-gray-400 hover:text-[#F6CF45] transition-colors">
                                             <FaInstagram size={24} />
                                        </a>
                                        {/* <a href="#" className="text-gray-400 hover:text-[#F6CF45] transition-colors">
                                             <FaFacebook size={24} />
                                        </a>
                                        <a href="#" className="text-gray-400 hover:text-[#F6CF45] transition-colors">
                                             <FaTwitter size={24} />
                                        </a> */}
                                   </div>
                              </div>
                         </div>
                    </div>

                    <div className="border-t border-gray-700 pt-8">
                         <div className="flex justify-between items-center">
                              <p className="text-gray-400 text-sm">
                                   © 2024 CyBox. Todos os direitos reservados.
                              </p>

                         </div>
                    </div>
               </div>
          </footer>
     )
}