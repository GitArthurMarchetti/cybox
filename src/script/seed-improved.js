// scripts/seed-improved.js
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

async function seed() {
     let connection;

     try {
          console.log('🔍 Tentando conectar ao banco de dados...');
          console.log(`   Host: ${process.env.MYSQL_HOST}`);
          console.log(`   User: ${process.env.MYSQL_USER}`);
          console.log(`   Database: ${process.env.MYSQL_DATABASE || 'cybox'}`);
          console.log(`   Port: ${process.env.MYSQL_PORT || '25060'}`);

          // Conectar ao banco de dados
          const isRemote = process.env.MYSQL_HOST && process.env.MYSQL_HOST.includes('digitalocean');

          connection = await mysql.createConnection({
               host: process.env.MYSQL_HOST,
               user: process.env.MYSQL_USER,
               password: process.env.MYSQL_PASSWORD,
               database: process.env.MYSQL_DATABASE || "cybox",
               multipleStatements: true,
               port: parseInt(process.env.MYSQL_PORT || '25060'),
               connectTimeout: 60000,
               waitForConnections: true,
               connectionLimit: 10,
               queueLimit: 0,
               ...(isRemote && {
                    ssl: {
                         rejectUnauthorized: false
                    }
               })
          });

          console.log('🔗 Conectado ao banco de dados');
          console.log('🔧 Criando/atualizando estrutura das tabelas...');

          // Criar ou atualizar tabelas com estrutura correta
          const createTablesQuery = `
          -- Tabela de Usuários
          CREATE TABLE IF NOT EXISTS users (
               id VARCHAR(36) PRIMARY KEY,
               nome VARCHAR(255) NOT NULL,
               email VARCHAR(255) NOT NULL UNIQUE,
               senha VARCHAR(255),
               google_id VARCHAR(255) UNIQUE,
               avatar_url VARCHAR(500),
               status ENUM('ativo', 'inativo', 'suspenso', 'deletado') DEFAULT 'ativo',
               ultimo_login TIMESTAMP NULL,
               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
               updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

               INDEX idx_email (email),
               INDEX idx_google_id (google_id),
               INDEX idx_status (status)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

          -- Tabela de Padrões de Depreciação
          CREATE TABLE IF NOT EXISTS padroes_depreciacao (
               id INT AUTO_INCREMENT PRIMARY KEY,
               categoria VARCHAR(255) NOT NULL UNIQUE,
               descricao TEXT,
               taxa_anual_percent DECIMAL(5,2) NOT NULL,
               vida_util_anos INT NOT NULL,
               observacoes TEXT,
               ativo TINYINT(1) DEFAULT 1,
               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
               updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

               INDEX idx_categoria (categoria),
               INDEX idx_ativo (ativo)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

          -- Tabela de Departamentos
          CREATE TABLE IF NOT EXISTS departamentos (
               id_departamentos INT AUTO_INCREMENT PRIMARY KEY,
               titulo VARCHAR(255) NOT NULL,
               descricao TEXT,
               convite VARCHAR(255),
               codigo_convite VARCHAR(255) UNIQUE,
               localizacao VARCHAR(255),
               fotoDepartamento VARCHAR(255),
               status ENUM('ativo', 'inativo', 'deletado') DEFAULT 'ativo',
               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
               updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

               INDEX idx_codigo_convite (codigo_convite),
               INDEX idx_status (status)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

          -- Tabela de Relacionamento entre Usuários e Departamentos
          CREATE TABLE IF NOT EXISTS users_departamentos (
               id INT AUTO_INCREMENT PRIMARY KEY,
               id_users VARCHAR(36) NOT NULL,
               id_departamentos INT NOT NULL,
               role ENUM('member', 'admin', 'owner') DEFAULT 'member',
               status ENUM('ativo', 'inativo', 'deletado') DEFAULT 'ativo',
               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
               updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

               FOREIGN KEY (id_users) REFERENCES users(id) ON DELETE CASCADE,
               FOREIGN KEY (id_departamentos) REFERENCES departamentos(id_departamentos) ON DELETE CASCADE,
               UNIQUE KEY unique_user_departamento (id_users, id_departamentos),
               INDEX idx_role (role),
               INDEX idx_status (status)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

          -- Tabela de Convites (entre usuários cadastrados)
          CREATE TABLE IF NOT EXISTS convites (
               id INT AUTO_INCREMENT PRIMARY KEY,
               id_departamentos INT NOT NULL,
               id_remetente VARCHAR(36) NOT NULL,
               id_destinatario VARCHAR(36) NOT NULL,
               status ENUM('pendente', 'aceito', 'recusado') DEFAULT 'pendente',
               codigo_convite VARCHAR(50),
               data_expiracao DATETIME,
               criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
               updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

               FOREIGN KEY (id_departamentos) REFERENCES departamentos(id_departamentos) ON DELETE CASCADE,
               FOREIGN KEY (id_remetente) REFERENCES users(id) ON DELETE CASCADE,
               FOREIGN KEY (id_destinatario) REFERENCES users(id) ON DELETE CASCADE,
               INDEX idx_status (status),
               INDEX idx_codigo_convite (codigo_convite)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

          -- Tabela de Convites Externos (para emails não cadastrados)
          CREATE TABLE IF NOT EXISTS convites_externos (
               id INT AUTO_INCREMENT PRIMARY KEY,
               id_departamentos INT NOT NULL,
               id_remetente VARCHAR(255) NOT NULL,
               email_destinatario VARCHAR(255) NOT NULL,
               codigo_convite VARCHAR(50) NOT NULL UNIQUE,
               data_expiracao DATETIME NOT NULL,
               status ENUM('pendente', 'aceito', 'recusado', 'expirado') DEFAULT 'pendente',
               criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
               updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

               FOREIGN KEY (id_departamentos) REFERENCES departamentos(id_departamentos) ON DELETE CASCADE,
               INDEX idx_codigo_convite (codigo_convite),
               INDEX idx_email_destinatario (email_destinatario),
               INDEX idx_status (status)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

          -- Tabela de Categorias
          CREATE TABLE IF NOT EXISTS categorias (
               id INT AUTO_INCREMENT PRIMARY KEY,
               id_departamento INT NOT NULL,
               nome VARCHAR(255) NOT NULL,
               descricao TEXT,
               padrao_depreciacao_id INT,
               status ENUM('ativo', 'inativo', 'deletado') DEFAULT 'ativo',
               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
               updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

               FOREIGN KEY (id_departamento) REFERENCES departamentos(id_departamentos) ON DELETE CASCADE,
               FOREIGN KEY (padrao_depreciacao_id) REFERENCES padroes_depreciacao(id) ON DELETE SET NULL,
               INDEX idx_departamento_status (id_departamento, status)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

          -- Tabela de Patrimônios
          CREATE TABLE IF NOT EXISTS patrimonios (
               id INT AUTO_INCREMENT PRIMARY KEY,
               id_categoria INT NOT NULL,
               nome VARCHAR(255) NOT NULL,
               descricao TEXT,
               codigo_patrimonio VARCHAR(100),
               localizacao VARCHAR(255),
               valor_inicial DECIMAL(10,2) NOT NULL,
               valor_atual DECIMAL(10,2) NOT NULL,
               data_aquisicao DATE NOT NULL,
               tempo_depreciacao INT NOT NULL,
               status ENUM('ativo', 'inativo', 'manutencao', 'baixado', 'deletado') DEFAULT 'ativo',
               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
               updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

               FOREIGN KEY (id_categoria) REFERENCES categorias(id) ON DELETE CASCADE,
               INDEX idx_codigo_patrimonio (codigo_patrimonio),
               INDEX idx_status (status),
               INDEX idx_categoria_status (id_categoria, status)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

          -- Tabela de Gastos
          CREATE TABLE IF NOT EXISTS gastos (
               id INT AUTO_INCREMENT PRIMARY KEY,
               patrimonio_id INT NOT NULL,
               tipo ENUM('manutencao', 'reparo', 'upgrade', 'seguro', 'licenca', 'outros') NOT NULL,
               descricao TEXT NOT NULL,
               valor DECIMAL(10,2) NOT NULL,
               data_gasto DATE NOT NULL,
               fornecedor VARCHAR(255),
               numero_nota_fiscal VARCHAR(100),
               observacoes TEXT,
               comprovante_url VARCHAR(500),
               usuario_id VARCHAR(36) NOT NULL,
               status ENUM('pendente', 'aprovado', 'pago', 'cancelado') DEFAULT 'pendente',
               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
               updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

               FOREIGN KEY (patrimonio_id) REFERENCES patrimonios(id) ON DELETE CASCADE,
               FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE,
               INDEX idx_patrimonio_data (patrimonio_id, data_gasto),
               INDEX idx_tipo (tipo),
               INDEX idx_status (status)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

          -- Tabela de Notificações
          CREATE TABLE IF NOT EXISTS notificacoes (
               id INT AUTO_INCREMENT PRIMARY KEY,
               usuario_id VARCHAR(36) NOT NULL,
               titulo VARCHAR(255) NOT NULL,
               mensagem TEXT NOT NULL,
               tipo ENUM('info', 'warning', 'success', 'error', 'depreciacao', 'manutencao', 'vencimento', 'convite') NOT NULL,
               lida TINYINT(1) DEFAULT 0,
               acao_url VARCHAR(500),
               acao_texto VARCHAR(100),
               data_expiracao TIMESTAMP NULL,
               metadados JSON,
               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

               FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE,
               INDEX idx_usuario_lida (usuario_id, lida),
               INDEX idx_tipo (tipo),
               INDEX idx_data_expiracao (data_expiracao)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
          `;

          await connection.query(createTablesQuery);
          console.log('✅ Estrutura das tabelas criada/atualizada com sucesso!');

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

               // Criar padrões de depreciação
               console.log('📊 Criando padrões de depreciação...');

               await connection.query(`
                    INSERT INTO padroes_depreciacao (categoria, descricao, taxa_anual_percent, vida_util_anos, observacoes) VALUES
                    ('Computadores e Periféricos', 'Equipamentos de informática, notebooks, desktops, impressoras', 20.00, 5, 'Taxa baseada na legislação fiscal brasileira'),
                    ('Móveis e Utensílios', 'Mesas, cadeiras, armários e mobiliário em geral', 10.00, 10, 'Depreciação de acordo com uso normal'),
                    ('Equipamentos de Comunicação', 'Telefones, rádios, equipamentos de rede', 20.00, 5, 'Alta obsolescência tecnológica'),
                    ('Veículos', 'Carros, motos, veículos corporativos', 20.00, 5, 'Baseado em tabela FIPE e uso comercial'),
                    ('Máquinas e Equipamentos', 'Equipamentos industriais e comerciais', 10.00, 10, 'Variável conforme tipo de equipamento'),
                    ('Equipamentos de Áudio e Vídeo', 'Câmeras, microfones, projetores', 15.00, 7, 'Média obsolescência tecnológica'),
                    ('Ferramentas', 'Ferramentas manuais e elétricas', 15.00, 7, 'Depreciação por uso e desgaste'),
                    ('Equipamentos Médicos', 'Aparelhos e instrumentos médicos', 10.00, 10, 'Conforme regulamentação ANVISA')
               `);

               console.log('✅ Padrões de depreciação criados!');

               // Criar departamentos de teste
               console.log('🏢 Criando departamentos iniciais...');

               await connection.query(`
                    INSERT INTO departamentos (titulo, descricao, localizacao, status) VALUES
                    ('Tecnologia da Informação', 'Gerenciamento de equipamentos e infraestrutura de TI', 'Bloco A - 3º Andar', 'ativo'),
                    ('Departamento Financeiro', 'Controle e gestão de ativos financeiros e patrimoniais', 'Bloco B - 2º Andar', 'ativo'),
                    ('Marketing e Comunicação', 'Equipamentos de mídia e comunicação corporativa', 'Bloco C - 1º Andar', 'ativo')
               `);

               // Obter IDs dos departamentos
               const [departamentos] = await connection.query('SELECT id_departamentos FROM departamentos ORDER BY id_departamentos');

               // Associar usuários aos departamentos
               console.log('🔗 Associando usuários aos departamentos...');

               await connection.query(`
                    INSERT INTO users_departamentos (id_users, id_departamentos, role) VALUES
                    (?, ?, 'owner'),
                    (?, ?, 'owner'),
                    (?, ?, 'owner')
               `, [
                    adminId, departamentos[0].id_departamentos,
                    user1Id, departamentos[1].id_departamentos,
                    user2Id, departamentos[2].id_departamentos
               ]);

               // Obter padrões de depreciação
               const [padroes] = await connection.query('SELECT id, categoria FROM padroes_depreciacao');
               const padraoComputadores = padroes.find(p => p.categoria === 'Computadores e Periféricos');
               const padraoMoveis = padroes.find(p => p.categoria === 'Móveis e Utensílios');
               const padraoAudioVideo = padroes.find(p => p.categoria === 'Equipamentos de Áudio e Vídeo');

               // Criar categorias de exemplo
               console.log('📂 Criando categorias iniciais...');

               await connection.query(`
                    INSERT INTO categorias (id_departamento, nome, descricao, padrao_depreciacao_id) VALUES
                    (?, 'Computadores e Notebooks', 'Equipamentos de informática portáteis e desktops', ?),
                    (?, 'Monitores e Displays', 'Monitores, projetores e equipamentos de exibição', ?),
                    (?, 'Servidores e Rede', 'Equipamentos de infraestrutura de rede e servidores', ?),
                    (?, 'Mobiliário Corporativo', 'Mesas, cadeiras e móveis de escritório', ?),
                    (?, 'Equipamentos Financeiros', 'Calculadoras, cofres e equipamentos específicos', ?),
                    (?, 'Equipamentos de Áudio/Vídeo', 'Microfones, câmeras e equipamentos de produção', ?)
               `, [
                    departamentos[0].id_departamentos, padraoComputadores?.id,
                    departamentos[0].id_departamentos, padraoComputadores?.id,
                    departamentos[0].id_departamentos, padraoComputadores?.id,
                    departamentos[1].id_departamentos, padraoMoveis?.id,
                    departamentos[1].id_departamentos, padraoComputadores?.id,
                    departamentos[2].id_departamentos, padraoAudioVideo?.id
               ]);

               // Obter IDs das categorias
               const [categorias] = await connection.query('SELECT id, nome, id_departamento FROM categorias ORDER BY id');

               // Criar patrimônios de exemplo
               console.log('💼 Criando patrimônios iniciais...');

               const dataAtual = new Date();
               const dataAquisicao = new Date(dataAtual.getFullYear(), dataAtual.getMonth() - 6, 15);

               // Patrimônios para TI
               for (const categoria of categorias) {
                    if (categoria.nome === 'Computadores e Notebooks') {
                         await connection.query(`
                              INSERT INTO patrimonios (
                                   id_categoria, nome, descricao, codigo_patrimonio,
                                   localizacao, valor_inicial, valor_atual, data_aquisicao, tempo_depreciacao,
                                   status
                              ) VALUES
                              (?, 'Notebook Dell Inspiron 15', 'Notebook corporativo i7 16GB RAM 512GB SSD', 'NB-2024-001', 'TI - Sala 301', 4500.00, 3600.00, ?, 20, 'ativo'),
                              (?, 'Desktop HP EliteDesk', 'Desktop corporativo i5 8GB RAM 256GB SSD', 'DT-2024-001', 'TI - Sala 302', 3200.00, 2560.00, ?, 20, 'ativo'),
                              (?, 'MacBook Pro 14"', 'MacBook Pro M2 32GB RAM 1TB SSD', 'MB-2024-001', 'TI - Sala 303', 12000.00, 9600.00, ?, 25, 'ativo')
                         `, [
                              categoria.id, dataAquisicao.toISOString().split('T')[0],
                              categoria.id, dataAquisicao.toISOString().split('T')[0],
                              categoria.id, dataAquisicao.toISOString().split('T')[0]
                         ]);
                    } else if (categoria.nome === 'Monitores e Displays') {
                         await connection.query(`
                              INSERT INTO patrimonios (
                                   id_categoria, nome, descricao, codigo_patrimonio,
                                   localizacao, valor_inicial, valor_atual, data_aquisicao, tempo_depreciacao,
                                   status
                              ) VALUES
                              (?, 'Monitor LG UltraWide 29"', 'Monitor UltraWide 29" Full HD IPS', 'MN-2024-001', 'TI - Sala 301', 1200.00, 1080.00, ?, 10, 'ativo'),
                              (?, 'Monitor Dell 27"', 'Monitor 27" 4K USB-C', 'MN-2024-002', 'TI - Sala 302', 2800.00, 2520.00, ?, 12, 'ativo'),
                              (?, 'Projetor Epson', 'Projetor Full HD 3500 lumens', 'PJ-2024-001', 'TI - Sala de Reuniões', 3500.00, 2800.00, ?, 15, 'ativo')
                         `, [
                              categoria.id, dataAquisicao.toISOString().split('T')[0],
                              categoria.id, dataAquisicao.toISOString().split('T')[0],
                              categoria.id, dataAquisicao.toISOString().split('T')[0]
                         ]);
                    }
               }

               // Patrimônios para Financeiro
               const categoriaFinanceiro = categorias.find(c => c.nome === 'Mobiliário Corporativo');
               if (categoriaFinanceiro) {
                    await connection.query(`
                         INSERT INTO patrimonios (
                              id_categoria, nome, descricao, codigo_patrimonio,
                              localizacao, valor_inicial, valor_atual, data_aquisicao, tempo_depreciacao,
                              status
                         ) VALUES
                         (?, 'Mesa Executiva L', 'Mesa em L com gavetas e suporte para CPU', 'MS-2024-001', 'Financeiro - Sala 201', 2200.00, 1980.00, ?, 5, 'ativo'),
                         (?, 'Cadeira Presidente', 'Cadeira ergonômica com apoio lombar ajustável', 'CD-2024-001', 'Financeiro - Sala 201', 1800.00, 1620.00, ?, 8, 'ativo'),
                         (?, 'Armário de Arquivo', 'Armário de aço 4 gavetas com fechadura', 'AR-2024-001', 'Financeiro - Arquivo', 1500.00, 1350.00, ?, 3, 'ativo')
                    `, [
                         categoriaFinanceiro.id, dataAquisicao.toISOString().split('T')[0],
                         categoriaFinanceiro.id, dataAquisicao.toISOString().split('T')[0],
                         categoriaFinanceiro.id, dataAquisicao.toISOString().split('T')[0]
                    ]);
               }

               // Patrimônios para Marketing
               const categoriaMarketing = categorias.find(c => c.nome === 'Equipamentos de Áudio/Vídeo');
               if (categoriaMarketing) {
                    await connection.query(`
                         INSERT INTO patrimonios (
                              id_categoria, nome, descricao, codigo_patrimonio,
                              localizacao, valor_inicial, valor_atual, data_aquisicao, tempo_depreciacao,
                              status
                         ) VALUES
                         (?, 'Microfone Rode PodMic', 'Microfone dinâmico para podcast e streaming', 'MC-2024-001', 'Marketing - Estúdio', 850.00, 765.00, ?, 10, 'ativo'),
                         (?, 'Câmera Sony A7 III', 'Câmera mirrorless full-frame para produção de conteúdo', 'CM-2024-001', 'Marketing - Estúdio', 12500.00, 10000.00, ?, 18, 'ativo'),
                         (?, 'Tripé Manfrotto', 'Tripé profissional de fibra de carbono', 'TP-2024-001', 'Marketing - Estúdio', 1200.00, 1080.00, ?, 5, 'ativo')
                    `, [
                         categoriaMarketing.id, dataAquisicao.toISOString().split('T')[0],
                         categoriaMarketing.id, dataAquisicao.toISOString().split('T')[0],
                         categoriaMarketing.id, dataAquisicao.toISOString().split('T')[0]
                    ]);
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
          console.log('   • Patrimônios com códigos e valores');
          console.log('   • Padrões de depreciação configurados');
          console.log('   • Estrutura completa e otimizada');

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
if (require.main === module) {
     seed().catch(console.error);
}

module.exports = { seed };
