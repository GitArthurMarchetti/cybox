// scripts/migrate.js
// Migrações idempotentes do banco (pode rodar quantas vezes quiser).
// - users: verificação de email, bloqueio de login, sessões e redefinição de senha.
//   Usuários que já existem são marcados como verificados para não perderem o acesso.
// - patrimonios.tempo_depreciacao: passa a aceitar decimais (taxa anual em %, ex.: 6.67).
const { connect, dbTarget } = require('./db');

const COLUNAS = [
     ['email_verificado_em', 'TIMESTAMP NULL AFTER ultimo_login'],
     ['token_verificacao', 'CHAR(64) NULL AFTER email_verificado_em'],
     ['token_verificacao_expira', 'DATETIME NULL AFTER token_verificacao'],
     ['tentativas_login', 'INT NOT NULL DEFAULT 0 AFTER token_verificacao_expira'],
     ['bloqueado_ate', 'DATETIME NULL AFTER tentativas_login'],
     ['sessao_minima_em', 'DATETIME NULL AFTER bloqueado_ate'],
     ['token_redefinicao', 'CHAR(64) NULL AFTER sessao_minima_em'],
     ['token_redefinicao_expira', 'DATETIME NULL AFTER token_redefinicao'],
];

async function migrate() {
     let connection;

     try {
          const { host, port, database } = dbTarget();
          console.log(`🔍 Conectando a ${database} em ${host}:${port}...`);

          connection = await connect();

          let adicionouVerificacao = false;

          for (const [nome, definicao] of COLUNAS) {
               const [columns] = await connection.query('SHOW COLUMNS FROM users LIKE ?', [nome]);

               if (columns.length > 0) {
                    console.log(`ℹ️  Coluna "${nome}" já existe`);
                    continue;
               }

               await connection.query(`ALTER TABLE users ADD COLUMN ${nome} ${definicao}`);
               console.log(`➕ Coluna "${nome}" adicionada`);

               if (nome === 'email_verificado_em') {
                    adicionouVerificacao = true;
               }
          }

          if (adicionouVerificacao) {
               const [result] = await connection.query('UPDATE users SET email_verificado_em = NOW() WHERE email_verificado_em IS NULL');
               console.log(`✅ ${result.affectedRows} usuário(s) existente(s) marcados como verificados`);
          }

          const [indices] = await connection.query("SHOW INDEX FROM users WHERE Key_name = 'idx_token_verificacao'");
          if (indices.length === 0) {
               await connection.query('ALTER TABLE users ADD INDEX idx_token_verificacao (token_verificacao)');
               console.log('➕ Índice "idx_token_verificacao" adicionado');
          }

          const [indicesReset] = await connection.query("SHOW INDEX FROM users WHERE Key_name = 'idx_token_redefinicao'");
          if (indicesReset.length === 0) {
               await connection.query('ALTER TABLE users ADD INDEX idx_token_redefinicao (token_redefinicao)');
               console.log('➕ Índice "idx_token_redefinicao" adicionado');
          }

          const [colunaTaxa] = await connection.query("SHOW COLUMNS FROM patrimonios LIKE 'tempo_depreciacao'");
          if (colunaTaxa.length > 0 && !/^decimal/i.test(colunaTaxa[0].Type)) {
               await connection.query('ALTER TABLE patrimonios MODIFY COLUMN tempo_depreciacao DECIMAL(5,2) NOT NULL');
               console.log('🔧 patrimonios.tempo_depreciacao agora é DECIMAL(5,2)');
          }

          console.log('🎉 Migração concluída');
          await connection.end();
     } catch (error) {
          console.error('❌ Erro na migração:', error);
          if (connection) await connection.end();
          process.exit(1);
     }
}

migrate();
