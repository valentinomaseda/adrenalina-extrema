-- Script para restaurar la clave primaria de alumno_rutina incluyendo fechaAsignacion
-- Esto permite asignar la misma rutina múltiples veces a un alumno con diferentes fechas

USE adrenalina_extrema;

-- Paso 1: Eliminar foreign keys temporalmente
ALTER TABLE alumno_rutina DROP FOREIGN KEY fk_alumno_rutina_alumno;
ALTER TABLE alumno_rutina DROP FOREIGN KEY fk_alumno_rutina_rutina;

-- Paso 2: Eliminar la clave primaria actual
ALTER TABLE alumno_rutina DROP PRIMARY KEY;

-- Paso 3: Crear nueva clave primaria incluyendo fechaAsignacion
ALTER TABLE alumno_rutina ADD PRIMARY KEY (idPersona, idRutina, fechaAsignacion);

-- Paso 4: Recrear las foreign keys
ALTER TABLE alumno_rutina 
ADD CONSTRAINT fk_alumno_rutina_alumno 
FOREIGN KEY (idPersona) REFERENCES persona (idPersona) 
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE alumno_rutina 
ADD CONSTRAINT fk_alumno_rutina_rutina 
FOREIGN KEY (idRutina) REFERENCES rutina (idRutina) 
ON DELETE RESTRICT ON UPDATE CASCADE;

-- Paso 5: Verificar la nueva estructura
DESCRIBE alumno_rutina;

SELECT 'Clave primaria restaurada correctamente con fechaAsignacion' as Resultado;
