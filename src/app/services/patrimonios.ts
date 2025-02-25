"use server"

import { query } from '@/lib/mysql';
import { PatrimonioType } from "@/lib/types/types";
import { redirect } from 'next/navigation';

export async function getPatrimoniosByCategoria(categoriaId: number): Promise<PatrimonioType[]> {
     try {
          if (!categoriaId) {
               throw new Error("ID da categoria é necessário.");
          }

          const patrimonios = await query(`
            SELECT 
                p.*,
                DATE_FORMAT(p.data_aquisicao, '%Y-%m-%d') as data_aquisicao,
                DATE_FORMAT(p.created_at, '%Y-%m-%d') as created_at
            FROM patrimonios AS p
            WHERE p.id_categoria = ?
            ORDER BY p.nome ASC
        `, [categoriaId]);

          return patrimonios as PatrimonioType[];
     } catch (error) {
          console.error("Erro ao buscar patrimônios da categoria:", error);
          return [];
     }
}

export async function getPatrimonioById(patrimonioId: number): Promise<PatrimonioType | null> {
     try {
          if (!patrimonioId) {
               throw new Error("ID do patrimônio é necessário.");
          }

          const patrimonios = await query(`
            SELECT 
                p.*,
                DATE_FORMAT(p.data_aquisicao, '%Y-%m-%d') as data_aquisicao,
                DATE_FORMAT(p.created_at, '%Y-%m-%d') as created_at
            FROM patrimonios AS p
            WHERE p.id = ?
        `, [patrimonioId]);

          const patrimonioArray = patrimonios as PatrimonioType[];
          return patrimonioArray.length > 0 ? patrimonioArray[0] : null;
     } catch (error) {
          console.error("Erro ao buscar patrimônio por ID:", error);
          return null;
     }
}

