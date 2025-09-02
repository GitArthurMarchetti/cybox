const mysql = require('mysql2/promise');

async function resetDatabase() {
    let connection;
    
    try {
        // Criar conexão com o banco
        connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST || 'localhost',
            user: process.env.MYSQL_USER || 'root',
            password: process.env.MYSQL_PASSWORD || 'duduborges22',
            database: process.env.MYSQL_DATABASE || 'cybox',
            multipleStatements: true
        });

        console.log('🔗 Conectado ao banco de dados');
        console.log('🗑️ Removendo todas as tabelas existentes...\n');

        // Desabilitar verificações de foreign key temporariamente
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');

        // Obter lista de todas as tabelas
        const [tables] = await connection.query(`
            SELECT TABLE_NAME as table_name
            FROM information_schema.tables 
            WHERE table_schema = 'cybox'
        `);

        // Dropar todas as tabelas
        for (const table of tables) {
            console.log(`  🗑️ Dropando tabela: ${table.table_name}`);
            await connection.query(`DROP TABLE IF EXISTS ${table.table_name}`);
        }

        // Reabilitar verificações de foreign key
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');

        console.log('\n✅ Todas as tabelas foram removidas!');
        console.log('🔧 Criando nova estrutura do banco...\n');

        // Criar nova estrutura
        await createNewDatabaseStructure(connection);

        console.log('\n🎉 Reset do banco de dados concluído com sucesso!');

    } catch (error) {
        console.error('❌ Erro durante o reset:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n🔌 Conexão fechada');
        }
    }
}

async function createNewDatabaseStructure(connection) {
    // 1. Tabela de usuários
    console.log('👤 Criando tabela users...');
    await connection.query(`
        CREATE TABLE users (
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
    `);

    // 2. Tabela de padrões de depreciação
    console.log('📊 Criando tabela padroes_depreciacao...');
    await connection.query(`
        CREATE TABLE padroes_depreciacao (
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
    `);

    // Inserir padrões da Receita Federal
    await connection.query(`
        INSERT INTO padroes_depreciacao (categoria, descricao, taxa_anual_percent, vida_util_anos, observacoes) VALUES
        ('Computadores e Periféricos', 'Equipamentos de processamento de dados, notebooks, desktops, impressoras', 20.00, 5, 'Conforme Instrução Normativa RFB nº 1700/2017'),
        ('Móveis e Utensílios', 'Mesas, cadeiras, armários, estantes', 10.00, 10, 'Móveis em geral para escritório'),
        ('Veículos', 'Automóveis, caminhões, motocicletas', 20.00, 5, 'Veículos de transporte em geral'),
        ('Máquinas e Equipamentos', 'Equipamentos industriais e comerciais', 10.00, 10, 'Máquinas e equipamentos diversos'),
        ('Equipamentos de Comunicação', 'Telefones, rádios, equipamentos de rede', 20.00, 5, 'Equipamentos de telecomunicações'),
        ('Equipamentos de Áudio e Vídeo', 'Câmeras, microfones, sistemas de som', 20.00, 5, 'Equipamentos de produção audiovisual'),
        ('Instalações', 'Ar condicionado, sistemas elétricos', 10.00, 10, 'Instalações prediais'),
        ('Ferramentas', 'Ferramentas em geral', 15.00, 6, 'Ferramentas e utensílios diversos')
    `);

    // 3. Tabela de departamentos
    console.log('🏢 Criando tabela departamentos...');
    await connection.query(`
        CREATE TABLE departamentos (
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
    `);

    // 4. Tabela de relacionamento usuários-departamentos
    console.log('👥 Criando tabela users_departamentos...');
    await connection.query(`
        CREATE TABLE users_departamentos (
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
    `);

    // 5. Tabela de convites
    console.log('✉️ Criando tabela convites...');
    await connection.query(`
        CREATE TABLE convites (
            id INT AUTO_INCREMENT PRIMARY KEY,
            id_departamentos INT NOT NULL,
            id_remetente VARCHAR(36) NOT NULL,
            id_destinatario VARCHAR(36) NOT NULL,
            status ENUM('pendente', 'aceito', 'recusado') DEFAULT 'pendente',
            codigo_convite VARCHAR(255) UNIQUE,
            data_expiracao TIMESTAMP NULL,
            criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            
            FOREIGN KEY (id_departamentos) REFERENCES departamentos(id_departamentos) ON DELETE CASCADE,
            FOREIGN KEY (id_remetente) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (id_destinatario) REFERENCES users(id) ON DELETE CASCADE,
            INDEX idx_status (status),
            INDEX idx_codigo_convite (codigo_convite)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 6. Tabela de categorias
    console.log('📂 Criando tabela categorias...');
    await connection.query(`
        CREATE TABLE categorias (
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
    `);

    // 7. Tabela de patrimônios
    console.log('💼 Criando tabela patrimonios...');
    await connection.query(`
        CREATE TABLE patrimonios (
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
    `);

    // 8. Tabela de gastos
    console.log('💰 Criando tabela gastos...');
    await connection.query(`
        CREATE TABLE gastos (
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
    `);

    // 9. Tabela de convites externos
    console.log('📧 Criando tabela convites_externos...');
    await connection.query(`
        CREATE TABLE convites_externos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            id_departamentos INT NOT NULL,
            id_remetente VARCHAR(255) NOT NULL,
            email_destinatario VARCHAR(255) NOT NULL,
            codigo_convite VARCHAR(50) UNIQUE NOT NULL,
            data_expiracao DATETIME NOT NULL,
            status ENUM('pendente', 'aceito', 'recusado', 'expirado') DEFAULT 'pendente',
            criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            
            FOREIGN KEY (id_departamentos) REFERENCES departamentos(id_departamentos) ON DELETE CASCADE,
            INDEX idx_codigo_convite (codigo_convite),
            INDEX idx_email_destinatario (email_destinatario),
            INDEX idx_status (status)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 10. Tabela de notificações
    console.log('🔔 Criando tabela notificacoes...');
    await connection.query(`
        CREATE TABLE notificacoes (
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
    `);

    console.log('✅ Nova estrutura do banco criada com sucesso!');
}

resetDatabase();