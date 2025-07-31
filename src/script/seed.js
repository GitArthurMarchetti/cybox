// src/script/seed.js
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

async function seed() {
     let connection;

     try {
          // Conectar ao banco de dados
          connection = await mysql.createConnection({
               host: process.env.MYSQL_HOST || 'localhost',
               user: process.env.MYSQL_USER || 'root',
               password: process.env.MYSQL_PASSWORD || 'duduborges22',
               database: "cybox",
               multipleStatements: true,
               port: 3306
          });

          console.log('🔗 Conectado ao banco de dados');
          console.log('📋 Verificando estrutura do banco...');

          // Verificar se já existem usuários
          const [users] = await connection.query('SELECT COUNT(*) as count FROM users');

          if (users[0].count === 0) {
               console.log('👥 Criando usuários iniciais...');

               // Criar usuários de teste
               const adminId = uuidv4();
               const user1Id = uuidv4();
               const user2Id = uuidv4();

               const hashedPassword = await bcrypt.hash('senha123', 10);

               await connection.query(`
                    INSERT INTO users (id, nome, email, senha, status) VALUES 
                    (?, 'Eduardo Borges', 'admin@cybox.com', ?, 'ativo'),
                    (?, 'Gerente TI', 'ti@cybox.com', ?, 'ativo'),
                    (?, 'Analista Financeiro', 'financeiro@cybox.com', ?, 'ativo')
               `, [adminId, hashedPassword, user1Id, hashedPassword, user2Id, hashedPassword]);

               console.log('✅ Usuários criados com sucesso!');

               // Criar departamentos de teste
               console.log('🏢 Criando departamentos iniciais...');

               // Gerar códigos de convite únicos
               const codigoTI = `DEPT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
               const codigoFIN = `DEPT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
               const codigoMKT = `DEPT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

               await connection.query(`
                    INSERT INTO departamentos (titulo, descricao, localizacao, codigo_convite, status) VALUES 
                    ('Tecnologia da Informação', 'Gerenciamento de equipamentos e infraestrutura de TI', 'Bloco A - 3º Andar', ?, 'ativo'),
                    ('Departamento Financeiro', 'Controle e gestão de ativos financeiros e patrimoniais', 'Bloco B - 2º Andar', ?, 'ativo'),
                    ('Marketing e Comunicação', 'Equipamentos de mídia e comunicação corporativa', 'Bloco C - 1º Andar', ?, 'ativo')
               `, [codigoTI, codigoFIN, codigoMKT]);

               // Obter IDs dos departamentos
               const [departamentos] = await connection.query('SELECT id_departamentos FROM departamentos ORDER BY id_departamentos');

               // Associar usuários aos departamentos com o novo sistema de roles
               console.log('🔗 Associando usuários aos departamentos...');

               await connection.query(`
                    INSERT INTO users_departamentos (id_users, id_departamentos, role, status) VALUES 
                    (?, ?, 'owner', 'ativo'),
                    (?, ?, 'owner', 'ativo'),
                    (?, ?, 'owner', 'ativo')
               `, [
                    adminId, departamentos[0].id_departamentos,
                    user1Id, departamentos[1].id_departamentos,
                    user2Id, departamentos[2].id_departamentos
               ]);

               // Obter referências para padrões de depreciação
               const [padraoComp] = await connection.query('SELECT id FROM padroes_depreciacao WHERE categoria = "Computadores e Periféricos" LIMIT 1');
               const [padraoMovel] = await connection.query('SELECT id FROM padroes_depreciacao WHERE categoria = "Móveis e Utensílios" LIMIT 1');
               const [padraoAudio] = await connection.query('SELECT id FROM padroes_depreciacao WHERE categoria = "Equipamentos de Áudio e Vídeo" LIMIT 1');

               // Criar categorias de exemplo
               console.log('📂 Criando categorias iniciais...');

               await connection.query(`
                    INSERT INTO categorias (id_departamento, nome, descricao, padrao_depreciacao_id, status) VALUES 
                    (?, 'Computadores e Notebooks', 'Equipamentos de informática portáteis e desktops', ?, 'ativo'),
                    (?, 'Monitores e Displays', 'Monitores, projetores e equipamentos de exibição', ?, 'ativo'),
                    (?, 'Mobiliário Corporativo', 'Mesas, cadeiras e móveis de escritório', ?, 'ativo'),
                    (?, 'Equipamentos de Áudio/Vídeo', 'Microfones, câmeras e equipamentos de produção', ?, 'ativo')
               `, [
                    departamentos[0].id_departamentos, padraoComp[0]?.id || null,
                    departamentos[0].id_departamentos, padraoComp[0]?.id || null,
                    departamentos[1].id_departamentos, padraoMovel[0]?.id || null,
                    departamentos[2].id_departamentos, padraoAudio[0]?.id || null
               ]);

               // Obter IDs das categorias
               const [categorias] = await connection.query('SELECT id, nome, id_departamento FROM categorias ORDER BY id');

               // Criar patrimônios de exemplo
               console.log('💼 Criando patrimônios iniciais...');

               const dataAtual = new Date();
               const dataAquisicao = new Date(dataAtual.getFullYear(), dataAtual.getMonth() - 6, 15); // 6 meses atrás

               for (const categoria of categorias) {
                    if (categoria.nome === 'Computadores e Notebooks') {
                         await connection.query(`
                              INSERT INTO patrimonios (id_categoria, nome, descricao, codigo_patrimonio, localizacao, valor_inicial, valor_atual, data_aquisicao, tempo_depreciacao, status) VALUES 
                              (?, 'Notebook Dell Inspiron 15', 'Notebook corporativo i7 16GB RAM 512GB SSD', 'NB-2024-001', 'TI - Sala 301', 4500.00, 3600.00, ?, 48, 'ativo'),
                              (?, 'Desktop HP EliteDesk', 'Desktop corporativo i5 8GB RAM 256GB SSD', 'DT-2024-001', 'TI - Sala 302', 3200.00, 2560.00, ?, 60, 'ativo'),
                              (?, 'MacBook Pro 14"', 'MacBook Pro M2 32GB RAM 1TB SSD', 'MB-2024-001', 'TI - Sala 303', 12000.00, 9600.00, ?, 48, 'ativo')
                         `, [
                              categoria.id, dataAquisicao.toISOString().split('T')[0],
                              categoria.id, dataAquisicao.toISOString().split('T')[0],
                              categoria.id, dataAquisicao.toISOString().split('T')[0]
                         ]);
                    } else if (categoria.nome === 'Monitores e Displays') {
                         await connection.query(`
                              INSERT INTO patrimonios (id_categoria, nome, descricao, codigo_patrimonio, localizacao, valor_inicial, valor_atual, data_aquisicao, tempo_depreciacao, status) VALUES 
                              (?, 'Monitor LG UltraWide 29"', 'Monitor UltraWide 29" Full HD IPS', 'MN-2024-001', 'TI - Sala 301', 1200.00, 1080.00, ?, 60, 'ativo'),
                              (?, 'Monitor Dell 27"', 'Monitor 27" 4K USB-C', 'MN-2024-002', 'TI - Sala 302', 2800.00, 2520.00, ?, 72, 'ativo'),
                              (?, 'Projetor Epson', 'Projetor Full HD 3500 lumens', 'PJ-2024-001', 'TI - Sala de Reuniões', 3500.00, 2800.00, ?, 84, 'ativo')
                         `, [
                              categoria.id, dataAquisicao.toISOString().split('T')[0],
                              categoria.id, dataAquisicao.toISOString().split('T')[0],
                              categoria.id, dataAquisicao.toISOString().split('T')[0]
                         ]);
                    } else if (categoria.nome === 'Mobiliário Corporativo') {
                         await connection.query(`
                              INSERT INTO patrimonios (id_categoria, nome, descricao, codigo_patrimonio, localizacao, valor_inicial, valor_atual, data_aquisicao, tempo_depreciacao, status) VALUES 
                              (?, 'Mesa Executiva L', 'Mesa em L com gavetas e suporte para CPU', 'MS-2024-001', 'Financeiro - Sala 201', 2200.00, 1980.00, ?, 120, 'ativo'),
                              (?, 'Cadeira Presidente', 'Cadeira ergonômica com apoio lombar ajustável', 'CD-2024-001', 'Financeiro - Sala 201', 1800.00, 1620.00, ?, 84, 'ativo'),
                              (?, 'Armário de Arquivo', 'Armário de aço 4 gavetas com fechadura', 'AR-2024-001', 'Financeiro - Arquivo', 1500.00, 1350.00, ?, 180, 'ativo')
                         `, [
                              categoria.id, dataAquisicao.toISOString().split('T')[0],
                              categoria.id, dataAquisicao.toISOString().split('T')[0],
                              categoria.id, dataAquisicao.toISOString().split('T')[0]
                         ]);
                    } else if (categoria.nome === 'Equipamentos de Áudio/Vídeo') {
                         await connection.query(`
                              INSERT INTO patrimonios (id_categoria, nome, descricao, codigo_patrimonio, localizacao, valor_inicial, valor_atual, data_aquisicao, tempo_depreciacao, status) VALUES 
                              (?, 'Microfone Rode PodMic', 'Microfone dinâmico para podcast e streaming', 'MC-2024-001', 'Marketing - Estúdio', 850.00, 765.00, ?, 60, 'ativo'),
                              (?, 'Câmera Sony A7 III', 'Câmera mirrorless full-frame para produção de conteúdo', 'CM-2024-001', 'Marketing - Estúdio', 12500.00, 10000.00, ?, 72, 'ativo'),
                              (?, 'Tripé Manfrotto', 'Tripé profissional de fibra de carbono', 'TP-2024-001', 'Marketing - Estúdio', 1200.00, 1080.00, ?, 120, 'ativo')
                         `, [
                              categoria.id, dataAquisicao.toISOString().split('T')[0],
                              categoria.id, dataAquisicao.toISOString().split('T')[0],
                              categoria.id, dataAquisicao.toISOString().split('T')[0]
                         ]);
                    }
               }

               console.log('✅ Patrimônios criados com sucesso!');
          } else {
               console.log('ℹ️  Banco de dados já possui dados. Pulando a criação de dados iniciais.');
          }

          console.log('🎉 População do banco de dados concluída com sucesso!');
          console.log('');
          console.log('📋 Resumo:');
          console.log('   • Usuários de teste criados com senha: senha123');
          console.log('   • 3 Departamentos com diferentes categorias');
          console.log('   • Patrimônios com códigos, localização e padrões de depreciação');
          console.log('   • Sistema de roles implementado (owner, admin, member)');
          console.log('   • Soft delete habilitado em todas as tabelas');

     } catch (error) {
          console.error('❌ Erro ao configurar o banco de dados:', error);
          throw error;
     } finally {
          if (connection) {
               await connection.end();
               console.log('🔌 Conexão fechada');
          }
     }
}

// Executar o script
seed().catch(console.error);