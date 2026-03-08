// Script para generar hash de password y agregar 20 alumnos
// Ejecutar con: node agregar-20-alumnos.js

import bcrypt from 'bcrypt';
import { pool } from './config/database.js';

const SALT_ROUNDS = 10;

const alumnos = [
  { nombre: 'Juan Pérez', mail: 'juan.perez@gmail.com', tel: '1122334455', fechaNac: '1990-05-15', peso: 75, altura: 175, nivel: 'Avanzado', genero: 'masculino', direccion: 'Av. Corrientes 1234' },
  { nombre: 'María González', mail: 'maria.gonzalez@gmail.com', tel: '1123344556', fechaNac: '1992-08-22', peso: 58, altura: 165, nivel: 'Intermedio', genero: 'femenino', direccion: 'Av. Rivadavia 567' },
  { nombre: 'Pedro Rodríguez', mail: 'pedro.rodriguez@gmail.com', tel: '1134455667', fechaNac: '1988-03-10', peso: 82, altura: 180, nivel: 'Principiante', genero: 'masculino', direccion: 'Calle Falsa 123' },
  { nombre: 'Ana Martínez', mail: 'ana.martinez@gmail.com', tel: '1145566778', fechaNac: '1995-11-30', peso: 62, altura: 168, nivel: 'Avanzado', genero: 'femenino', direccion: 'San Martín 890' },
  { nombre: 'Lucas Fernández', mail: 'lucas.fernandez@gmail.com', tel: '1156677889', fechaNac: '1991-07-18', peso: 78, altura: 177, nivel: 'Intermedio', genero: 'masculino', direccion: 'Belgrano 456' },
  { nombre: 'Sofía Romero', mail: 'sofia.romero@gmail.com', tel: '1167788990', fechaNac: '1993-02-14', peso: 55, altura: 162, nivel: 'Principiante', genero: 'femenino', direccion: 'Sarmiento 234' },
  { nombre: 'Diego Suárez', mail: 'diego.suarez@gmail.com', tel: '1178899001', fechaNac: '1989-09-25', peso: 85, altura: 182, nivel: 'Avanzado', genero: 'masculino', direccion: 'Mitre 678' },
  { nombre: 'Valentina Torres', mail: 'valentina.torres@gmail.com', tel: '1189900112', fechaNac: '1994-12-08', peso: 60, altura: 166, nivel: 'Intermedio', genero: 'femenino', direccion: 'Alsina 345' },
  { nombre: 'Sebastián Díaz', mail: 'sebastian.diaz@gmail.com', tel: '1190011223', fechaNac: '1987-04-20', peso: 80, altura: 179, nivel: 'Principiante', genero: 'masculino', direccion: 'Moreno 789' },
  { nombre: 'Camila Ruiz', mail: 'camila.ruiz@gmail.com', tel: '1101122334', fechaNac: '1996-06-12', peso: 57, altura: 164, nivel: 'Avanzado', genero: 'femenino', direccion: 'Lavalle 123' },
  { nombre: 'Martín Giménez', mail: 'martin.gimenez@gmail.com', tel: '1112233445', fechaNac: '1990-01-28', peso: 76, altura: 176, nivel: 'Intermedio', genero: 'masculino', direccion: 'Tucumán 456' },
  { nombre: 'Florencia Castro', mail: 'florencia.castro@gmail.com', tel: '1123344556', fechaNac: '1992-10-05', peso: 59, altura: 167, nivel: 'Principiante', genero: 'femenino', direccion: 'Córdoba 890' },
  { nombre: 'Nicolás Vargas', mail: 'nicolas.vargas@gmail.com', tel: '1134455667', fechaNac: '1988-08-16', peso: 83, altura: 181, nivel: 'Avanzado', genero: 'masculino', direccion: 'Santa Fe 234' },
  { nombre: 'Lucía Morales', mail: 'lucia.morales@gmail.com', tel: '1145566778', fechaNac: '1995-03-22', peso: 61, altura: 169, nivel: 'Intermedio', genero: 'femenino', direccion: 'Entre Ríos 567' },
  { nombre: 'Facundo Benítez', mail: 'facundo.benitez@gmail.com', tel: '1156677889', fechaNac: '1991-11-09', peso: 79, altura: 178, nivel: 'Principiante', genero: 'masculino', direccion: 'Chacabuco 678' },
  { nombre: 'Micaela Herrera', mail: 'micaela.herrera@gmail.com', tel: '1167788990', fechaNac: '1993-07-27', peso: 56, altura: 163, nivel: 'Avanzado', genero: 'femenino', direccion: 'Pellegrini 345' },
  { nombre: 'Joaquín Medina', mail: 'joaquin.medina@gmail.com', tel: '1178899001', fechaNac: '1989-12-14', peso: 84, altura: 183, nivel: 'Intermedio', genero: 'masculino', direccion: 'Alem 789' },
  { nombre: 'Agustina Romero', mail: 'agustina.romero@gmail.com', tel: '1189900112', fechaNac: '1994-05-03', peso: 58, altura: 165, nivel: 'Principiante', genero: 'femenino', direccion: 'Roca 123' },
  { nombre: 'Tomás Silva', mail: 'tomas.silva@gmail.com', tel: '1190011223', fechaNac: '1987-09-19', peso: 81, altura: 180, nivel: 'Avanzado', genero: 'masculino', direccion: 'Yrigoyen 456' },
  { nombre: 'Carolina Ramos', mail: 'carolina.ramos@gmail.com', tel: '1101122334', fechaNac: '1996-04-11', peso: 63, altura: 170, nivel: 'Intermedio', genero: 'femenino', direccion: 'Pueyrredón 890' }
];

async function agregarAlumnos() {
  try {
    console.log('Generando hash de password...');
    const hashedPassword = await bcrypt.hash('123456', SALT_ROUNDS);
    console.log('Hash generado:', hashedPassword);

    console.log('\nObteniendo el ID más alto actual...');
    const [rows] = await pool.query('SELECT MAX(idPersona) as maxId FROM persona');
    let nextId = (rows[0].maxId || 0) + 1;
    
    if (nextId < 1001) {
      nextId = 1001; // Empezar desde 1001 para evitar conflictos
    }

    console.log(`Próximo ID disponible: ${nextId}\n`);
    console.log('Agregando 20 alumnos...');

    for (let i = 0; i < alumnos.length; i++) {
      const alumno = alumnos[i];
      const idPersona = nextId + i;

      await pool.query(
        `INSERT INTO persona (idPersona, nombre, mail, tel, rol, cantAlumnos, direccion, fechaNac, peso, altura, password, nivel, genero, activo) 
         VALUES (?, ?, ?, ?, 'alumno', NULL, ?, ?, ?, ?, ?, ?, ?, TRUE)`,
        [
          idPersona,
          alumno.nombre,
          alumno.mail,
          alumno.tel,
          alumno.direccion,
          alumno.fechaNac,
          alumno.peso,
          alumno.altura,
          hashedPassword,
          alumno.nivel,
          alumno.genero
        ]
      );

      console.log(`✓ ${i + 1}. ${alumno.nombre} (ID: ${idPersona})`);
    }

    console.log('\n¡20 alumnos agregados exitosamente!');
    console.log('Password para todos: 123456');

    // Verificar total
    const [result] = await pool.query('SELECT COUNT(*) as total FROM persona WHERE rol = "alumno"');
    console.log(`\nTotal de alumnos en la base de datos: ${result[0].total}`);

    process.exit(0);
  } catch (error) {
    console.error('Error al agregar alumnos:', error);
    process.exit(1);
  }
}

agregarAlumnos();
