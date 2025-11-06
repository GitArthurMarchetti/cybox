const mysql = require('mysql2/promise');

async function showTables() {
    let connection;
    
    try {
        // Criar conexão com o banco
        connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST || 'localhost',
            user: process.env.MYSQL_USER || 'root',
            password: process.env.MYSQL_PASSWORD || 'P@ssw0rdF0rte!2025',
            database: process.env.MYSQL_DATABASE || 'cybox'
        });

        console.log('🔗 Conectado ao banco de dados');
        console.log('📋 Listando todas as tabelas:\n');

        // Executar SHOW TABLES
        const [tables] = await connection.execute('SHOW TABLES');
        
        if (tables.length === 0) {
            console.log('❌ Nenhuma tabela encontrada no banco de dados');
            return;
        }

        tables.forEach((table, index) => {
            const tableName = Object.values(table)[0];
            console.log(`${index + 1}. ${tableName}`);
        });

        console.log(`\n✅ Total: ${tables.length} tabela(s) encontrada(s)`);

    } catch (error) {
        console.error('❌ Erro ao conectar ou executar query:', error.message);
    } finally {
        if (connection) {
            await connection.end();
            console.log('🔌 Conexão fechada');
        }
    }
}

showTables();