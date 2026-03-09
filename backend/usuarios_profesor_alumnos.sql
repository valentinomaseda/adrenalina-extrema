-- =====================================================
-- Script: Añadir Profesor y 5 Alumnos de Prueba
-- =====================================================
-- Fecha: 2026-03-09
-- Descripción: Inserta un profesor y 5 alumnos con datos realistas
--              - Todos los emails están PRE-VERIFICADOS (email_verificado = TRUE)
--              - Todos los usuarios están ACTIVOS (activo = TRUE)
--              - Password: password123 (para todos)
-- =====================================================

USE `adrenalina_extrema`;

-- =====================================================
-- 0. AGREGAR COLUMNA email_verificado SI NO EXISTE
-- =====================================================

-- Verificar y agregar columna email_verificado
SET @column_exists = (
  SELECT COUNT(*) 
  FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'persona' 
  AND COLUMN_NAME = 'email_verificado'
);

SET @sql = IF(@column_exists = 0, 
  'ALTER TABLE persona ADD COLUMN email_verificado BOOLEAN DEFAULT FALSE AFTER mail',
  'SELECT "✅ Column email_verificado already exists" AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- =====================================================
-- 1. PROFESOR
-- =====================================================
-- Email: profesor@gym.com
-- Password: password123
-- Hash bcrypt de "password123": $2b$10$9JEcVr1f5TaFl0D4pgwRpeVgMJIZiVPDBDRSSuoHqGVQ7GQW61eM.

INSERT INTO `persona` (
  `idPersona`, 
  `nombre`, 
  `mail`, 
  `email_verificado`,
  `tel`, 
  `rol`, 
  `cantAlumnos`, 
  `direccion`, 
  `fechaNac`, 
  `peso`, 
  `altura`, 
  `password`,
  `activo`,
  `genero`,
  `nivel`
) VALUES (
  1000,
  'Juan Carlos Aluztiza',
  'profesor@gym.com',
  TRUE,
  '+54 11 4567-8900',
  'profesor',
  5,
  'Av. Corrientes 1234, CABA',
  '1985-03-15',
  65,
  165,
  '$2b$10$9JEcVr1f5TaFl0D4pgwRpeVgMJIZiVPDBDRSSuoHqGVQ7GQW61eM.',
  TRUE,
  'Masculino',
  'Avanzado'
);

-- =====================================================
-- 2. ALUMNOS
-- =====================================================

-- ALUMNO 1: Juan Pérez (Avanzado)
-- Email: juan@mail.com | Password: password123
INSERT INTO `persona` (
  `idPersona`, 
  `nombre`, 
  `mail`, 
  `email_verificado`,
  `tel`, 
  `rol`, 
  `cantAlumnos`, 
  `direccion`, 
  `fechaNac`, 
  `peso`, 
  `altura`, 
  `password`,
  `activo`,
  `genero`,
  `nivel`
) VALUES (
  2001,
  'Juan Pérez',
  'juan@mail.com',
  TRUE,
  '+54 11 5555-1111',
  'alumno',
  NULL,
  'Calle Falsa 123, CABA',
  '1995-07-20',
  75,
  178,
  '$2b$10$9JEcVr1f5TaFl0D4pgwRpeVgMJIZiVPDBDRSSuoHqGVQ7GQW61eM.',
  TRUE,
  'Masculino',
  'Avanzado'
);

-- ALUMNO 2: María Rodríguez (Principiante)
-- Email: maria@mail.com | Password: password123
INSERT INTO `persona` (
  `idPersona`, 
  `nombre`, 
  `mail`, 
  `email_verificado`,
  `tel`, 
  `rol`, 
  `cantAlumnos`, 
  `direccion`, 
  `fechaNac`, 
  `peso`, 
  `altura`, 
  `password`,
  `activo`,
  `genero`,
  `nivel`
) VALUES (
  2002,
  'María Rodríguez',
  'maria@mail.com',
  TRUE,
  '+54 11 5555-2222',
  'alumno',
  NULL,
  'Av. Rivadavia 5678, CABA',
  '2000-11-10',
  58,
  162,
  '$2b$10$9JEcVr1f5TaFl0D4pgwRpeVgMJIZiVPDBDRSSuoHqGVQ7GQW61eM.',
  TRUE,
  'Femenino',
  'Principiante'
);

-- ALUMNO 3: Pedro García (Intermedio)
-- Email: pedro@mail.com | Password: password123
INSERT INTO `persona` (
  `idPersona`, 
  `nombre`, 
  `mail`, 
  `email_verificado`,
  `tel`, 
  `rol`, 
  `cantAlumnos`, 
  `direccion`, 
  `fechaNac`, 
  `peso`, 
  `altura`, 
  `password`,
  `activo`,
  `genero`,
  `nivel`
) VALUES (
  2003,
  'Pedro García',
  'pedro@mail.com',
  TRUE,
  '+54 11 5555-3333',
  'alumno',
  NULL,
  'San Martín 999, CABA',
  '1998-03-25',
  82,
  180,
  '$2b$10$9JEcVr1f5TaFl0D4pgwRpeVgMJIZiVPDBDRSSuoHqGVQ7GQW61eM.',
  TRUE,
  'Masculino',
  'Intermedio'
);

-- ALUMNO 4: Ana López (Intermedio)
-- Email: ana@mail.com | Password: password123
INSERT INTO `persona` (
  `idPersona`, 
  `nombre`, 
  `mail`, 
  `email_verificado`,
  `tel`, 
  `rol`, 
  `cantAlumnos`, 
  `direccion`, 
  `fechaNac`, 
  `peso`, 
  `altura`, 
  `password`,
  `activo`,
  `genero`,
  `nivel`
) VALUES (
  2004,
  'Ana López',
  'ana@mail.com',
  TRUE,
  '+54 11 5555-4444',
  'alumno',
  NULL,
  'Belgrano 777, CABA',
  '1997-09-05',
  62,
  168,
  '$2b$10$9JEcVr1f5TaFl0D4pgwRpeVgMJIZiVPDBDRSSuoHqGVQ7GQW61eM.',
  TRUE,
  'Femenino',
  'Intermedio'
);

-- ALUMNO 5: Carlos Fernández (Principiante)
-- Email: carlos@mail.com | Password: password123
INSERT INTO `persona` (
  `idPersona`, 
  `nombre`, 
  `mail`, 
  `email_verificado`,
  `tel`, 
  `rol`, 
  `cantAlumnos`, 
  `direccion`, 
  `fechaNac`, 
  `peso`, 
  `altura`, 
  `password`,
  `activo`,
  `genero`,
  `nivel`
) VALUES (
  2005,
  'Carlos Fernández',
  'carlos@mail.com',
  TRUE,
  '+54 11 5555-5555',
  'alumno',
  NULL,
  'Callao 456, CABA',
  '2001-01-30',
  70,
  175,
  '$2b$10$9JEcVr1f5TaFl0D4pgwRpeVgMJIZiVPDBDRSSuoHqGVQ7GQW61eM.',
  TRUE,
  'Masculino',
  'Principiante'
);

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

-- Mostrar el profesor insertado
SELECT 
  idPersona, 
  nombre, 
  mail, 
  email_verificado,
  activo,
  rol, 
  nivel,
  genero,
  'password123' as password_original
FROM persona 
WHERE idPersona = 1000;

-- Mostrar los alumnos insertados
SELECT 
  idPersona, 
  nombre, 
  mail, 
  email_verificado,
  activo,
  rol, 
  nivel,
  genero,
  'password123' as password_original
FROM persona 
WHERE idPersona BETWEEN 2001 AND 2005
ORDER BY idPersona;

SELECT '✅ Insertados: 1 profesor y 5 alumnos exitosamente' AS mensaje;
SELECT '✅ Todos los usuarios tienen email verificado y están activos' AS mensaje2;

-- =====================================================
-- CREDENCIALES DE ACCESO
-- =====================================================
-- 
-- PROFESOR:
--   Email: profesor@gym.com
--   Password: password123
--   Estado: ✅ Activo | ✅ Email Verificado
-- 
-- ALUMNOS:
--   juan@mail.com     | password123 | Nivel: Avanzado      | ✅ Activo
--   maria@mail.com    | password123 | Nivel: Principiante  | ✅ Activo
--   pedro@mail.com    | password123 | Nivel: Intermedio    | ✅ Activo
--   ana@mail.com      | password123 | Nivel: Intermedio    | ✅ Activo
--   carlos@mail.com   | password123 | Nivel: Principiante  | ✅ Activo
-- 
-- Todos los usuarios están listos para usar sin necesidad de verificar email
-- =====================================================

