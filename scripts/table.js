const mysql = require('mysql2/promise');

async function showTableStructure() {
    let connection;
    
    // Pegar o nome da tabela dos argumentos da linha de comando
    const tableName = process.argv[2];
    
    if (!tableName) {
        console.log('❌ Uso: node scripts/table.js <nome_da_tabela>');
        console.log('📝 Exemplo: node scripts/table.js usuarios');
        return;
    }
    
    try {
        // Criar conexão com o banco
        connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST || 'localhost',
            user: process.env.MYSQL_USER || 'root',
            password: process.env.MYSQL_PASSWORD || 'P@ssw0rdF0rte!2025',
            database: process.env.MYSQL_DATABASE || 'cybox'
        });

        console.log('🔗 Conectado ao banco de dados');
        console.log(`📋 Estrutura da tabela: ${tableName}\n`);

        // Executar SHOW CREATE TABLE
        const [result] = await connection.execute(`SHOW CREATE TABLE \`${tableName}\``);
        
        if (result.length === 0) {
            console.log(`❌ Tabela '${tableName}' não encontrada`);
            return;
        }

        const createStatement = result[0]['Create Table'];
        
        // Formatar e exibir o CREATE TABLE
        console.log('🔧 CREATE TABLE Statement:');
        console.log('─'.repeat(80));
        console.log(createStatement);
        console.log('─'.repeat(80));

        // Também mostrar informações das colunas de forma mais legível
        console.log('\n📊 Descrição das colunas:');
        const [columns] = await connection.execute(`DESCRIBE \`${tableName}\``);
        
        console.log('\n┌─────────────────┬─────────────────┬──────┬─────┬─────────┬───────────────┐');
        console.log('│ Campo           │ Tipo            │ Null │ Key │ Default │ Extra         │');
        console.log('├─────────────────┼─────────────────┼──────┼─────┼─────────┼───────────────┤');
        
        columns.forEach(column => {
            const field = (column.Field || '').padEnd(15);
            const type = (column.Type || '').padEnd(15);
            const nullable = (column.Null || '').padEnd(4);
            const key = (column.Key || '').padEnd(3);
            const defaultVal = (column.Default || '').padEnd(7);
            const extra = (column.Extra || '').padEnd(13);
            
            console.log(`│ ${field} │ ${type} │ ${nullable} │ ${key} │ ${defaultVal} │ ${extra} │`);
        });
        
        console.log('└─────────────────┴─────────────────┴──────┴─────┴─────────┴───────────────┘');

    } catch (error) {
        if (error.code === 'ER_NO_SUCH_TABLE') {
            console.error(`❌ Tabela '${tableName}' não existe`);
        } else {
            console.error('❌ Erro ao executar query:', error.message);
        }
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n🔌 Conexão fechada');
        }
    }
}

showTableStructure();