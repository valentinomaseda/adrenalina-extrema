// Script para corregir la clave primaria de alumno_rutina
import mysql from 'mysql2/promise';
import { dbConfig } from './config/database.js';

async function fixAlumnoRutinaPK() {
  let connection;
  
  try {
    // Crear conexión
    connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database
    });

    console.log('✓ Conectado a MySQL');

    // Paso 1: Eliminar duplicados (mantener solo el más reciente)
    console.log('Paso 1: Eliminando duplicados...');
    const [deleteResult] = await connection.query(`
      DELETE t1 FROM alumno_rutina t1
      INNER JOIN alumno_rutina t2 
      WHERE t1.idPersona = t2.idPersona 
        AND t1.idRutina = t2.idRutina 
        AND t1.fechaAsignacion < t2.fechaAsignacion
    `);
    console.log('✓ Duplicados eliminados: ' + deleteResult.affectedRows);

    // Paso 2: Eliminar las foreign keys temporalmente
    console.log('Paso 2: Eliminando foreign keys temporalmente...');
    await connection.query('ALTER TABLE alumno_rutina DROP FOREIGN KEY fk_alumno_rutina_alumno');
    await connection.query('ALTER TABLE alumno_rutina DROP FOREIGN KEY fk_alumno_rutina_rutina');
    console.log('✓ Foreign keys eliminadas');

    // Paso 3: Eliminar la clave primaria actual
    console.log('Paso 3: Eliminando clave primaria actual...');
    await connection.query('ALTER TABLE alumno_rutina DROP PRIMARY KEY');
    console.log('✓ Clave primaria eliminada');

    // Paso 4: Crear nueva clave primaria sin fechaAsignacion
    console.log('Paso 4: Creando nueva clave primaria (idPersona, idRutina)...');
    await connection.query('ALTER TABLE alumno_rutina ADD PRIMARY KEY (idPersona, idRutina)');
    console.log('✓ Nueva clave primaria creada');

    // Paso 5: Recrear las foreign keys
    console.log('Paso 5: Recreando foreign keys...');
    await connection.query(`
      ALTER TABLE alumno_rutina 
      ADD CONSTRAINT fk_alumno_rutina_alumno 
      FOREIGN KEY (idPersona) REFERENCES persona (idPersona) 
      ON DELETE RESTRICT ON UPDATE CASCADE
    `);
    await connection.query(`
      ALTER TABLE alumno_rutina 
      ADD CONSTRAINT fk_alumno_rutina_rutina 
      FOREIGN KEY (idRutina) REFERENCES rutina (idRutina) 
      ON DELETE RESTRICT ON UPDATE CASCADE
    `);
    console.log('✓ Foreign keys recreadas');

    // Paso 6: Verificar que no hay duplicados
    console.log('Paso 6: Verificando integridad...');
    const [duplicates] = await connection.query(`
      SELECT idPersona, idRutina, COUNT(*) as cantidad
      FROM alumno_rutina
      GROUP BY idPersona, idRutina
      HAVING cantidad > 1
    `);
    
    if (duplicates.length === 0) {
      console.log('✓ No hay duplicados. Base de datos corregida exitosamente.');
    } else {
      console.log('⚠ Atención: Se encontraron duplicados restantes:', duplicates);
    }

    // Mostrar estructura final
    const [structure] = await connection.query('DESCRIBE alumno_rutina');
    console.log('\n✓ Estructura final de alumno_rutina:');
    console.table(structure);

  } catch (error) {
    console.error('✗ Error:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n✓ Conexión cerrada');
    }
  }
}

// Ejecutar
fixAlumnoRutinaPK()
  .then(() => {
    console.log('\n✓ Migración completada exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n✗ Falló la migración:', error);
    process.exit(1);
  });
