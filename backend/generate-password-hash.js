// Script para generar hash de contraseñas con bcrypt
// Ejecutar: node generate-password-hash.js

import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

// Función para generar hash
async function generateHash(password) {
  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  return hash;
}

// Generar hashes para contraseñas de prueba
async function main() {
  const password = '123456';
  
  console.log('\n=== Generador de Password Hashes con bcrypt ===\n');
  console.log(`Salt Rounds: ${SALT_ROUNDS}`);
  console.log(`Password original: "${password}"\n`);
  
  // Generar 3 hashes diferentes (bcrypt genera un salt único cada vez)
  const hash1 = await generateHash(password);
  const hash2 = await generateHash(password);
  const hash3 = await generateHash(password);
  
  console.log('Hash para entrenador@gym.com:');
  console.log(hash1);
  console.log('\nHash para alumno1@gym.com:');
  console.log(hash2);
  console.log('\nHash para alumno2@gym.com:');
  console.log(hash3);
  
  console.log('\n=== Script SQL para insertar usuarios ===\n');
  console.log(`-- Usuario Entrenador (entrenador@gym.com / ${password})
INSERT INTO persona (idPersona, nombre, mail, tel, rol, password)
VALUES (1, 'Juan Pérez', 'entrenador@gym.com', '1234567890', 'entrenador', '${hash1}');

-- Usuario Alumno 1 (alumno1@gym.com / ${password})
INSERT INTO persona (idPersona, nombre, mail, tel, rol, peso, altura, fechaNac, direccion, password)
VALUES (2, 'María García', 'alumno1@gym.com', '9876543210', 'alumno', 65, 165, '1995-05-15', 'Calle Falsa 123', '${hash2}');

-- Usuario Alumno 2 (alumno2@gym.com / ${password})
INSERT INTO persona (idPersona, nombre, mail, tel, rol, peso, altura, fechaNac, direccion, password)
VALUES (3, 'Carlos López', 'alumno2@gym.com', '5551234567', 'alumno', 78, 175, '1990-08-20', 'Av. Siempre Viva 742', '${hash3}');`);
  
  console.log('\n\nCopia el script SQL de arriba y ejecútalo en tu base de datos.\n');
  
  // Verificar que los hashes funcionan
  const isValid = await bcrypt.compare(password, hash1);
  console.log(`\nVerificación: ¿El hash es válido? ${isValid ? '✓ Sí' : '✗ No'}\n`);
}

main().catch(console.error);
