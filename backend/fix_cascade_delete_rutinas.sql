-- =====================================================
-- FIX: Configurar CASCADE DELETE para Rutinas
-- =====================================================
-- Fecha: 2026-03-09
-- Descripción: Modifica las restricciones de claves foráneas
--              para permitir eliminar rutinas y que se eliminen
--              automáticamente sus relaciones con ejercicios y alumnos
-- =====================================================

USE `adrenalina_extrema`;

-- =====================================================
-- 1. MODIFICAR TABLA RUTINA_EJERCICIO
-- =====================================================

-- Eliminar la restricción existente
ALTER TABLE `rutina_ejercicio`
DROP FOREIGN KEY `fk_rutina_ejercicio_rutina`;

-- Recrear con ON DELETE CASCADE
ALTER TABLE `rutina_ejercicio`
ADD CONSTRAINT `fk_rutina_ejercicio_rutina`
FOREIGN KEY (`idRutina`) REFERENCES `rutina`(`idRutina`)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- =====================================================
-- 2. MODIFICAR TABLA ALUMNO_RUTINA
-- =====================================================

-- Eliminar la restricción existente
ALTER TABLE `alumno_rutina`
DROP FOREIGN KEY `fk_alumno_rutina_rutina`;

-- Recrear con ON DELETE CASCADE
ALTER TABLE `alumno_rutina`
ADD CONSTRAINT `fk_alumno_rutina_rutina`
FOREIGN KEY (`idRutina`) REFERENCES `rutina`(`idRutina`)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- =====================================================
-- 3. MODIFICAR TABLA ALUMNO_RUTINA_EJERCICIO
-- =====================================================

-- Verificar nombres de las FK existentes primero
SELECT 
    CONSTRAINT_NAME,
    TABLE_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'adrenalina_extrema'
  AND TABLE_NAME = 'alumno_rutina_ejercicio'
  AND REFERENCED_TABLE_NAME IS NOT NULL;

-- Eliminar FK de alumno_rutina (clave foránea compuesta existente)
ALTER TABLE `alumno_rutina_ejercicio`
DROP FOREIGN KEY `fk_are_alumno_rutina`;

-- Eliminar FK de ejercicio
ALTER TABLE `alumno_rutina_ejercicio`
DROP FOREIGN KEY `fk_are_ejercicio`;

-- Recrear FK compuesta a alumno_rutina con CASCADE
-- Esto eliminará automáticamente los ejercicios personalizados cuando se elimine la asignación de rutina
ALTER TABLE `alumno_rutina_ejercicio`
ADD CONSTRAINT `fk_are_alumno_rutina`
FOREIGN KEY (`idPersona`, `idRutina`) 
REFERENCES `alumno_rutina`(`idPersona`, `idRutina`)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- Recrear FK a ejercicio con RESTRICT (no queremos eliminar ejercicios base)
ALTER TABLE `alumno_rutina_ejercicio`
ADD CONSTRAINT `fk_are_ejercicio`
FOREIGN KEY (`idEjercicio`) REFERENCES `ejercicio`(`idEjercicio`)
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- =====================================================
-- 4. VERIFICACIÓN
-- =====================================================

-- Verificar las nuevas restricciones
SELECT 
    TABLE_NAME,
    CONSTRAINT_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME,
    DELETE_RULE,
    UPDATE_RULE
FROM information_schema.KEY_COLUMN_USAGE
JOIN information_schema.REFERENTIAL_CONSTRAINTS
  USING (CONSTRAINT_SCHEMA, CONSTRAINT_NAME)
WHERE CONSTRAINT_SCHEMA = 'adrenalina_extrema'
  AND TABLE_NAME IN ('rutina_ejercicio', 'alumno_rutina', 'alumno_rutina_ejercicio')
  AND REFERENCED_TABLE_NAME IS NOT NULL
ORDER BY TABLE_NAME, CONSTRAINT_NAME;

SELECT '✅ Restricciones actualizadas: Ahora puedes eliminar rutinas y se eliminarán automáticamente sus relaciones' AS mensaje;
