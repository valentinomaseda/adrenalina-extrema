-- Script para permitir el mismo ejercicio múltiples veces en una rutina
-- Versión 2: Con eliminación y recreación de foreign keys
-- Autor: Sistema
-- Fecha: 2026-03-09

USE `adrenalina_extrema`;

SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS;
SET FOREIGN_KEY_CHECKS=0;

-- ============================================
-- PARTE 1: RUTINA_EJERCICIO
-- ============================================

-- 1. Eliminar foreign keys de rutina_ejercicio
ALTER TABLE `rutina_ejercicio` DROP FOREIGN KEY IF EXISTS `fk_rutina_ejercicio_ejercicio`;
ALTER TABLE `rutina_ejercicio` DROP FOREIGN KEY IF EXISTS `fk_rutina_ejercicio_rutina`;

-- 2. Eliminar la clave primaria actual
ALTER TABLE `rutina_ejercicio` DROP PRIMARY KEY;

-- 3. Agregar un ID autoincrementable como nueva clave primaria
-- Primero agregar la columna sin AUTO_INCREMENT
ALTER TABLE `rutina_ejercicio` 
  ADD COLUMN `id` INT UNSIGNED NOT NULL FIRST;

-- Inicializar los valores del ID
SET @row_number = 0;
UPDATE `rutina_ejercicio` SET `id` = (@row_number:=@row_number + 1) ORDER BY `idRutina`, `orden`;

-- Ahora agregar la clave primaria y AUTO_INCREMENT
ALTER TABLE `rutina_ejercicio` 
  MODIFY COLUMN `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  ADD PRIMARY KEY (`id`);

-- 4. Crear índices
ALTER TABLE `rutina_ejercicio`
  ADD UNIQUE KEY `uk_rutina_orden` (`idRutina`, `orden`);

ALTER TABLE `rutina_ejercicio`
  ADD KEY `idx_rutina_ejercicio` (`idRutina`, `idEjercicio`);

-- 5. Recrear foreign keys de rutina_ejercicio
ALTER TABLE `rutina_ejercicio`
  ADD CONSTRAINT `fk_rutina_ejercicio_ejercicio` 
  FOREIGN KEY (`idEjercicio`) REFERENCES `ejercicio` (`idEjercicio`) 
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `rutina_ejercicio`
  ADD CONSTRAINT `fk_rutina_ejercicio_rutina` 
  FOREIGN KEY (`idRutina`) REFERENCES `rutina` (`idRutina`) 
  ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================
-- PARTE 2: ALUMNO_RUTINA_EJERCICIO
-- ============================================

-- 6. Eliminar foreign keys de alumno_rutina_ejercicio
ALTER TABLE `alumno_rutina_ejercicio` DROP FOREIGN KEY IF EXISTS `fk_are_alumno_rutina`;
ALTER TABLE `alumno_rutina_ejercicio` DROP FOREIGN KEY IF EXISTS `fk_are_ejercicio`;

-- 7. Eliminar la clave primaria actual
ALTER TABLE `alumno_rutina_ejercicio` DROP PRIMARY KEY;

-- 8. Agregar un ID autoincrementable como nueva clave primaria
-- Primero agregar la columna sin AUTO_INCREMENT
ALTER TABLE `alumno_rutina_ejercicio` 
  ADD COLUMN `id` INT UNSIGNED NOT NULL FIRST;

-- Inicializar los valores del ID
SET @row_number = 0;
UPDATE `alumno_rutina_ejercicio` SET `id` = (@row_number:=@row_number + 1) ORDER BY `idPersona`, `idRutina`, `orden`;

-- Ahora agregar la clave primaria y AUTO_INCREMENT
ALTER TABLE `alumno_rutina_ejercicio` 
  MODIFY COLUMN `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  ADD PRIMARY KEY (`id`);

-- 9. Crear índices
ALTER TABLE `alumno_rutina_ejercicio`
  ADD UNIQUE KEY `uk_alumno_rutina_orden` (`idPersona`, `idRutina`, `orden`);

ALTER TABLE `alumno_rutina_ejercicio`
  ADD KEY `idx_alumno_rutina_ejercicio` (`idPersona`, `idRutina`, `idEjercicio`);

-- 10. Recrear foreign keys de alumno_rutina_ejercicio
ALTER TABLE `alumno_rutina_ejercicio`
  ADD CONSTRAINT `fk_are_alumno_rutina` 
  FOREIGN KEY (`idPersona`, `idRutina`) 
  REFERENCES `alumno_rutina` (`idPersona`, `idRutina`) 
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `alumno_rutina_ejercicio`
  ADD CONSTRAINT `fk_are_ejercicio` 
  FOREIGN KEY (`idEjercicio`) 
  REFERENCES `ejercicio` (`idEjercicio`) 
  ON DELETE RESTRICT ON UPDATE CASCADE;

-- Restaurar foreign key checks
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;

-- Verificar la nueva estructura
SELECT '=== ESTRUCTURA DE rutina_ejercicio ===' AS '';
DESCRIBE `rutina_ejercicio`;

SELECT '=== ESTRUCTURA DE alumno_rutina_ejercicio ===' AS '';
DESCRIBE `alumno_rutina_ejercicio`;

SELECT 'Estructura actualizada exitosamente. Ahora permiten ejercicios duplicados con diferentes parámetros.' AS mensaje;
