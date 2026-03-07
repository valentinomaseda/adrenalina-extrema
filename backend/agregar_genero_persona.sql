-- Agregar campo genero a la tabla persona
-- Este campo almacena el género del alumno (masculino/femenino)

USE adrenalina_extrema;

-- Agregar columna genero si no existe
ALTER TABLE persona 
ADD COLUMN IF NOT EXISTS genero VARCHAR(20) DEFAULT 'masculino' AFTER nivel;

-- Verificación
SELECT idPersona, nombre, rol, nivel, genero FROM persona WHERE rol = 'alumno';
