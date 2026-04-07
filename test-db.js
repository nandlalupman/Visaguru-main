const mysql = require('mysql2/promise');

async function createDB() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
  });
  
  await conn.execute("CREATE DATABASE IF NOT EXISTS visaguru_db");
  console.log('visaguru_db created!');
  
  const [dbs] = await conn.execute("SHOW DATABASES LIKE 'visaguru_db'");
  console.log('Verified:', dbs);
  
  await conn.end();
}

createDB();
