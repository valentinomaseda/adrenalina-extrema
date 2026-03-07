-- Script para crear usuarios de prueba con contraseñas hasheadas
-- NOTA: Estas contraseñas están hasheadas con bcrypt (salt rounds: 10)
-- La contraseña para todos es: "123456"

USE `adrenalina_extrema`;

-- Usuario entrenador
-- Email: entrenador@gym.com
-- Password: 123456 (hasheado con bcrypt)
INSERT INTO persona (idPersona, nombre, mail, tel, rol, password)
VALUES (
  1, 
  'Juan Pérez', 
  'entrenador@gym.com', 
  '1234567890', 
  'entrenador',
  '$2b$10$YourHashedPasswordHere123456789012345678901234567890abcdef'
);

-- Usuario alumno 1
-- Email: alumno1@gym.com
-- Password: 123456
INSERT INTO persona (idPersona, nombre, mail, tel, rol, peso, altura, fechaNac, direccion, password)
VALUES (
  2, 
  'María García', 
  'alumno1@gym.com', 
  '9876543210', 
  'alumno',
  65,
  165,
  '1995-05-15',
  'Calle Falsa 123',
  '$2b$10$YourHashedPasswordHere123456789012345678901234567890abcdef'
);

-- Usuario alumno 2
-- Email: alumno2@gym.com
-- Password: 123456
INSERT INTO persona (idPersona, nombre, mail, tel, rol, peso, altura, fechaNac, direccion, password)
VALUES (
  3, 
  'Carlos López', 
  'alumno2@gym.com', 
  '5551234567', 
  'alumno',
  78,
  175,
  '1990-08-20',
  'Av. Siempre Viva 742',
  '$2b$10$YourHashedPasswordHere123456789012345678901234567890abcdef'
);

-- IMPORTANTE: Los hashes de arriba son placeholders
-- Para generar los hashes reales, debes:
-- 1. Iniciar el servidor backend (que tiene bcrypt instalado)
-- 2. Crear los usuarios desde la aplicación frontend, O
-- 3. Usar el siguiente snippet de Node.js para generar hashes:

/*
const bcrypt = require('bcrypt');
const password = '123456';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function(err, hash) {
  console.log('Hash para password "123456":', hash);
});
*/

SELECT 'Usuarios de prueba creados (actualizar hashes manualmente)' AS mensaje;
