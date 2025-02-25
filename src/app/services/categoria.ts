"use server"

import { query } from '@/lib/mysql';
import { CategoriaType } from "@/lib/types/types";
import { redirect } from 'next/navigation';

export async function getCategoriasByDepartamento(departamentoId: number): Promise<CategoriaType[]> {
     try {
          if (!departamentoId) {
               throw new Error("ID do departamento é necessário.");
          }

          const categorias = await query(`
            SELECT c.*, DATE_FORMAT(c.created_at, '%Y-%m-%d') as created_at
            FROM categorias AS c
            WHERE c.id_departamento = ?
            ORDER BY c.nome ASC
        `, [departamentoId]);

          return categorias as CategoriaType[];
     } catch (error) {
          console.error("Erro ao buscar categorias do departamento:", error);
          return [];
     }
}

export async function getCategoriaById(categoriaId: number): Promise<CategoriaType | null> {
     try {
          if (!categoriaId) {
               throw new Error("ID da categoria é necessário.");
          }

          const categorias = await query(`
            SELECT c.*, DATE_FORMAT(c.created_at, '%Y-%m-%d') as created_at
            FROM categorias AS c
            WHERE c.id = ?
        `, [categoriaId]);

          const categoriaArray = categorias as CategoriaType[];
          return categoriaArray.length > 0 ? categoriaArray[0] : null;
     } catch (error) {
          console.error("Erro ao buscar categoria por ID:", error);
          return null;
     }
}

export async function saveCategoria(formData: FormData) {
     try {
          const id = +(formData.get('id') as string) || null;
          const id_departamento = +(formData.get('id_departamento') as string);
          const nome = formData.get('nome') as string;
          const descricao = formData.get('descricao') as string || null;

          if (!id_departamento) {
               throw new Error("ID do departamento é necessário.");
          }

          if (!nome) {
               throw new Error("Nome da categoria é necessário.");
          }

          if (!id) {
               // Criação de uma nova categoria
               await query(`
                INSERT INTO categorias (id_departamento, nome, descricao)
                VALUES (?, ?, ?)
            `, [id_departamento, nome, descricao]);
          } else {
               // Atualização de uma categoria existente
               await query(`
                UPDATE categorias SET
                    nome = ?,
                    descricao = ?
                WHERE id = ?
            `, [nome, descricao, id]);
          }

          redirect(`/categorias/${id_departamento}`);
     } catch (error) {
          console.error("Erro ao salvar categoria:", error);
          throw error;
     }
}

export async function removeCategoria(categoriaId: number, departamentoId: number) {
     try {
          if (!categoriaId) {
               throw new Error("ID da categoria é necessário para deletar.");
          }

          await query('DELETE FROM categorias WHERE id = ?', [categoriaId]);
          redirect(`/categorias/${departamentoId}`);
     } catch (error) {
          console.error("Erro ao remover categoria:", error);
          throw error;
     }
}

export async function getCategoriasComTotalPatrimonios(departamentoId: number): Promise<any[]> {
     try {
          if (!departamentoId) {
               throw new Error("ID do departamento é necessário.");
          }

          const categorias = await query(`
            SELECT 
                c.id,
                c.nome,
                c.descricao,
                DATE_FORMAT(c.created_at, '%Y-%m-%d') as created_at,
                COUNT(p.id) as total_patrimonios,
                SUM(p.valor_atual) as valor_total
            FROM categorias AS c
            LEFT JOIN patrimonios AS p ON c.id = p.id_categoria
            WHERE c.id_departamento = ?
            GROUP BY c.id
            ORDER BY c.nome ASC
        `, [departamentoId]);

          return categorias as any[];
     } catch (error) {
          console.error("Erro ao buscar categorias com total de patrimônios:", error);
          return [];
     }
}