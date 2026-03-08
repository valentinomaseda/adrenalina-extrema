-- Script para agregar campo 'activo' a la tabla persona
-- Esto permite diferenciar alumnos activos de inactivos

USE `adrenalina_extrema`;

-- Agregar columna activo (por defecto TRUE para todos)
ALTER TABLE persona 
ADD COLUMN activo BOOLEAN DEFAULT TRUE AFTER genero;

-- Marcar todos los alumnos existentes como activos
UPDATE persona SET activo = TRUE WHERE rol = 'alumno';

-- Verificar
SELECT idPersona, nombre, rol, activo FROM persona WHERE rol = 'alumno' LIMIT 10;

SELECT 'Campo activo agregado exitosamente!' AS mensaje;
