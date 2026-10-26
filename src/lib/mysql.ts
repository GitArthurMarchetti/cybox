import mysql from 'mysql2/promise';

function sslConfig() {
     if (process.env.MYSQL_SSL_CA) {
          return { ca: process.env.MYSQL_SSL_CA.replace(/\\n/g, '\n') };
     }

     const isRemote = process.env.MYSQL_HOST && process.env.MYSQL_HOST.includes('digitalocean');
     return isRemote ? { rejectUnauthorized: false } : undefined;
}

const ssl = sslConfig();

const dbConfig = {
     host: process.env.MYSQL_HOST,
     user: process.env.MYSQL_USER,
     password: process.env.MYSQL_PASSWORD,
     database: process.env.MYSQL_DATABASE,
     port: parseInt(process.env.MYSQL_PORT || '25060'),
     ...(ssl && { ssl })
};

const pool = mysql.createPool({
     ...dbConfig,
     waitForConnections: true,
     connectionLimit: 10,
     queueLimit: 0,
     decimalNumbers: true
});

type Executor = (sql: string, params?: (string | number | boolean | null)[]) => Promise<unknown>;

// Executa várias queries de forma atômica: se alguma falhar, nada é gravado.
export async function transaction<T>(fn: (executar: Executor) => Promise<T>): Promise<T> {
     const connection = await pool.getConnection();
     try {
          await connection.beginTransaction();
          const resultado = await fn(async (sql, params = []) => {
               const [rows] = await connection.execute(sql, params);
               return rows;
          });
          await connection.commit();
          return resultado;
     } catch (error) {
          await connection.rollback();
          throw error;
     } finally {
          connection.release();
     }
}

export async function query(sql: string, params: (string | number | boolean | null)[] = []) {
     try {
          const [rows] = await pool.execute(sql, params);
          return rows;
     } catch (error) {
          console.error('Erro ao executar query:', error);
          throw error;
     }
}