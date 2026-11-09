// scripts/migrate.js
// Migrações idempotentes do banco (pode rodar quantas vezes quiser).
// - users: verificação de email, bloqueio de login, sessões e redefinição de senha.
//   Usuários que já existem são marcados como verificados para não perderem o acesso.
// - patrimonios.tempo_depreciacao: passa a aceitar decimais (taxa anual em %, ex.: 6.67).
// - padroes_depreciacao: renomeia os padrões em português para inglês.
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

const PADROES_EN = [
     ['Computadores e Periféricos', 'Computers & peripherals', 'Laptops, desktops, printers and data processing equipment', 'Typical rate for IT equipment'],
     ['Móveis e Utensílios', 'Furniture & fixtures', 'Desks, chairs, cabinets and shelving', 'General office furniture'],
     ['Veículos', 'Vehicles', 'Cars, vans, trucks and motorcycles', 'Vehicles used for transport'],
     ['Máquinas e Equipamentos', 'Machinery & equipment', 'Industrial and commercial equipment', 'General machinery and equipment'],
     ['Equipamentos de Comunicação', 'Communication equipment', 'Phones, radios and network equipment', 'Telecommunications equipment'],
     ['Equipamentos de Áudio e Vídeo', 'Audio & video equipment', 'Cameras, microphones and sound systems', 'Audiovisual production equipment'],
     ['Instalações', 'Building installations', 'Air conditioning and electrical systems', 'Fixed building installations'],
     ['Ferramentas', 'Tools', 'General hand and power tools', 'Tools and general equipment'],
     ['Equipamentos Médicos', 'Medical equipment', 'Medical devices and instruments', 'Check local regulations'],
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

          // Presets were originally seeded in Portuguese; rename them to English (idempotent).
          // `categoria` is UNIQUE, so if the English preset already exists we merge into it
          // (same rate) or keep both apart with the rate in the name (different rate).
          for (const [antigo, categoria, descricao, observacoes] of PADROES_EN) {
               const [[pt]] = await connection.query('SELECT id, taxa_anual_percent FROM padroes_depreciacao WHERE categoria = ?', [antigo]);
               if (!pt) continue;

               const [[en]] = await connection.query('SELECT id, taxa_anual_percent FROM padroes_depreciacao WHERE categoria = ?', [categoria]);

               if (!en) {
                    await connection.query(
                         'UPDATE padroes_depreciacao SET categoria = ?, descricao = ?, observacoes = ? WHERE id = ?',
                         [categoria, descricao, observacoes, pt.id]
                    );
                    console.log(`🌐 Preset "${antigo}" → "${categoria}"`);
               } else if (Number(en.taxa_anual_percent) === Number(pt.taxa_anual_percent)) {
                    await connection.query('UPDATE categorias SET padrao_depreciacao_id = ? WHERE padrao_depreciacao_id = ?', [en.id, pt.id]);
                    await connection.query('DELETE FROM padroes_depreciacao WHERE id = ?', [pt.id]);
                    console.log(`🌐 Preset "${antigo}" merged into "${categoria}"`);
               } else {
                    const nome = `${categoria} (${Number(pt.taxa_anual_percent)}%/yr)`;
                    await connection.query(
                         'UPDATE padroes_depreciacao SET categoria = ?, descricao = ?, observacoes = ? WHERE id = ?',
                         [nome, descricao, observacoes, pt.id]
                    );
                    console.log(`🌐 Preset "${antigo}" → "${nome}"`);
               }
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
