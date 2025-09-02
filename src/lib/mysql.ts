import mysql from 'mysql2/promise';
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

const pool = mysql.createPool({
     host: process.env.MYSQL_HOST,
     user: process.env.MYSQL_USER,
     password: process.env.MYSQL_PASSWORD,
     database: process.env.MYSQL_DATABASE,
     waitForConnections: true,
     connectionLimit: 10,
     queueLimit: 0
});

export async function query(sql: string, params: (string | number | boolean | null)[] = []) {
     try {
          const [rows, fields] = await pool.execute(sql, params);
          return rows;
     } catch (error) {
          console.error('Erro ao executar query:', error);
          throw error;
     }
}