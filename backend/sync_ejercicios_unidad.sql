-- =====================================================
-- SINCRONIZACIÓN: Campo unidad en ejercicios existentes
-- =====================================================
-- Fecha: 2026-03-09
-- Descripción: Sincroniza el campo 'unidad' con 'tipoContador'
--              para todos los ejercicios existentes que no
--              tienen el campo unidad configurado
-- =====================================================

USE `adrenalina_extrema`;

-- =====================================================
-- 1. ACTUALIZAR EJERCICIOS CON tipoContador = 'reps'
-- =====================================================

UPDATE `ejercicio`
SET `unidad` = 'reps'
WHERE `tipoContador` = 'reps'
  AND (`unidad` IS NULL OR `unidad` = 'reps');

SELECT CONCAT('✅ Actualizados ', ROW_COUNT(), ' ejercicios con unidad = reps') AS mensaje;

-- =====================================================
-- 2. ACTUALIZAR EJERCICIOS CON tipoContador = 'segundos'
-- =====================================================

UPDATE `ejercicio`
SET `unidad` = 'segundos'
WHERE `tipoContador` = 'segundos'
  AND (`unidad` IS NULL OR `unidad` = 'segundos');

SELECT CONCAT('✅ Actualizados ', ROW_COUNT(), ' ejercicios con unidad = segundos') AS mensaje;

-- =====================================================
-- 3. ACTUALIZAR tipoContador PARA NUEVOS TIPOS DE UNIDAD
-- =====================================================

-- Para ejercicios con unidad de tiempo (minutos, horas) -> tipoContador = 'segundos' 
UPDATE `ejercicio`
SET `tipoContador` = 'segundos'
WHERE `unidad` IN ('minutos', 'horas')
  AND `tipoContador` != 'segundos';

SELECT CONCAT('✅ Actualizados ', ROW_COUNT(), ' ejercicios de tiempo con tipoContador = segundos') AS mensaje;

-- Para ejercicios con unidad de distancia (km, metros) -> tipoContador = 'reps' (por compatibilidad)
UPDATE `ejercicio`
SET `tipoContador` = 'reps'
WHERE `unidad` IN ('km', 'metros')
  AND `tipoContador` != 'reps';

SELECT CONCAT('✅ Actualizados ', ROW_COUNT(), ' ejercicios de distancia con tipoContador = reps') AS mensaje;

-- =====================================================
-- 4. VERIFICACIÓN FINAL
-- =====================================================

-- Mostrar resumen de ejercicios por tipo de unidad
SELECT 
    `unidad`,
    `tipoContador`,
    COUNT(*) as cantidad
FROM `ejercicio`
GROUP BY `unidad`, `tipoContador`
ORDER BY `unidad`, `tipoContador`;

-- Mostrar ejercicios con valores inconsistentes (si los hay)
SELECT 
    idEjercicio,
    nombre,
    tipoContador,
    unidad
FROM `ejercicio`
WHERE (
    -- reps que no coinciden
    (`tipoContador` = 'reps' AND `unidad` NOT IN ('reps', 'km', 'metros'))
    OR
    -- segundos que no coinciden
    (`tipoContador` = 'segundos' AND `unidad` NOT IN ('segundos', 'minutos', 'horas'))
)
LIMIT 10;

SELECT '✅ Sincronización completada: Campo unidad actualizado para todos los ejercicios' AS mensaje;
