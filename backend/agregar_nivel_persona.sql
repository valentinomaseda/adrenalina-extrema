-- Agregar campo nivel a la tabla persona
-- Este campo almacena el nivel de experiencia del alumno (Principiante, Intermedio, Avanzado)

USE adrenalina_extrema;

-- Agregar columna nivel si no existe
ALTER TABLE persona 
ADD COLUMN IF NOT EXISTS nivel VARCHAR(45) DEFAULT 'Intermedio' AFTER rol;

-- Actualizar alumnos existentes con nivel por defecto
UPDATE persona 
SET nivel = 'Intermedio' 
WHERE rol = 'alumno' AND (nivel IS NULL OR nivel = '');

-- Verificación
SELECT idPersona, nombre, rol, nivel FROM persona WHERE rol = 'alumno';
