-- Script para corregir la clave primaria de alumno_rutina
-- Elimina duplicados y cambia PK para evitar anomalías

USE adrenalina_extrema;

-- Paso 1: Eliminar duplicados (mantener solo el más reciente de cada alumno-rutina)
DELETE t1 FROM alumno_rutina t1
INNER JOIN alumno_rutina t2 
WHERE t1.idPersona = t2.idPersona 
  AND t1.idRutina = t2.idRutina 
  AND t1.fechaAsignacion < t2.fechaAsignacion;

-- Paso 2: Eliminar la clave primaria actual
ALTER TABLE alumno_rutina DROP PRIMARY KEY;

-- Paso 3: Crear nueva clave primaria sin fechaAsignacion
ALTER TABLE alumno_rutina ADD PRIMARY KEY (idPersona, idRutina);

-- Paso 4: Verificar la nueva estructura
DESCRIBE alumno_rutina;

-- Paso 5: Verificar que no hay duplicados
SELECT idPersona, idRutina, COUNT(*) as cantidad
FROM alumno_rutina
GROUP BY idPersona, idRutina
HAVING cantidad > 1;
