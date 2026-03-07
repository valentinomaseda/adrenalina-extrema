-- Migración: Reestructurar ejercicios y rutina_ejercicio
-- Los ejercicios ahora solo tienen nombre y tipo (reps o segundos)
-- Las cantidades de sets y reps/segundos se guardan en rutina_ejercicio

USE `adrenalina_extrema`;

-- Paso 1: Agregar nuevas columnas a rutina_ejercicio
ALTER TABLE `rutina_ejercicio`
ADD COLUMN `cantSets` INT NOT NULL DEFAULT 3,
ADD COLUMN `cantidad` INT NOT NULL DEFAULT 10,
ADD COLUMN `orden` INT NULL;

-- Paso 2: Crear tabla temporal para migrar datos existentes
CREATE TEMPORARY TABLE temp_ejercicio_data AS
SELECT idEjercicio, cantSets, contador FROM ejercicio;

-- Paso 3: Migrar datos de ejercicios existentes a rutina_ejercicio
-- Esto asume que queremos mantener los valores actuales de cantSets
-- Para la cantidad, extraemos el primer número del contador
UPDATE rutina_ejercicio re
INNER JOIN temp_ejercicio_data ted ON re.idEjercicio = ted.idEjercicio
SET 
  re.cantSets = ted.cantSets,
  re.cantidad = CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(ted.contador, ' ', 1), ' ', -1) AS UNSIGNED);

-- Paso 4: Modificar tabla ejercicio - eliminar cantSets y contador, agregar tipoContador
ALTER TABLE `ejercicio`
DROP COLUMN `cantSets`,
DROP COLUMN `contador`;

ALTER TABLE `ejercicio`
ADD COLUMN `tipoContador` ENUM('reps', 'segundos') NOT NULL DEFAULT 'reps' AFTER `nombre`;

-- Paso 5: Actualizar tipoContador basado en los datos anteriores (si es necesario)
-- Por defecto todos serán 'reps', pero puedes ajustarlo manualmente

-- Limpiar tabla temporal
DROP TEMPORARY TABLE IF EXISTS temp_ejercicio_data;

-- Verificar cambios
SELECT 'Estructura de ejercicio actualizada' AS mensaje;
DESCRIBE ejercicio;

SELECT 'Estructura de rutina_ejercicio actualizada' AS mensaje;
DESCRIBE rutina_ejercicio;
