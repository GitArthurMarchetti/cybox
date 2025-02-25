// lib/mysql.ts
import mysql from 'mysql2/promise';

// Configuração da conexão com o MySQL
export async function getConnection() {
     try {
          const connection = await mysql.createConnection({
               host: process.env.MYSQL_HOST,
               user: process.env.MYSQL_USER,
               password: process.env.MYSQL_PASSWORD,
               database: process.env.MYSQL_DATABASE
          });

          return connection;
     } catch (error) {
          console.error('Erro ao conectar com o MySQL:', error);
          throw error;
     }
}

// Pool de conexões para melhor performance
const pool = mysql.createPool({
     host: process.env.MYSQL_HOST,
     user: process.env.MYSQL_USER,
     password: process.env.MYSQL_PASSWORD,
     database: process.env.MYSQL_DATABASE,
     waitForConnections: true,
     connectionLimit: 10,
     queueLimit: 0
});

export async function query(sql: string, params: any[] = []) {
     try {
          const [rows, fields] = await pool.execute(sql, params);
          return rows;
     } catch (error) {
          console.error('Erro ao executar query:', error);
          throw error;
     }
}