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
            SELECT c.*, DATE_FORMAT(c.created_at, '%Y-%m-%d') as created_at,
                   pd.categoria as padrao_categoria, pd.taxa_anual_percent
            FROM categorias AS c
            LEFT JOIN padroes_depreciacao AS pd ON c.padrao_depreciacao_id = pd.id
            WHERE c.id_departamento = ? AND c.status != 'deletado'
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
            SELECT c.*, DATE_FORMAT(c.created_at, '%Y-%m-%d') as created_at,
                   pd.categoria as padrao_categoria, pd.taxa_anual_percent
            FROM categorias AS c
            LEFT JOIN padroes_depreciacao AS pd ON c.padrao_depreciacao_id = pd.id
            WHERE c.id = ? AND c.status != 'deletado'
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
          const padrao_depreciacao_str = formData.get('padrao_depreciacao_id') as string;
          const padrao_depreciacao_id = padrao_depreciacao_str && padrao_depreciacao_str !== '' ? +padrao_depreciacao_str : null;

          if (!id_departamento) {
               throw new Error("ID do departamento é necessário.");
          }

          if (!nome) {
               throw new Error("Nome da categoria é necessário.");
          }

          if (!id) {
               // Criação de uma nova categoria
               await query(`
                INSERT INTO categorias (id_departamento, nome, descricao, padrao_depreciacao_id, status)
                VALUES (?, ?, ?, ?, 'ativo')
            `, [id_departamento, nome, descricao, padrao_depreciacao_id]);
          } else {
               // Atualização de uma categoria existente
               await query(`
                UPDATE categorias SET
                    nome = ?,
                    descricao = ?,
                    padrao_depreciacao_id = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ? AND status != 'deletado'
            `, [nome, descricao, padrao_depreciacao_id, id]);
          }

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

          // Soft delete - marcar como deletado ao invés de remover
          await query(`
            UPDATE categorias 
            SET status = 'deletado', updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
          `, [categoriaId]);
          
          // Marcar patrimônios relacionados como deletados também
          await query(`
            UPDATE patrimonios 
            SET status = 'deletado', updated_at = CURRENT_TIMESTAMP 
            WHERE id_categoria = ?
          `, [categoriaId]);
          
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
                c.padrao_depreciacao_id,
                pd.categoria as padrao_categoria,
                pd.taxa_anual_percent,
                DATE_FORMAT(c.created_at, '%Y-%m-%d') as created_at,
                COUNT(CASE WHEN p.status != 'deletado' THEN p.id END) as total_patrimonios,
                SUM(CASE WHEN p.status != 'deletado' THEN p.valor_atual ELSE 0 END) as valor_total
            FROM categorias AS c
            LEFT JOIN patrimonios AS p ON c.id = p.id_categoria
            LEFT JOIN padroes_depreciacao AS pd ON c.padrao_depreciacao_id = pd.id
            WHERE c.id_departamento = ? AND c.status != 'deletado'
            GROUP BY c.id
            ORDER BY c.nome ASC
        `, [departamentoId]);

          return categorias as any[];
     } catch (error) {
          console.error("Erro ao buscar categorias com total de patrimônios:", error);
          return [];
     }
}

export async function getPadroesDepreciacao(): Promise<any[]> {
     try {
          const padroes = await query(`
            SELECT * FROM padroes_depreciacao 
            WHERE ativo = TRUE 
            ORDER BY categoria ASC
          `);

          return padroes as any[];
     } catch (error) {
          console.error("Erro ao buscar padrões de depreciação:", error);
          return [];
     }
}