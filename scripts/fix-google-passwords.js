// scripts/fix-google-passwords.js
// Remove a senha fixa ('GoogleOAuthPassword') gravada nas contas criadas via Google.
// Sem argumentos apenas lista as contas afetadas; use --apply para gravar.
const { connect, dbTarget } = require('./db');
const bcrypt = require('bcryptjs');

const SENHA_FIXA = 'GoogleOAuthPassword';
const apply = process.argv.includes('--apply');

async function fixGooglePasswords() {
     let connection;

     try {
          const { host, port, database } = dbTarget();
          console.log(`🔍 Conectando a ${database} em ${host}:${port}...`);

          connection = await connect();

          const [users] = await connection.query(
               "SELECT id, email, senha FROM users WHERE google_id IS NOT NULL AND google_id != '' AND senha IS NOT NULL"
          );

          const afetados = [];
          for (const user of users) {
               if (await bcrypt.compare(SENHA_FIXA, user.senha)) {
                    afetados.push(user);
               }
          }

          console.log(`🔎 ${afetados.length} de ${users.length} conta(s) Google com a senha fixa`);

          if (!apply) {
               console.log('ℹ️  Nada foi alterado. Rode com --apply para remover as senhas.');
          } else if (afetados.length > 0) {
               await connection.query(
                    `UPDATE users SET senha = NULL WHERE id IN (${afetados.map(() => '?').join(', ')})`,
                    afetados.map(user => user.id)
               );
               console.log('✅ Senhas fixas removidas');
          }

          await connection.end();
     } catch (error) {
          console.error('❌ Erro ao corrigir senhas das contas Google:', error);
          if (connection) await connection.end();
          process.exit(1);
     }
}

fixGooglePasswords();
