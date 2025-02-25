// scripts/seed.js
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
               password: process.env.MYSQL_PASSWORD || 'senai',
               multipleStatements: true // Permitir múltiplas queries
          });

          // Criar banco de dados se não existir
          await connection.query('CREATE DATABASE IF NOT EXISTS cybox_db');

          // Usar o banco de dados
          await connection.query('USE cybox_db');

          console.log('Criando tabelas...');

          // Criar tabelas
          const createTablesQuery = `
      -- Tabela de Usuários
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        senha VARCHAR(255),
        google_id VARCHAR(255) UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );

      -- Tabela de Departamentos
      CREATE TABLE IF NOT EXISTS departamentos (
        id_departamentos INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        descricao TEXT,
        totalMembros INT DEFAULT 1,
        maximoMembros INT DEFAULT 10,
        convite VARCHAR(255),
        localizacao VARCHAR(255),
        fotoDepartamento VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Tabela de Relacionamento entre Usuários e Departamentos
      CREATE TABLE IF NOT EXISTS users_departamentos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        id_users VARCHAR(36) NOT NULL,
        id_departamentos INT NOT NULL,
        is_host BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_users) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (id_departamentos) REFERENCES departamentos(id_departamentos) ON DELETE CASCADE,
        UNIQUE KEY unique_user_departamento (id_users, id_departamentos)
      );

      -- Tabela de Convites
      CREATE TABLE IF NOT EXISTS convites (
        id INT AUTO_INCREMENT PRIMARY KEY,
        id_departamentos INT NOT NULL,
        id_remetente VARCHAR(36) NOT NULL,
        id_destinatario VARCHAR(36) NOT NULL,
        status ENUM('pendente', 'aceito', 'recusado') DEFAULT 'pendente',
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_departamentos) REFERENCES departamentos(id_departamentos) ON DELETE CASCADE,
        FOREIGN KEY (id_remetente) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (id_destinatario) REFERENCES users(id) ON DELETE CASCADE
      );

      -- Tabela de Categorias
      CREATE TABLE IF NOT EXISTS categorias (
        id INT AUTO_INCREMENT PRIMARY KEY,
        id_departamento INT NOT NULL,
        nome VARCHAR(255) NOT NULL,
        descricao TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_departamento) REFERENCES departamentos(id_departamentos) ON DELETE CASCADE
      );

      -- Tabela de Patrimônios
      CREATE TABLE IF NOT EXISTS patrimonios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        id_categoria INT NOT NULL,
        nome VARCHAR(255) NOT NULL,
        descricao TEXT,
        valor_inicial DECIMAL(10, 2) NOT NULL,
        valor_atual DECIMAL(10, 2) NOT NULL,
        data_aquisicao DATE NOT NULL,
        tempo_depreciacao INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_categoria) REFERENCES categorias(id) ON DELETE CASCADE
      );
    `;

          await connection.query(createTablesQuery);
          console.log('Tabelas criadas com sucesso!');

          // Verificar se já existem usuários
          const [users] = await connection.query('SELECT COUNT(*) as count FROM users');

          if (users[0].count === 0) {
               console.log('Criando usuários iniciais...');

               // Criar usuários de teste
               const adminId = uuidv4();
               const user1Id = uuidv4();
               const user2Id = uuidv4();

               const hashedPassword = await bcrypt.hash('senha123', 10);

               await connection.query(`
        INSERT INTO users (id, nome, email, senha) VALUES 
        (?, 'Administrador', 'admin@cybox.com', ?),
        (?, 'Usuário Teste', 'usuario@cybox.com', ?),
        (?, 'Desenvolvedora', 'dev@cybox.com', ?)
      `, [adminId, hashedPassword, user1Id, hashedPassword, user2Id, hashedPassword]);

               console.log('Usuários criados com sucesso!');

               // Criar departamentos de teste
               console.log('Criando departamentos iniciais...');

               await connection.query(`
        INSERT INTO departamentos (titulo, descricao, totalMembros, maximoMembros, localizacao) VALUES 
        ('Departamento de TI', 'Gerencia equipamentos de informática', 1, 10, 'Bloco A'),
        ('Departamento Financeiro', 'Controle de ativos financeiros', 1, 5, 'Bloco B'),
        ('Departamento de Marketing', 'Gerencia equipamentos de mídia', 1, 8, 'Bloco C')
      `);

               // Obter IDs dos departamentos
               const [departamentos] = await connection.query('SELECT id_departamentos FROM departamentos');

               // Associar usuários aos departamentos
               console.log('Associando usuários aos departamentos...');

               await connection.query(`
        INSERT INTO users_departamentos (id_users, id_departamentos, is_host) VALUES 
        (?, ?, true),
        (?, ?, true),
        (?, ?, true)
      `, [
                    adminId, departamentos[0].id_departamentos,
                    user1Id, departamentos[1].id_departamentos,
                    user2Id, departamentos[2].id_departamentos
               ]);

               // Criar categorias de exemplo
               console.log('Criando categorias iniciais...');

               await connection.query(`
        INSERT INTO categorias (id_departamento, nome, descricao) VALUES 
        (?, 'Computadores', 'Desktops e notebooks'),
        (?, 'Monitores', 'Monitores e displays'),
        (?, 'Mobiliário', 'Mesas e cadeiras'),
        (?, 'Equipamentos de Áudio', 'Microfones e caixas de som')
      `, [
                    departamentos[0].id_departamentos,
                    departamentos[0].id_departamentos,
                    departamentos[1].id_departamentos,
                    departamentos[2].id_departamentos
               ]);

               // Obter IDs das categorias
               const [categorias] = await connection.query('SELECT id, id_departamento FROM categorias');

               // Criar patrimônios de exemplo
               console.log('Criando patrimônios iniciais...');

               const dataAtual = new Date();

               for (const categoria of categorias) {
                    if (categoria.id_departamento === departamentos[0].id_departamentos) {
                         // Patrimônios para o departamento de TI
                         if (categoria.nome === 'Computadores') {
                              await connection.query(`
              INSERT INTO patrimonios (id_categoria, nome, descricao, valor_inicial, valor_atual, data_aquisicao, tempo_depreciacao) VALUES 
              (?, 'Notebook Dell XPS', 'Notebook i7 16GB RAM', 8000.00, 6400.00, ?, 48),
              (?, 'Desktop Gamer', 'PC com RTX 3070', 12000.00, 9600.00, ?, 60)
            `, [
                                   categoria.id, dataAtual.toISOString().split('T')[0],
                                   categoria.id, dataAtual.toISOString().split('T')[0]
                              ]);
                         } else if (categoria.nome === 'Monitores') {
                              await connection.query(`
              INSERT INTO patrimonios (id_categoria, nome, descricao, valor_inicial, valor_atual, data_aquisicao, tempo_depreciacao) VALUES 
              (?, 'Monitor LG 27"', 'Monitor UltraWide', 2500.00, 2000.00, ?, 36),
              (?, 'Monitor Samsung 32"', 'Monitor 4K', 3200.00, 2560.00, ?, 36)
            `, [
                                   categoria.id, dataAtual.toISOString().split('T')[0],
                                   categoria.id, dataAtual.toISOString().split('T')[0]
                              ]);
                         }
                    } else if (categoria.id_departamento === departamentos[1].id_departamentos) {
                         // Patrimônios para o departamento Financeiro
                         await connection.query(`
            INSERT INTO patrimonios (id_categoria, nome, descricao, valor_inicial, valor_atual, data_aquisicao, tempo_depreciacao) VALUES 
            (?, 'Mesa de Escritório', 'Mesa em L com gavetas', 1200.00, 960.00, ?, 120),
            (?, 'Cadeira Ergonômica', 'Cadeira com apoio lombar', 800.00, 640.00, ?, 60)
          `, [
                              categoria.id, dataAtual.toISOString().split('T')[0],
                              categoria.id, dataAtual.toISOString().split('T')[0]
                         ]);
                    } else if (categoria.id_departamento === departamentos[2].id_departamentos) {
                         // Patrimônios para o departamento de Marketing
                         await connection.query(`
            INSERT INTO patrimonios (id_categoria, nome, descricao, valor_inicial, valor_atual, data_aquisicao, tempo_depreciacao) VALUES 
            (?, 'Microfone Rode', 'Microfone para gravações', 1500.00, 1200.00, ?, 48),
            (?, 'Caixa de Som JBL', 'Caixa amplificada', 2000.00, 1600.00, ?, 36)
          `, [
                              categoria.id, dataAtual.toISOString().split('T')[0],
                              categoria.id, dataAtual.toISOString().split('T')[0]
                         ]);
                    }
               }

               console.log('Patrimônios criados com sucesso!');
          } else {
               console.log('Banco de dados já possui dados. Pulando a criação de dados iniciais.');
          }

          console.log('População do banco de dados concluída com sucesso!');

     } catch (error) {
          console.error('Erro ao configurar o banco de dados:', error);
     } finally {
          if (connection) {
               await connection.end();
          }
     }
}

// Executar o script
seed().catch(console.error);