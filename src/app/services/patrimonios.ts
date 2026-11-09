"use server"

import { demo, isDemoSession, DEMO_READ_ONLY } from "@/lib/demo";
import { query } from '@/lib/mysql';
import { PatrimonioType } from "@/lib/types/types";
import { requireCategoriaRole, requireDepartamentoRole, requirePatrimonioRole } from "@/lib/authz";
import { calcularValorDepreciado, sqlValorAtual } from "@/lib/depreciacao";

const VALOR_MAXIMO = 99999999.99;

export async function getPatrimoniosByCategoria(categoriaId: number): Promise<PatrimonioType[]> {
    if (await isDemoSession()) return demo.assets(categoriaId);
     try {
          if (!categoriaId) {
               throw new Error("ID da categoria é necessário.");
          }

          await requireCategoriaRole(categoriaId);

          const patrimonios = await query(`
            SELECT
                p.*,
                ${sqlValorAtual('p')} as valor_atual,
                DATE_FORMAT(p.data_aquisicao, '%Y-%m-%d') as data_aquisicao,
                DATE_FORMAT(p.created_at, '%Y-%m-%d') as created_at
            FROM patrimonios AS p
            WHERE p.id_categoria = ? AND p.status != 'deletado'
            ORDER BY p.nome ASC
        `, [categoriaId]);

          return patrimonios as PatrimonioType[];
     } catch (error) {
          console.error("Erro ao buscar patrimônios da categoria:", error);
          return [];
     }
}

export async function getPatrimonioById(patrimonioId: number): Promise<PatrimonioType | null> {
    if (await isDemoSession()) return demo.asset(patrimonioId);
     try {
          if (!patrimonioId) {
               throw new Error("ID do patrimônio é necessário.");
          }

          await requirePatrimonioRole(patrimonioId);

          const patrimonios = await query(`
            SELECT
                p.*,
                ${sqlValorAtual('p')} as valor_atual,
                DATE_FORMAT(p.data_aquisicao, '%Y-%m-%d') as data_aquisicao,
                DATE_FORMAT(p.created_at, '%Y-%m-%d') as created_at
            FROM patrimonios AS p
            WHERE p.id = ? AND p.status != 'deletado'
        `, [patrimonioId]);

          const patrimonioArray = patrimonios as PatrimonioType[];
          return patrimonioArray.length > 0 ? patrimonioArray[0] : null;
     } catch (error) {
          console.error("Erro ao buscar patrimônio por ID:", error);
          return null;
     }
}

function hojeISO(): string {
     const hoje = new Date();
     return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;
}

export async function savePatrimonio(formData: FormData): Promise<{ success: boolean; error?: string }> {
    if (await isDemoSession()) return { success: false, error: DEMO_READ_ONLY };
     try {
          const id = +(formData.get('id') as string) || null;
          const id_categoria = +(formData.get('id_categoria') as string) || null;

          const nome = (formData.get('nome') as string || '').trim();
          const descricao = (formData.get('descricao') as string || '').trim() || null;
          const codigo_patrimonio = (formData.get('codigo') as string || '').trim() || null;
          const localizacao = (formData.get('localizacao') as string || '').trim() || null;
          const valor_inicial = Number(formData.get('valor_inicial'));
          const data_aquisicao = (formData.get('data_aquisicao') as string || '').trim();
          const taxa_anual = Number(formData.get('tempo_depreciacao'));

          if (!id && !id_categoria) {
               return { success: false, error: "No category was given." };
          }

          if (!nome) {
               return { success: false, error: "Give the asset a name." };
          }

          if (!Number.isFinite(valor_inicial) || valor_inicial <= 0) {
               return { success: false, error: "The purchase price must be greater than zero." };
          }

          if (valor_inicial > VALOR_MAXIMO) {
               return { success: false, error: "The purchase price is above the allowed maximum." };
          }

          if (!/^\d{4}-\d{2}-\d{2}$/.test(data_aquisicao)) {
               return { success: false, error: "Add the purchase date." };
          }

          if (data_aquisicao > hojeISO()) {
               return { success: false, error: "The purchase date can't be in the future." };
          }

          if (!Number.isFinite(taxa_anual) || taxa_anual <= 0 || taxa_anual > 100) {
               return { success: false, error: "The depreciation rate must be between 0.01% and 100% per year." };
          }

          const valor_atual = calcularValorDepreciado(valor_inicial, taxa_anual, data_aquisicao);

          if (!id) {
               await requireCategoriaRole(id_categoria as number);

               await query(`
                INSERT INTO patrimonios (
                    id_categoria,
                    nome,
                    descricao,
                    codigo_patrimonio,
                    localizacao,
                    valor_inicial,
                    valor_atual,
                    data_aquisicao,
                    tempo_depreciacao,
                    status
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'ativo')
            `, [id_categoria, nome, descricao, codigo_patrimonio, localizacao, valor_inicial, valor_atual, data_aquisicao, taxa_anual]);
          } else {
               await requirePatrimonioRole(id);

               await query(`
                UPDATE patrimonios SET
                    nome = ?,
                    descricao = ?,
                    codigo_patrimonio = ?,
                    localizacao = ?,
                    valor_inicial = ?,
                    valor_atual = ?,
                    data_aquisicao = ?,
                    tempo_depreciacao = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ? AND status != 'deletado'
            `, [nome, descricao, codigo_patrimonio, localizacao, valor_inicial, valor_atual, data_aquisicao, taxa_anual, id]);
          }

          return { success: true };
     } catch (error) {
          console.error("Erro ao salvar patrimônio:", error);
          return { success: false, error: "Couldn't save the asset." };
     }
}

export async function removePatrimonio(patrimonioId: number) {
    if (await isDemoSession()) throw new Error(DEMO_READ_ONLY);
     try {
          if (!patrimonioId) {
               throw new Error("ID do patrimônio é necessário para deletar.");
          }

          await requirePatrimonioRole(patrimonioId);

          await query(`
            UPDATE patrimonios
            SET status = 'deletado', updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `, [patrimonioId]);
     } catch (error) {
          console.error("Erro ao remover patrimônio:", error);
          throw error;
     }
}

export async function getResumoPatrimonios(departamentoId: number) {
    if (await isDemoSession()) return demo.summary(departamentoId);
     try {
          if (!departamentoId) {
               throw new Error("ID do departamento é necessário.");
          }

          await requireDepartamentoRole(departamentoId);

          const resumo = await query(`
            SELECT
                COUNT(p.id) as total_patrimonios,
                COALESCE(SUM(p.valor_inicial), 0) as valor_total_inicial,
                COALESCE(SUM(${sqlValorAtual('p')}), 0) as valor_total_atual
            FROM patrimonios AS p
            JOIN categorias AS c ON p.id_categoria = c.id
            WHERE c.id_departamento = ? AND p.status != 'deletado' AND c.status != 'deletado'
        `, [departamentoId]);

          const resumoArray = resumo as { total_patrimonios: number; valor_total_inicial: number; valor_total_atual: number }[];
          return resumoArray[0];
     } catch (error) {
          console.error("Erro ao obter resumo de patrimônios:", error);
          return {
               total_patrimonios: 0,
               valor_total_inicial: 0,
               valor_total_atual: 0
          };
     }
}
