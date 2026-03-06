// Aquí irá la configuración de la base de datos
// Por ejemplo, para PostgreSQL con pg o Sequelize
// O para MongoDB con Mongoose

export const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'adrenalina_extrema',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
};

// Ejemplo de conexión (descomentar según tu elección de DB)
/*
import pg from 'pg';
const { Pool } = pg;

export const pool = new Pool(dbConfig);

pool.on('connect', () => {
  console.log('Conectado a la base de datos');
});
*/
