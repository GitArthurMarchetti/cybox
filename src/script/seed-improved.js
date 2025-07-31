// scripts/seed-improved.js
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
          console.log('🔧 Criando/atualizando estrutura das tabelas...');

          // Criar ou atualizar tabelas com estrutura melhorada
          const createTablesQuery = `
          -- Tabela de Usuários (melhorada)
          CREATE TABLE IF NOT EXISTS users (
               id VARCHAR(36) PRIMARY KEY,
               nome VARCHAR(255) NOT NULL,
               email VARCHAR(255) NOT NULL UNIQUE,
               senha VARCHAR(255),
               google_id VARCHAR(255) UNIQUE,
               avatar_url VARCHAR(500),
               status ENUM('ativo', 'inativo', 'suspenso') DEFAULT 'ativo',
               ultimo_login TIMESTAMP NULL,
               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
               updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
               
               INDEX idx_email (email),
               INDEX idx_google_id (google_id),
               INDEX idx_status (status)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

          -- Tabela de Departamentos (melhorada)
          CREATE TABLE IF NOT EXISTS departamentos (
               id INT AUTO_INCREMENT PRIMARY KEY,
               titulo VARCHAR(255) NOT NULL,
               descricao TEXT,
               codigo VARCHAR(50) UNIQUE,
               total_membros INT DEFAULT 1,
               maximo_membros INT DEFAULT 10,
               codigo_convite VARCHAR(255) UNIQUE,
               localizacao VARCHAR(255),
               foto_url VARCHAR(500),
               cor_tema VARCHAR(7) DEFAULT '#F6CF45',
               status ENUM('ativo', 'inativo', 'arquivado') DEFAULT 'ativo',
               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
               updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
               
               INDEX idx_codigo (codigo),
               INDEX idx_status (status),
               INDEX idx_codigo_convite (codigo_convite)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

          -- Tabela de Relacionamento entre Usuários e Departamentos (melhorada)
          CREATE TABLE IF NOT EXISTS users_departamentos (
               id INT AUTO_INCREMENT PRIMARY KEY,
               user_id VARCHAR(36) NOT NULL,
               departamento_id INT NOT NULL,
               papel ENUM('host', 'admin', 'membro', 'observador') DEFAULT 'membro',
               permissoes JSON,
               data_entrada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
               data_saida TIMESTAMP NULL,
               status ENUM('ativo', 'inativo') DEFAULT 'ativo',
               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
               updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
               
               FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
               FOREIGN KEY (departamento_id) REFERENCES departamentos(id) ON DELETE CASCADE,
               UNIQUE KEY uk_user_departamento (user_id, departamento_id),
               INDEX idx_papel (papel),
               INDEX idx_status (status)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

          -- Tabela de Convites (melhorada)
          CREATE TABLE IF NOT EXISTS convites (
               id INT AUTO_INCREMENT PRIMARY KEY,
               departamento_id INT NOT NULL,
               remetente_id VARCHAR(36) NOT NULL,
               destinatario_id VARCHAR(36) NOT NULL,
               email_destinatario VARCHAR(255),
               papel_oferecido ENUM('host', 'admin', 'membro', 'observador') DEFAULT 'membro',
               mensagem TEXT,
               status ENUM('pendente', 'aceito', 'recusado', 'expirado') DEFAULT 'pendente',
               token VARCHAR(255) UNIQUE,
               data_expiracao TIMESTAMP,
               data_resposta TIMESTAMP NULL,
               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
               updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
               
               FOREIGN KEY (departamento_id) REFERENCES departamentos(id) ON DELETE CASCADE,
               FOREIGN KEY (remetente_id) REFERENCES users(id) ON DELETE CASCADE,
               FOREIGN KEY (destinatario_id) REFERENCES users(id) ON DELETE CASCADE,
               INDEX idx_status (status),
               INDEX idx_token (token),
               INDEX idx_email_destinatario (email_destinatario)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

          -- Tabela de Categorias (melhorada)
          CREATE TABLE IF NOT EXISTS categorias (
               id INT AUTO_INCREMENT PRIMARY KEY,
               departamento_id INT NOT NULL,
               nome VARCHAR(255) NOT NULL,
               descricao TEXT,
               codigo VARCHAR(50),
               cor VARCHAR(7) DEFAULT '#8B5CF6',
               icone VARCHAR(50) DEFAULT 'folder',
               ordem INT DEFAULT 0,
               status ENUM('ativo', 'inativo', 'arquivado') DEFAULT 'ativo',
               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
               updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
               
               FOREIGN KEY (departamento_id) REFERENCES departamentos(id) ON DELETE CASCADE,
               INDEX idx_departamento_status (departamento_id, status),
               INDEX idx_ordem (ordem)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

          -- Tabela de Patrimônios (melhorada)
          CREATE TABLE IF NOT EXISTS patrimonios (
               id INT AUTO_INCREMENT PRIMARY KEY,
               categoria_id INT NOT NULL,
               nome VARCHAR(255) NOT NULL,
               descricao TEXT,
               codigo_patrimonio VARCHAR(100),
               codigo_barras VARCHAR(100),
               numero_serie VARCHAR(100),
               marca VARCHAR(100),
               modelo VARCHAR(100),
               localizacao VARCHAR(255),
               responsavel_id VARCHAR(36),
               
               -- Valores monetários
               valor_inicial DECIMAL(15,2) NOT NULL,
               valor_atual DECIMAL(15,2) NOT NULL,
               valor_residual DECIMAL(15,2) DEFAULT 0,
               
               -- Datas importantes
               data_aquisicao DATE NOT NULL,
               data_garantia DATE,
               data_ultima_manutencao DATE,
               data_proxima_manutencao DATE,
               
               -- Depreciação
               metodo_depreciacao ENUM('linear', 'acelerada', 'soma_digitos') DEFAULT 'linear',
               vida_util_meses INT NOT NULL,
               taxa_depreciacao_anual DECIMAL(5,2),
               
               -- Status e condição
               status ENUM('ativo', 'inativo', 'manutencao', 'baixado', 'perdido') DEFAULT 'ativo',
               condicao ENUM('novo', 'bom', 'regular', 'ruim', 'danificado') DEFAULT 'bom',
               
               -- Metadados
               observacoes TEXT,
               tags JSON,
               anexos JSON,
               historico_localizacao JSON,
               
               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
               updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
               
               FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE,
               FOREIGN KEY (responsavel_id) REFERENCES users(id) ON DELETE SET NULL,
               INDEX idx_codigo_patrimonio (codigo_patrimonio),
               INDEX idx_codigo_barras (codigo_barras),
               INDEX idx_numero_serie (numero_serie),
               INDEX idx_status (status),
               INDEX idx_categoria_status (categoria_id, status),
               INDEX idx_responsavel (responsavel_id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

          -- Tabela de Movimentações de Patrimônio
          CREATE TABLE IF NOT EXISTS patrimonio_movimentacoes (
               id INT AUTO_INCREMENT PRIMARY KEY,
               patrimonio_id INT NOT NULL,
               usuario_id VARCHAR(36) NOT NULL,
               tipo ENUM('transferencia', 'manutencao', 'baixa', 'reativacao', 'atualizacao_valor') NOT NULL,
               localizacao_origem VARCHAR(255),
               localizacao_destino VARCHAR(255),
               responsavel_origem_id VARCHAR(36),
               responsavel_destino_id VARCHAR(36),
               valor_anterior DECIMAL(15,2),
               valor_novo DECIMAL(15,2),
               observacoes TEXT,
               data_movimentacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
               
               FOREIGN KEY (patrimonio_id) REFERENCES patrimonios(id) ON DELETE CASCADE,
               FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE,
               FOREIGN KEY (responsavel_origem_id) REFERENCES users(id) ON DELETE SET NULL,
               FOREIGN KEY (responsavel_destino_id) REFERENCES users(id) ON DELETE SET NULL,
               INDEX idx_patrimonio_data (patrimonio_id, data_movimentacao),
               INDEX idx_tipo (tipo)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

          -- Tabela de Manutenções
          CREATE TABLE IF NOT EXISTS patrimonio_manutencoes (
               id INT AUTO_INCREMENT PRIMARY KEY,
               patrimonio_id INT NOT NULL,
               usuario_id VARCHAR(36) NOT NULL,
               tipo ENUM('preventiva', 'corretiva', 'preditiva', 'emergencial') NOT NULL,
               descricao TEXT NOT NULL,
               custo DECIMAL(10,2) DEFAULT 0,
               fornecedor VARCHAR(255),
               data_inicio DATE NOT NULL,
               data_fim DATE,
               data_proxima_manutencao DATE,
               status ENUM('agendada', 'em_andamento', 'concluida', 'cancelada') DEFAULT 'agendada',
               observacoes TEXT,
               anexos JSON,
               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
               updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
               
               FOREIGN KEY (patrimonio_id) REFERENCES patrimonios(id) ON DELETE CASCADE,
               FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE,
               INDEX idx_patrimonio_data (patrimonio_id, data_inicio),
               INDEX idx_status (status),
               INDEX idx_tipo (tipo)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

          -- Tabela de Depreciações (histórico)
          CREATE TABLE IF NOT EXISTS patrimonio_depreciacoes (
               id INT AUTO_INCREMENT PRIMARY KEY,
               patrimonio_id INT NOT NULL,
               mes_ano DATE NOT NULL,
               valor_inicial DECIMAL(15,2) NOT NULL,
               valor_depreciacao_mensal DECIMAL(15,2) NOT NULL,
               valor_acumulado DECIMAL(15,2) NOT NULL,
               valor_liquido DECIMAL(15,2) NOT NULL,
               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
               
               FOREIGN KEY (patrimonio_id) REFERENCES patrimonios(id) ON DELETE CASCADE,
               UNIQUE KEY uk_patrimonio_mes (patrimonio_id, mes_ano),
               INDEX idx_mes_ano (mes_ano)
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

               // Criar departamentos de teste
               console.log('🏢 Criando departamentos iniciais...');

               await connection.query(`
                    INSERT INTO departamentos (titulo, descricao, codigo, total_membros, maximo_membros, localizacao, cor_tema) VALUES 
                    ('Tecnologia da Informação', 'Gerenciamento de equipamentos e infraestrutura de TI', 'TI-001', 1, 15, 'Bloco A - 3º Andar', '#3B82F6'),
                    ('Departamento Financeiro', 'Controle e gestão de ativos financeiros e patrimoniais', 'FIN-001', 1, 10, 'Bloco B - 2º Andar', '#10B981'),
                    ('Marketing e Comunicação', 'Equipamentos de mídia e comunicação corporativa', 'MKT-001', 1, 12, 'Bloco C - 1º Andar', '#8B5CF6')
               `);

               // Obter IDs dos departamentos
               const [departamentos] = await connection.query('SELECT id, codigo FROM departamentos ORDER BY id');

               // Associar usuários aos departamentos
               console.log('🔗 Associando usuários aos departamentos...');

               await connection.query(`
                    INSERT INTO users_departamentos (user_id, departamento_id, papel) VALUES 
                    (?, ?, 'host'),
                    (?, ?, 'host'),
                    (?, ?, 'host')
               `, [
                    adminId, departamentos[0].id,
                    user1Id, departamentos[1].id,
                    user2Id, departamentos[2].id
               ]);

               // Criar categorias de exemplo
               console.log('📂 Criando categorias iniciais...');

               await connection.query(`
                    INSERT INTO categorias (departamento_id, nome, descricao, codigo, cor, icone) VALUES 
                    (?, 'Computadores e Notebooks', 'Equipamentos de informática portáteis e desktops', 'COMP', '#3B82F6', 'laptop'),
                    (?, 'Monitores e Displays', 'Monitores, projetores e equipamentos de exibição', 'MON', '#06B6D4', 'monitor'),
                    (?, 'Servidores e Rede', 'Equipamentos de infraestrutura de rede e servidores', 'SRV', '#8B5CF6', 'server'),
                    (?, 'Mobiliário Corporativo', 'Mesas, cadeiras e móveis de escritório', 'MOB', '#10B981', 'chair'),
                    (?, 'Equipamentos Financeiros', 'Calculadoras, cofres e equipamentos específicos', 'EQF', '#F59E0B', 'calculator'),
                    (?, 'Equipamentos de Áudio/Vídeo', 'Microfones, câmeras e equipamentos de produção', 'AV', '#EF4444', 'mic')
               `, [
                    departamentos[0].id, // TI - Computadores
                    departamentos[0].id, // TI - Monitores  
                    departamentos[0].id, // TI - Servidores
                    departamentos[1].id, // Financeiro - Mobiliário
                    departamentos[1].id, // Financeiro - Equipamentos
                    departamentos[2].id  // Marketing - Áudio/Vídeo
               ]);

               // Obter IDs das categorias
               const [categorias] = await connection.query('SELECT id, nome, departamento_id FROM categorias ORDER BY id');

               // Criar patrimônios de exemplo
               console.log('💼 Criando patrimônios iniciais...');

               const dataAtual = new Date();
               const dataAquisicao = new Date(dataAtual.getFullYear(), dataAtual.getMonth() - 6, 15); // 6 meses atrás

               // Patrimônios para TI
               for (const categoria of categorias) {
                    if (categoria.nome === 'Computadores e Notebooks') {
                         await connection.query(`
                              INSERT INTO patrimonios (
                                   categoria_id, nome, descricao, codigo_patrimonio, marca, modelo,
                                   localizacao, valor_inicial, valor_atual, data_aquisicao, vida_util_meses,
                                   taxa_depreciacao_anual, status, condicao, observacoes
                              ) VALUES 
                              (?, 'Notebook Dell Inspiron 15', 'Notebook corporativo i7 16GB RAM 512GB SSD', 'NB-2024-001', 'Dell', 'Inspiron 15 3000', 'TI - Sala 301', 4500.00, 3600.00, ?, 48, 20.00, 'ativo', 'bom', 'Equipamento em uso pela equipe de desenvolvimento'),
                              (?, 'Desktop HP EliteDesk', 'Desktop corporativo i5 8GB RAM 256GB SSD', 'DT-2024-001', 'HP', 'EliteDesk 800 G6', 'TI - Sala 302', 3200.00, 2560.00, ?, 60, 15.00, 'ativo', 'bom', 'Estação de trabalho para suporte técnico'),
                              (?, 'MacBook Pro 14"', 'MacBook Pro M2 32GB RAM 1TB SSD', 'MB-2024-001', 'Apple', 'MacBook Pro 14', 'TI - Sala 303', 12000.00, 9600.00, ?, 48, 25.00, 'ativo', 'novo', 'Equipamento para desenvolvimento mobile')
                         `, [
                              categoria.id, dataAquisicao.toISOString().split('T')[0],
                              categoria.id, dataAquisicao.toISOString().split('T')[0],
                              categoria.id, dataAquisicao.toISOString().split('T')[0]
                         ]);
                    } else if (categoria.nome === 'Monitores e Displays') {
                         await connection.query(`
                              INSERT INTO patrimonios (
                                   categoria_id, nome, descricao, codigo_patrimonio, marca, modelo,
                                   localizacao, valor_inicial, valor_atual, data_aquisicao, vida_util_meses,
                                   taxa_depreciacao_anual, status, condicao
                              ) VALUES 
                              (?, 'Monitor LG UltraWide 29"', 'Monitor UltraWide 29" Full HD IPS', 'MN-2024-001', 'LG', '29WK500-P', 'TI - Sala 301', 1200.00, 1080.00, ?, 60, 10.00, 'ativo', 'bom'),
                              (?, 'Monitor Dell 27"', 'Monitor 27" 4K USB-C', 'MN-2024-002', 'Dell', 'U2723QE', 'TI - Sala 302', 2800.00, 2520.00, ?, 72, 12.00, 'ativo', 'novo'),
                              (?, 'Projetor Epson', 'Projetor Full HD 3500 lumens', 'PJ-2024-001', 'Epson', 'PowerLite X41+', 'TI - Sala de Reuniões', 3500.00, 2800.00, ?, 84, 15.00, 'ativo', 'bom')
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
                              categoria_id, nome, descricao, codigo_patrimonio, marca,
                              localizacao, valor_inicial, valor_atual, data_aquisicao, vida_util_meses,
                              taxa_depreciacao_anual, status, condicao
                         ) VALUES 
                         (?, 'Mesa Executiva L', 'Mesa em L com gavetas e suporte para CPU', 'MS-2024-001', 'Móveis Escritório Pro', 'Financeiro - Sala 201', 2200.00, 1980.00, ?, 120, 5.00, 'ativo', 'bom'),
                         (?, 'Cadeira Presidente', 'Cadeira ergonômica com apoio lombar ajustável', 'CD-2024-001', 'FlexForm', 'Financeiro - Sala 201', 1800.00, 1620.00, ?, 84, 8.00, 'ativo', 'bom'),
                         (?, 'Armário de Arquivo', 'Armário de aço 4 gavetas com fechadura', 'AR-2024-001', 'ArquivoSeguro', 'Financeiro - Arquivo', 1500.00, 1350.00, ?, 180, 3.00, 'ativo', 'bom')
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
                              categoria_id, nome, descricao, codigo_patrimonio, marca, modelo,
                              localizacao, valor_inicial, valor_atual, data_aquisicao, vida_util_meses,
                              taxa_depreciacao_anual, status, condicao
                         ) VALUES 
                         (?, 'Microfone Rode PodMic', 'Microfone dinâmico para podcast e streaming', 'MC-2024-001', 'Rode', 'PodMic', 'Marketing - Estúdio', 850.00, 765.00, ?, 60, 10.00, 'ativo', 'novo'),
                         (?, 'Câmera Sony A7 III', 'Câmera mirrorless full-frame para produção de conteúdo', 'CM-2024-001', 'Sony', 'Alpha A7 III', 'Marketing - Estúdio', 12500.00, 10000.00, ?, 72, 18.00, 'ativo', 'bom'),
                         (?, 'Tripé Manfrotto', 'Tripé profissional de fibra de carbono', 'TP-2024-001', 'Manfrotto', 'MT055CXPRO4', 'Marketing - Estúdio', 1200.00, 1080.00, ?, 120, 5.00, 'ativo', 'bom')
                    `, [
                         categoriaMarketing.id, dataAquisicao.toISOString().split('T')[0],
                         categoriaMarketing.id, dataAquisicao.toISOString().split('T')[0],
                         categoriaMarketing.id, dataAquisicao.toISOString().split('T')[0]
                    ]);
               }

               console.log('✅ Patrimônios criados com sucesso!');

               // Gerar histórico de depreciação para alguns patrimônios
               console.log('📊 Gerando histórico de depreciação...');
               
               const [patrimoniosParaDepreciacao] = await connection.query('SELECT id, valor_inicial, vida_util_meses, data_aquisicao FROM patrimonios LIMIT 5');
               
               for (const patrimonio of patrimoniosParaDepreciacao) {
                    const dataInicio = new Date(patrimonio.data_aquisicao);
                    const depreciacaoMensal = patrimonio.valor_inicial / patrimonio.vida_util_meses;
                    
                    // Gerar 6 meses de histórico
                    for (let i = 0; i < 6; i++) {
                         const mesAno = new Date(dataInicio.getFullYear(), dataInicio.getMonth() + i, 1);
                         const valorAcumulado = depreciacaoMensal * (i + 1);
                         const valorLiquido = patrimonio.valor_inicial - valorAcumulado;
                         
                         await connection.query(`
                              INSERT IGNORE INTO patrimonio_depreciacoes 
                              (patrimonio_id, mes_ano, valor_inicial, valor_depreciacao_mensal, valor_acumulado, valor_liquido)
                              VALUES (?, ?, ?, ?, ?, ?)
                         `, [
                              patrimonio.id,
                              mesAno.toISOString().split('T')[0],
                              patrimonio.valor_inicial,
                              depreciacaoMensal,
                              valorAcumulado,
                              Math.max(0, valorLiquido)
                         ]);
                    }
               }

               console.log('✅ Histórico de depreciação gerado!');
          } else {
               console.log('ℹ️  Banco de dados já possui dados. Pulando a criação de dados iniciais.');
          }

          console.log('🎉 População do banco de dados concluída com sucesso!');
          console.log('');
          console.log('📋 Resumo:');
          console.log('   • Usuários de teste criados com senha: senha123');
          console.log('   • 3 Departamentos com diferentes categorias');
          console.log('   • Patrimônios com códigos, marcas e modelos');
          console.log('   • Histórico de depreciação automático');
          console.log('   • Estrutura otimizada para relatórios');

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