export async function savePatrimonio(formData: FormData) {
     try {
          const id = +(formData.get('id') as string) || null;
          const id_categoria = +(formData.get('id_categoria') as string);
          const nome = formData.get('nome') as string;
          const descricao = formData.get('descricao') as string || null;
          const valor_inicial = +(formData.get('valor_inicial') as string);
          const valor_atual = +(formData.get('valor_atual') as string);
          const data_aquisicao = formData.get('data_aquisicao') as string;
          const tempo_depreciacao = +(formData.get('tempo_depreciacao') as string);

          if (!id_categoria) {
               throw new Error("ID da categoria é necessário.");
          }

          if (!nome) {
               throw new Error("Nome do patrimônio é necessário.");
          }

          if (valor_inicial <= 0) {
               throw new Error("Valor inicial deve ser maior que zero.");
          }

          if (!data_aquisicao) {
               throw new Error("Data de aquisição é necessária.");
          }

          if (tempo_depreciacao <= 0) {
               throw new Error("Tempo de depreciação deve ser maior que zero.");
          }

          if (!id) {
               // Criação de um novo patrimônio
               await query(`
                INSERT INTO patrimonios (
                    id_categoria, 
                    nome, 
                    descricao, 
                    valor_inicial, 
                    valor_atual, 
                    data_aquisicao, 
                    tempo_depreciacao
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [id_categoria, nome, descricao, valor_inicial, valor_atual, data_aquisicao, tempo_depreciacao]);
          } else {
               // Atualização de um patrimônio existente
               await query(`
                UPDATE patrimonios SET
                    nome = ?,
                    descricao = ?,
                    valor_inicial = ?,
                    valor_atual = ?,
                    data_aquisicao = ?,
                    tempo_depreciacao = ?
                WHERE id = ?
            `, [nome, descricao, valor_inicial, valor_atual, data_aquisicao, tempo_depreciacao, id]);
          }

          // Recuperando o departamentoId da categoria para redirecionamento
          const categorias = await query(`
            SELECT id_departamento FROM categorias WHERE id = ?
        `, [id_categoria]);

          const categoriaArray = categorias as any[];
          if (categoriaArray.length > 0) {
               const departamentoId = categoriaArray[0].id_departamento;
               redirect(`/categorias/${departamentoId}?categoria=${id_categoria}`);
          } else {
               throw new Error("Categoria não encontrada.");
          }
     } catch (error) {
          console.error("Erro ao salvar patrimônio:", error);
          throw error;
     }
}

export async function removePatrimonio(patrimonioId: number, categoriaId: number) {
     try {
          if (!patrimonioId) {
               throw new Error("ID do patrimônio é necessário para deletar.");
          }

          // Recuperando o departamentoId da categoria para redirecionamento
          const categorias = await query(`
            SELECT id_departamento FROM categorias WHERE id = ?
        `, [categoriaId]);

          await query('DELETE FROM patrimonios WHERE id = ?', [patrimonioId]);

          const categoriaArray = categorias as any[];
          if (categoriaArray.length > 0) {
               const departamentoId = categoriaArray[0].id_departamento;
               redirect(`/categorias/${departamentoId}?categoria=${categoriaId}`);
          } else {
               throw new Error("Categoria não encontrada.");
          }
     } catch (error) {
          console.error("Erro ao remover patrimônio:", error);
          throw error;
     }
}

export async function calcularDepreciacao(patrimonioId: number) {
     try {
          if (!patrimonioId) {
               throw new Error("ID do patrimônio é necessário.");
          }

          const patrimonios = await query(`
            SELECT 
                id,
                valor_inicial,
                data_aquisicao,
                tempo_depreciacao
            FROM patrimonios
            WHERE id = ?
        `, [patrimonioId]);

          const patrimonioArray = patrimonios as any[];
          if (patrimonioArray.length === 0) {
               throw new Error("Patrimônio não encontrado.");
          }

          const patrimonio = patrimonioArray[0];

          // Cálculo da depreciação linear
          const dataAquisicao = new Date(patrimonio.data_aquisicao);
          const dataAtual = new Date();

          // Diferença em milissegundos
          const diferenca = dataAtual.getTime() - dataAquisicao.getTime();

          // Diferença em meses
          const mesesDecorridos = Math.floor(diferenca / (1000 * 60 * 60 * 24 * 30.44));

          // Cálculo do valor depreciado por mês
          const depreciacaoMensal = patrimonio.valor_inicial / patrimonio.tempo_depreciacao;

          // Cálculo do valor atual
          let valorAtual = patrimonio.valor_inicial - (depreciacaoMensal * mesesDecorridos);

          // Não permitir valor negativo
          valorAtual = Math.max(0, valorAtual);

          // Atualizar o valor atual no banco de dados
          await query(`
            UPDATE patrimonios
            SET valor_atual = ?
            WHERE id = ?
        `, [valorAtual, patrimonioId]);

          return valorAtual;
     } catch (error) {
          console.error("Erro ao calcular depreciação:", error);
          throw error;
     }
}

export async function calcularDepreciacaoTodos() {
     try {
          // Obter todos os patrimônios
          const patrimonios = await query(`
            SELECT 
                id,
                valor_inicial,
                data_aquisicao,
                tempo_depreciacao
            FROM patrimonios
        `);

          const patrimonioArray = patrimonios as any[];
          const atualizacoes = [];

          for (const patrimonio of patrimonioArray) {
               // Cálculo da depreciação linear
               const dataAquisicao = new Date(patrimonio.data_aquisicao);
               const dataAtual = new Date();

               // Diferença em milissegundos
               const diferenca = dataAtual.getTime() - dataAquisicao.getTime();

               // Diferença em meses
               const mesesDecorridos = Math.floor(diferenca / (1000 * 60 * 60 * 24 * 30.44));

               // Cálculo do valor depreciado por mês
               const depreciacaoMensal = patrimonio.valor_inicial / patrimonio.tempo_depreciacao;

               // Cálculo do valor atual
               let valorAtual = patrimonio.valor_inicial - (depreciacaoMensal * mesesDecorridos);

               // Não permitir valor negativo
               valorAtual = Math.max(0, valorAtual);

               atualizacoes.push(query(`
                UPDATE patrimonios
                SET valor_atual = ?
                WHERE id = ?
            `, [valorAtual, patrimonio.id]));
          }

          await Promise.all(atualizacoes);
          return true;
     } catch (error) {
          console.error("Erro ao calcular depreciação de todos patrimônios:", error);
          throw error;
     }
}

export async function getResumoPatrimonios(departamentoId: number) {
     try {
          if (!departamentoId) {
               throw new Error("ID do departamento é necessário.");
          }

          const resumo = await query(`
            SELECT 
                COUNT(p.id) as total_patrimonios,
                SUM(p.valor_inicial) as valor_total_inicial,
                SUM(p.valor_atual) as valor_total_atual
            FROM patrimonios AS p
            JOIN categorias AS c ON p.id_categoria = c.id
            WHERE c.id_departamento = ?
        `, [departamentoId]);

          return (resumo as any[])[0];
     } catch (error) {
          console.error("Erro ao obter resumo de patrimônios:", error);
          return {
               total_patrimonios: 0,
               valor_total_inicial: 0,
               valor_total_atual: 0
          };
     }
}