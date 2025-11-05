import mysql from 'mysql2/promise';

const isRemote = process.env.MYSQL_HOST && process.env.MYSQL_HOST.includes('digitalocean');

const dbConfig = {
     host: process.env.MYSQL_HOST,
     user: process.env.MYSQL_USER,
     password: process.env.MYSQL_PASSWORD,
     database: process.env.MYSQL_DATABASE,
     port: parseInt(process.env.MYSQL_PORT || '25060'),
     ...(isRemote && {
          ssl: {
               rejectUnauthorized: false
          }
     })
};

export async function getConnection() {
     try {
          const connection = await mysql.createConnection(dbConfig);
          return connection;
     } catch (error) {
          console.error('Erro ao conectar com o MySQL:', error);
          throw error;
     }
}

const pool = mysql.createPool({
     ...dbConfig,
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