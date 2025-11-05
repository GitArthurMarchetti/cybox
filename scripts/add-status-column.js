// scripts/add-status-column.js
const path = require('path');
const fs = require('fs');

// Carregar .env.local se existir, senão carregar .env
const envLocalPath = path.resolve(__dirname, '../.env.local');
const envPath = path.resolve(__dirname, '../.env');
const envFile = fs.existsSync(envLocalPath) ? envLocalPath : envPath;

console.log(`📄 Carregando arquivo: ${envFile}`);
require('dotenv').config({ path: envFile, override: true });
const mysql = require('mysql2/promise');

async function addStatusColumn() {
     let connection;

     try {
          console.log('🔍 Conectando ao banco de dados...');
          console.log(`   Host: ${process.env.MYSQL_HOST}`);
          console.log(`   User: ${process.env.MYSQL_USER}`);
          console.log(`   Database: ${process.env.MYSQL_DATABASE}`);
          console.log(`   Port: ${process.env.MYSQL_PORT}`);

          const isRemote = process.env.MYSQL_HOST && process.env.MYSQL_HOST.includes('digitalocean');
          console.log(`   Is Remote: ${isRemote}`);

          connection = await mysql.createConnection({
               host: process.env.MYSQL_HOST,
               user: process.env.MYSQL_USER,
               password: process.env.MYSQL_PASSWORD,
               database: process.env.MYSQL_DATABASE || "cybox",
               port: parseInt(process.env.MYSQL_PORT || '25060'),
               connectTimeout: 60000,
               ...(isRemote && {
                    ssl: {
                         rejectUnauthorized: false
                    }
               })
          });

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
