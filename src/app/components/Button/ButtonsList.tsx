"use client";
import { ElementType, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { ButtonComponent } from "./ButtonComponents";
import { RiPencilFill } from "react-icons/ri";

export function ButtonCriarCategoria(tipo: number) {
  const [openModal, setOpenModal] = useState(false);
  const handleClick = () => {
    setOpenModal(true);
  };
  return (
    
    <>
    
      <ButtonComponent.Root
        onClick={handleClick}
        className="bg-[#f6cf45] flex rounded-[61px] text-black w-44 h-9 text-center justify-evenly items-center">
        <ButtonComponent.Icon icon={FaPlus} />
        <ButtonComponent.Content text="Criar Categoria" className="text-xs"/>
      </ButtonComponent.Root>
    </>
  );
}

export function ButtonEditarSala() {
  return (
    <ButtonComponent.Root
      onClick={() => alert("editado")}
       className="border-[#f6cf45]  border-solid border-2 flex rounded-[61px] text-[#f6cf45] w-44 h-9 text-center justify-evenly items-center"
    >
      <ButtonComponent.Icon icon={RiPencilFill} />
      <ButtonComponent.Content text="Editar sala" className="text-xs"/>
    </ButtonComponent.Root>
  );
}



