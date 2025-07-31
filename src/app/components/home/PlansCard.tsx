interface plansCardProps {
     name: string
     description: string
     price: number
     colorButton: string
     advantages: string[]
}


export function PlansCard({ name, description, price, colorButton, advantages }: plansCardProps) {
     return (
          <>
               <div className="bg-[#1E1E1E] rounded-2xl p-8 max-w-sm w-full text-center">
                    <h3 className="text-xl font-semibold mb-3 text-white">{name}</h3>
                    <p className="text-[#b4b4b4] text-sm mb-6 leading-relaxed">
                         {description}
                    </p>
                    <div className="mb-8">
                         <div className="flex items-baseline flex-col justify-center gap-1 mb-2 ">
                              <div className=" flex justify-center mx-auto ">
                                   <div className="flex">
                                        <span className="text-[#b4b4b4] text-lg mr-2">R$</span>
                                   </div>
                                   <span className="text-6xl  font-bold text-white">{price.toLocaleString('pt-BR', {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0
                                   })}</span>
                                   <div className=" flex justify-end items-end">
                                        <span className="text-[#b4b4b4] text-sm ml-2">mensal</span>
                                   </div>
                              </div>
                         </div>
                    </div>
                    <div className="mb-8">
                         <button
                              style={{ backgroundColor: colorButton }}
                              className="text-black font-medium py-3 px-6 rounded-lg w-full hover:bg-gray-300 transition-colors">
                              Comece já
                         </button>
                    </div>
                    <ol className="text-left space-y-3 text-sm">
                         {advantages.map((advantage, index) => (
                              <li key={index} className="flex items-start">
                                   <span className="text-[#b4b4b4] mr-2">•</span>
                                   <span className="text-[#b4b4b4]">{advantage}</span>
                              </li>
                         ))}
                    </ol>
               </div>

          </>
     )
}