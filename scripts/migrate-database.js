const mysql = require('mysql2/promise');

async function migrateDatabase() {
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
        console.log('🔧 Iniciando migração da estrutura do banco...\n');

        // 1. Criar tabela de padrões de depreciação (baseada na Receita Federal)
        console.log('📊 Criando tabela de padrões de depreciação...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS padroes_depreciacao (
                id INT AUTO_INCREMENT PRIMARY KEY,
                categoria VARCHAR(255) NOT NULL UNIQUE,
                descricao TEXT,
                taxa_anual_percent DECIMAL(5,2) NOT NULL,
                vida_util_anos INT NOT NULL,
                observacoes TEXT,
                ativo BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                
                INDEX idx_categoria (categoria),
                INDEX idx_ativo (ativo)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);

        // Inserir padrões da Receita Federal
        await connection.query(`
            INSERT IGNORE INTO padroes_depreciacao (categoria, descricao, taxa_anual_percent, vida_util_anos, observacoes) VALUES
            ('Computadores e Periféricos', 'Equipamentos de processamento de dados, notebooks, desktops, impressoras', 20.00, 5, 'Conforme Instrução Normativa RFB nº 1700/2017'),
            ('Móveis e Utensílios', 'Mesas, cadeiras, armários, estantes', 10.00, 10, 'Móveis em geral para escritório'),
            ('Veículos', 'Automóveis, caminhões, motocicletas', 20.00, 5, 'Veículos de transporte em geral'),
            ('Máquinas e Equipamentos', 'Equipamentos industriais e comerciais', 10.00, 10, 'Máquinas e equipamentos diversos'),
            ('Equipamentos de Comunicação', 'Telefones, rádios, equipamentos de rede', 20.00, 5, 'Equipamentos de telecomunicações'),
            ('Equipamentos de Áudio e Vídeo', 'Câmeras, microfones, sistemas de som', 20.00, 5, 'Equipamentos de produção audiovisual'),
            ('Instalações', 'Ar condicionado, sistemas elétricos', 10.00, 10, 'Instalações prediais'),
            ('Ferramentas', 'Ferramentas em geral', 15.00, 6, 'Ferramentas e utensílios diversos')
        `);

        // 2. Criar tabela de gastos
        console.log('💰 Criando tabela de gastos...');
        await connection.query(`
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
                
                INDEX idx_patrimonio_data (patrimonio_id, data_gasto),
                INDEX idx_tipo (tipo),
                INDEX idx_status (status),
                INDEX idx_usuario (usuario_id),
                INDEX idx_patrimonio (patrimonio_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);

        // Adicionar foreign keys separadamente se a tabela foi criada
        const [gastosExists] = await connection.query(`
            SELECT COUNT(*) as count FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
            WHERE TABLE_SCHEMA = 'cybox' AND TABLE_NAME = 'gastos' AND CONSTRAINT_TYPE = 'FOREIGN KEY'
        `);
        
        if (gastosExists[0].count === 0) {
            try {
                await connection.query(`
                    ALTER TABLE gastos 
                    ADD CONSTRAINT fk_gastos_patrimonio 
                    FOREIGN KEY (patrimonio_id) REFERENCES patrimonios(id) ON DELETE CASCADE
                `);
                await connection.query(`
                    ALTER TABLE gastos 
                    ADD CONSTRAINT fk_gastos_usuario 
                    FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE
                `);
                console.log('  ✅ Foreign keys adicionadas');
            } catch (fkError) {
                console.log('  ⚠️ Aviso: Não foi possível adicionar foreign keys:', fkError.message);
            }
        }

        // 3. Criar tabela de notificações
        console.log('🔔 Criando tabela de notificações...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS notificacoes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                usuario_id VARCHAR(36) NOT NULL,
                titulo VARCHAR(255) NOT NULL,
                mensagem TEXT NOT NULL,
                tipo ENUM('info', 'warning', 'success', 'error', 'depreciacao', 'manutencao', 'vencimento', 'convite') NOT NULL,
                lida BOOLEAN DEFAULT FALSE,
                acao_url VARCHAR(500),
                acao_texto VARCHAR(100),
                data_expiracao TIMESTAMP NULL,
                metadados JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                
                INDEX idx_usuario_lida (usuario_id, lida),
                INDEX idx_tipo (tipo),
                INDEX idx_data_expiracao (data_expiracao)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);

        // Adicionar foreign key para notificações separadamente
        const [notifExists] = await connection.query(`
            SELECT COUNT(*) as count FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
            WHERE TABLE_SCHEMA = 'cybox' AND TABLE_NAME = 'notificacoes' AND CONSTRAINT_TYPE = 'FOREIGN KEY'
        `);
        
        if (notifExists[0].count === 0) {
            try {
                await connection.query(`
                    ALTER TABLE notificacoes 
                    ADD CONSTRAINT fk_notificacoes_usuario 
                    FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE
                `);
                console.log('  ✅ Foreign key adicionada');
            } catch (fkError) {
                console.log('  ⚠️ Aviso: Não foi possível adicionar foreign key:', fkError.message);
            }
        }

        // 4. Alterar tabela departamentos - remover totalMembros e adicionar campos necessários
        console.log('🏢 Alterando tabela departamentos...');
        
        // Verificar se as colunas existem antes de tentar remover
        const [deptColumns] = await connection.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'cybox' AND TABLE_NAME = 'departamentos'
        `);
        
        const deptColumnNames = deptColumns.map(col => col.COLUMN_NAME);
        
        if (deptColumnNames.includes('totalMembros')) {
            await connection.query('ALTER TABLE departamentos DROP COLUMN totalMembros');
            console.log('  ✅ Removida coluna totalMembros');
        }
        
        // Adicionar código de convite se não existir
        if (!deptColumnNames.includes('codigo_convite')) {
            await connection.query('ALTER TABLE departamentos ADD COLUMN codigo_convite VARCHAR(255) UNIQUE AFTER convite');
            console.log('  ✅ Adicionada coluna codigo_convite');
        }

        // Adicionar status se não existir
        if (!deptColumnNames.includes('status')) {
            await connection.query(`ALTER TABLE departamentos ADD COLUMN status ENUM('ativo', 'inativo', 'deletado') DEFAULT 'ativo' AFTER fotoDepartamento`);
            console.log('  ✅ Adicionada coluna status');
        }

        // Adicionar updated_at se não existir
        if (!deptColumnNames.includes('updated_at')) {
            await connection.query('ALTER TABLE departamentos ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at');
            console.log('  ✅ Adicionada coluna updated_at');
        }

        // 5. Alterar tabela users_departamentos - trocar is_host por role
        console.log('👥 Alterando tabela users_departamentos...');
        
        const [userDeptColumns] = await connection.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'cybox' AND TABLE_NAME = 'users_departamentos'
        `);
        
        const userDeptColumnNames = userDeptColumns.map(col => col.COLUMN_NAME);
        
        if (userDeptColumnNames.includes('is_host') && !userDeptColumnNames.includes('role')) {
            // Adicionar nova coluna role
            await connection.query(`
                ALTER TABLE users_departamentos 
                ADD COLUMN role ENUM('member', 'admin', 'owner') DEFAULT 'member' AFTER id_departamentos
            `);
            
            // Migrar dados: is_host = true vira 'owner', false vira 'member'
            await connection.query(`
                UPDATE users_departamentos 
                SET role = CASE 
                    WHEN is_host = 1 THEN 'owner' 
                    ELSE 'member' 
                END
            `);
            
            // Remover coluna antiga
            await connection.query('ALTER TABLE users_departamentos DROP COLUMN is_host');
            console.log('  ✅ Substituída coluna is_host por role');
        }

        // Adicionar status se não existir
        if (!userDeptColumnNames.includes('status')) {
            await connection.query(`ALTER TABLE users_departamentos ADD COLUMN status ENUM('ativo', 'inativo', 'deletado') DEFAULT 'ativo' AFTER role`);
            console.log('  ✅ Adicionada coluna status');
        }

        // Adicionar updated_at se não existir
        if (!userDeptColumnNames.includes('updated_at')) {
            await connection.query('ALTER TABLE users_departamentos ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at');
            console.log('  ✅ Adicionada coluna updated_at');
        }

        // 6. Alterar tabela categorias - adicionar valor padrão de depreciação e status
        console.log('📂 Alterando tabela categorias...');
        
        const [catColumns] = await connection.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'cybox' AND TABLE_NAME = 'categorias'
        `);
        
        const catColumnNames = catColumns.map(col => col.COLUMN_NAME);
        
        if (!catColumnNames.includes('padrao_depreciacao_id')) {
            await connection.query(`
                ALTER TABLE categorias 
                ADD COLUMN padrao_depreciacao_id INT AFTER descricao,
                ADD FOREIGN KEY (padrao_depreciacao_id) REFERENCES padroes_depreciacao(id) ON DELETE SET NULL
            `);
            console.log('  ✅ Adicionada referência para padrão de depreciação');
        }

        // Adicionar status se não existir
        if (!catColumnNames.includes('status')) {
            await connection.query(`ALTER TABLE categorias ADD COLUMN status ENUM('ativo', 'inativo', 'deletado') DEFAULT 'ativo' AFTER padrao_depreciacao_id`);
            console.log('  ✅ Adicionada coluna status');
        }

        // Adicionar updated_at se não existir
        if (!catColumnNames.includes('updated_at')) {
            await connection.query('ALTER TABLE categorias ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at');
            console.log('  ✅ Adicionada coluna updated_at');
        }

        // 7. Alterar tabela convites - adicionar codigo_convite e outros campos
        console.log('✉️ Alterando tabela convites...');
        
        const [conviteColumns] = await connection.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'cybox' AND TABLE_NAME = 'convites'
        `);
        
        const conviteColumnNames = conviteColumns.map(col => col.COLUMN_NAME);
        
        if (!conviteColumnNames.includes('codigo_convite')) {
            await connection.query(`
                ALTER TABLE convites 
                ADD COLUMN codigo_convite VARCHAR(255) UNIQUE AFTER status,
                ADD COLUMN data_expiracao TIMESTAMP AFTER codigo_convite
            `);
            console.log('  ✅ Adicionadas colunas codigo_convite e data_expiracao');
        }

        // Adicionar updated_at se não existir
        if (!conviteColumnNames.includes('updated_at')) {
            await connection.query('ALTER TABLE convites ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER criado_em');
            console.log('  ✅ Adicionada coluna updated_at');
        }

        // 8. Alterar tabela patrimonios - adicionar status e campos de soft delete
        console.log('💼 Alterando tabela patrimonios...');
        
        const [patrimonioColumns] = await connection.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'cybox' AND TABLE_NAME = 'patrimonios'
        `);
        
        const patrimonioColumnNames = patrimonioColumns.map(col => col.COLUMN_NAME);
        
        // Adicionar status se não existir
        if (!patrimonioColumnNames.includes('status')) {
            await connection.query(`ALTER TABLE patrimonios ADD COLUMN status ENUM('ativo', 'inativo', 'manutencao', 'baixado', 'deletado') DEFAULT 'ativo' AFTER tempo_depreciacao`);
            console.log('  ✅ Adicionada coluna status');
        }

        // Adicionar updated_at se não existir
        if (!patrimonioColumnNames.includes('updated_at')) {
            await connection.query('ALTER TABLE patrimonios ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at');
            console.log('  ✅ Adicionada coluna updated_at');
        }

        // 9. Alterar tabela users - adicionar status e campos de soft delete
        console.log('👤 Alterando tabela users...');
        
        const [userColumns] = await connection.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'cybox' AND TABLE_NAME = 'users'
        `);
        
        const userColumnNames = userColumns.map(col => col.COLUMN_NAME);
        
        // Adicionar status se não existir
        if (!userColumnNames.includes('status')) {
            await connection.query(`ALTER TABLE users ADD COLUMN status ENUM('ativo', 'inativo', 'suspenso', 'deletado') DEFAULT 'ativo' AFTER google_id`);
            console.log('  ✅ Adicionada coluna status');
        }

        // 10. Atualizar existing data com códigos de convite e status
        console.log('🔄 Atualizando dados existentes...');
        
        // Gerar códigos de convite para departamentos existentes
        const [departamentos] = await connection.query('SELECT id_departamentos FROM departamentos WHERE codigo_convite IS NULL');
        for (const dept of departamentos) {
            const codigo = `DEPT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
            await connection.query('UPDATE departamentos SET codigo_convite = ? WHERE id_departamentos = ?', [codigo, dept.id_departamentos]);
        }
        
        // Definir padrões de depreciação para categorias existentes
        await connection.query(`
            UPDATE categorias 
            SET padrao_depreciacao_id = (
                SELECT id FROM padroes_depreciacao 
                WHERE categoria = 'Computadores e Periféricos' 
                LIMIT 1
            )
            WHERE LOWER(nome) LIKE '%computador%' OR LOWER(nome) LIKE '%notebook%' OR LOWER(nome) LIKE '%monitor%'
            AND padrao_depreciacao_id IS NULL
        `);
        
        await connection.query(`
            UPDATE categorias 
            SET padrao_depreciacao_id = (
                SELECT id FROM padroes_depreciacao 
                WHERE categoria = 'Móveis e Utensílios' 
                LIMIT 1
            )
            WHERE LOWER(nome) LIKE '%mobili%' OR LOWER(nome) LIKE '%mesa%' OR LOWER(nome) LIKE '%cadeira%'
            AND padrao_depreciacao_id IS NULL
        `);
        
        await connection.query(`
            UPDATE categorias 
            SET padrao_depreciacao_id = (
                SELECT id FROM padroes_depreciacao 
                WHERE categoria = 'Equipamentos de Áudio e Vídeo' 
                LIMIT 1
            )
            WHERE LOWER(nome) LIKE '%audio%' OR LOWER(nome) LIKE '%video%' OR LOWER(nome) LIKE '%som%'
            AND padrao_depreciacao_id IS NULL
        `);

        // Garantir que todos os registros existentes tenham status = 'ativo'
        await connection.query(`UPDATE users SET status = 'ativo' WHERE status IS NULL`);
        await connection.query(`UPDATE departamentos SET status = 'ativo' WHERE status IS NULL`);
        await connection.query(`UPDATE users_departamentos SET status = 'ativo' WHERE status IS NULL`);
        await connection.query(`UPDATE categorias SET status = 'ativo' WHERE status IS NULL`);
        await connection.query(`UPDATE patrimonios SET status = 'ativo' WHERE status IS NULL`);

        console.log('✅ Migração concluída com sucesso!\n');
        console.log('📋 Resumo das alterações:');
        console.log('  • ✅ Criada tabela padroes_depreciacao com dados da Receita Federal');
        console.log('  • ✅ Criada tabela gastos para controle de custos por patrimônio');
        console.log('  • ✅ Criada tabela notificacoes para sistema de notificações');
        console.log('  • ✅ Removido totalMembros de departamentos (será calculado)');
        console.log('  • ✅ Adicionado codigo_convite em departamentos');
        console.log('  • ✅ Substituído is_host por role em users_departamentos');
        console.log('  • ✅ Adicionado padrao_depreciacao_id em categorias');
        console.log('  • ✅ Melhorado sistema de convites com expiração');
        console.log('  • ✅ Adicionado campos de status para soft delete em todas as tabelas');
        console.log('  • ✅ Adicionado campos updated_at para auditoria');
        console.log('  • ✅ Dados existentes atualizados com valores padrão');
        console.log('');
        console.log('🔧 Soft Delete implementado:');
        console.log('  • users: ativo, inativo, suspenso, deletado');
        console.log('  • departamentos: ativo, inativo, deletado');
        console.log('  • users_departamentos: ativo, inativo, deletado');
        console.log('  • categorias: ativo, inativo, deletado');
        console.log('  • patrimonios: ativo, inativo, manutencao, baixado, deletado');

    } catch (error) {
        console.error('❌ Erro durante a migração:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n🔌 Conexão fechada');
        }
    }
}

migrateDatabase();