// scripts/db.js
// Conexão compartilhada pelos scripts de banco. Lê .env.local (se existir) ou .env.
const path = require('path');
const fs = require('fs');
const readline = require('readline');

const envLocalPath = path.resolve(__dirname, '../.env.local');
const envPath = path.resolve(__dirname, '../.env');
const envFile = fs.existsSync(envLocalPath) ? envLocalPath : envPath;

require('dotenv').config({ path: envFile, override: true, quiet: true });
const mysql = require('mysql2/promise');

function sslConfig() {
     if (process.env.MYSQL_SSL_CA) {
          return { ca: process.env.MYSQL_SSL_CA.replace(/\\n/g, '\n') };
     }

     const isRemote = process.env.MYSQL_HOST && process.env.MYSQL_HOST.includes('digitalocean');
     return isRemote ? { rejectUnauthorized: false } : undefined;
}

function dbTarget() {
     return {
          host: process.env.MYSQL_HOST,
          port: parseInt(process.env.MYSQL_PORT || '25060'),
          database: process.env.MYSQL_DATABASE || 'cybox',
     };
}

async function connect(options = {}) {
     const missing = ['MYSQL_HOST', 'MYSQL_USER', 'MYSQL_PASSWORD'].filter(name => !process.env[name]);
     if (missing.length > 0) {
          throw new Error(`Variáveis ausentes em ${envFile}: ${missing.join(', ')}`);
     }

     const ssl = sslConfig();

     return mysql.createConnection({
          ...dbTarget(),
          user: process.env.MYSQL_USER,
          password: process.env.MYSQL_PASSWORD,
          connectTimeout: 60000,
          ...(ssl && { ssl }),
          ...options,
     });
}

async function confirmar(pergunta, respostaEsperada) {
     const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
     const resposta = await new Promise(resolve => rl.question(pergunta, resolve));
     rl.close();
     return resposta.trim() === respostaEsperada;
}

module.exports = { connect, dbTarget, confirmar, envFile };
