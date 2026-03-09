-- =====================================================
-- FIX: Configurar CASCADE DELETE para Rutinas (v2)
-- =====================================================
-- Script simplificado basado en el estado actual de la BD

USE `adrenalina_extrema`;

-- =====================================================
-- 1. MODIFICAR TABLA RUTINA_EJERCICIO
-- =====================================================

ALTER TABLE `rutina_ejercicio`
DROP FOREIGN KEY `fk_rutina_ejercicio_rutina`;

ALTER TABLE `rutina_ejercicio`
ADD CONSTRAINT `fk_rutina_ejercicio_rutina`
FOREIGN KEY (`idRutina`) REFERENCES `rutina`(`idRutina`)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- =====================================================
-- 2. MODIFICAR TABLA ALUMNO_RUTINA
-- =====================================================

ALTER TABLE `alumno_rutina`
DROP FOREIGN KEY `fk_alumno_rutina_rutina`;

ALTER TABLE `alumno_rutina`
ADD CONSTRAINT `fk_alumno_rutina_rutina`
FOREIGN KEY (`idRutina`) REFERENCES `rutina`(`idRutina`)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- =====================================================
-- 3. RECREAR FK EN ALUMNO_RUTINA_EJERCICIO
-- =====================================================

-- Recrear FK compuesta a alumno_rutina con CASCADE
ALTER TABLE `alumno_rutina_ejercicio`
ADD CONSTRAINT `fk_are_alumno_rutina`
FOREIGN KEY (`idPersona`, `idRutina`) 
REFERENCES `alumno_rutina`(`idPersona`, `idRutina`)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- Recrear FK a ejercicio con RESTRICT
ALTER TABLE `alumno_rutina_ejercicio`
ADD CONSTRAINT `fk_are_ejercicio`
FOREIGN KEY (`idEjercicio`) REFERENCES `ejercicio`(`idEjercicio`)
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- =====================================================
-- 4. VERIFICACIÓN
-- =====================================================

SELECT 
    TABLE_NAME,
    CONSTRAINT_NAME,
    DELETE_RULE,
    UPDATE_RULE
FROM information_schema.REFERENTIAL_CONSTRAINTS
WHERE CONSTRAINT_SCHEMA = 'adrenalina_extrema'
  AND TABLE_NAME IN ('rutina_ejercicio', 'alumno_rutina', 'alumno_rutina_ejercicio')
ORDER BY TABLE_NAME;

SELECT '✅ Restricciones actualizadas correctamente' AS mensaje;
