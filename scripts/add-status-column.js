// scripts/add-status-column.js
const { connect, dbTarget } = require('./db');

async function addStatusColumn() {
     let connection;

     try {
          const { host, port, database } = dbTarget();
          console.log(`🔍 Conectando a ${database} em ${host}:${port}...`);

          connection = await connect();

          console.log('🔗 Conectado ao banco de dados');

          // Verificar se a coluna já existe
          const [columns] = await connection.query(
               "SHOW COLUMNS FROM users LIKE 'status'"
          );

          if (columns.length > 0) {
               console.log('ℹ️  Coluna "status" já existe na tabela users');
          } else {
               console.log('➕ Adicionando coluna "status" na tabela users...');

               await connection.query(`
                    ALTER TABLE users
                    ADD COLUMN status ENUM('ativo', 'inativo', 'suspenso', 'deletado') DEFAULT 'ativo' AFTER avatar_url
               `);

               // Atualizar todos os registros existentes para 'ativo'
               await connection.query(`
                    UPDATE users SET status = 'ativo' WHERE status IS NULL
               `);

               console.log('✅ Coluna "status" adicionada com sucesso!');
          }

          await connection.end();
          console.log('🔌 Conexão fechada');

     } catch (error) {
          console.error('❌ Erro ao adicionar coluna status:', error);
          if (connection) await connection.end();
          process.exit(1);
     }
}

addStatusColumn();
