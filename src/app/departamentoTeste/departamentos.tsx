"use client"
import { useState } from "react";
import DepartamentoType, { removeDepartamento, saveDepartamento } from "../services/departamento";

type Props = {
    departamentos: DepartamentoType[];
    departamento: DepartamentoType;
    userId: string | undefined;  // userId será tratado como string
};

export default function Departamento({ departamentos, departamento: novoDepartamento, userId }: Props) {
    const [departamento, setDepartamento] = useState<DepartamentoType>(novoDepartamento);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        // Certifique-se de que o userId está presente
        if (!userId) {
            console.error('O ID do usuário não está disponível.');
            return;
        }

        try {
            // Passe o userId como string (sem conversão para número)
            await saveDepartamento(formData, userId);  
        } catch (error) {
            console.error('Erro ao salvar o departamento:', error);
        }
    };

    return (
        <>
            {departamentos.map((t) => (
                <div
                    key={t.id_departamentos}
                    onClick={() => setDepartamento(t)}
                    className={`border-2 py-3 px-5 rounded-xl shadow-black shadow-md hover:border-violet-600 transition-all flex justify-between text-center items-center`}
                >
                    <h1>{t.id_departamentos}</h1>
                    <h2>{t.titulo}</h2>
                    <h2>{t.maximoMembros}</h2>
                    <h2>{t.totalMembros}</h2>
                    <h3 className="text-pink-700">{userId}</h3>
                    <div onClick={() => removeDepartamento(t)} className="hover:text-red-600 transition-all">Apagar</div>
                </div>
            ))}

            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="hidden"
                    name="id_departamentos"
                    value={`${departamento?.id_departamentos}`}
                    className={`${departamento.id_departamentos ? 'border-2 border-yellow-500' : 'border-2 border-blue-500'}`}
                />
                <input
                    type="text"
                    name="titulo"
                    className="w-11/12 p-2 text-black rounded-md"
                    placeholder="Nova Departamento..."
                    value={departamento.titulo}
                    onChange={(e) => setDepartamento({ ...departamento, titulo: e.target.value })}
                />

                <button className={`w-1/12 bg-blue-500 rounded-md`}>
                    {departamento.id_departamentos ? 'Salvar' : 'Adicionar'}
                </button>
                {departamento.id_departamentos && (
                    <button
                        onClick={() => setDepartamento({ ...novoDepartamento })}
                        className="bg-red-500 p-3 py-2 rounded-md hover:bg-red-800 transition-all"
                    >
                        Cancelar
                    </button>
                )}
            </form>
        </>
    );
}
