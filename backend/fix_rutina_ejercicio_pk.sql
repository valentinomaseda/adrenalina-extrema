-- Script para permitir el mismo ejercicio múltiples veces en una rutina
-- Autor: Sistema
-- Fecha: 2026-03-09
-- Descripción: Cambia la clave primaria de rutina_ejercicio para permitir duplicados

USE `adrenalina_extrema`;

-- PARTE 1: Arreglar rutina_ejercicio

-- 1. Verificar y eliminar cualquier foreign key que referencie rutina_ejercicio
-- (ejecutar solo si existe)
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS;
SET FOREIGN_KEY_CHECKS=0;

-- 2. Eliminar la clave primaria actual
ALTER TABLE `rutina_ejercicio` DROP PRIMARY KEY;

-- 3. Agregar un ID autoincrementable como nueva clave primaria
ALTER TABLE `rutina_ejercicio` 
  ADD COLUMN `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST;

-- 4. Crear índice único en (idRutina, orden) para evitar ejercicios con el mismo orden
-- Esto asegura que cada ejercicio tenga una posición única en la rutina
ALTER TABLE `rutina_ejercicio`
  ADD UNIQUE KEY `uk_rutina_orden` (`idRutina`, `orden`);

-- 5. Crear índice regular en (idRutina, idEjercicio) para búsquedas rápidas
ALTER TABLE `rutina_ejercicio`
  ADD KEY `idx_rutina_ejercicio` (`idRutina`, `idEjercicio`);

-- PARTE 2: Arreglar alumno_rutina_ejercicio

-- 6. Eliminar la clave primaria actual de alumno_rutina_ejercicio
ALTER TABLE `alumno_rutina_ejercicio` DROP PRIMARY KEY;

-- 7. Agregar un ID autoincrementable como nueva clave primaria
ALTER TABLE `alumno_rutina_ejercicio` 
  ADD COLUMN `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST;

-- 8. Crear índice único en (idPersona, idRutina, orden)
ALTER TABLE `alumno_rutina_ejercicio`
  ADD UNIQUE KEY `uk_alumno_rutina_orden` (`idPersona`, `idRutina`, `orden`);

-- 9. Crear índice regular para búsquedas
ALTER TABLE `alumno_rutina_ejercicio`
  ADD KEY `idx_alumno_rutina_ejercicio` (`idPersona`, `idRutina`, `idEjercicio`);

-- Restaurar foreign key checks
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;

-- Verificar la nueva estructura
DESCRIBE `rutina_ejercicio`;
DESCRIBE `alumno_rutina_ejercicio`;

SELECT 'Estructura de rutina_ejercicio y alumno_rutina_ejercicio actualizadas exitosamente. Ahora permiten ejercicios duplicados con diferentes parámetros.' AS mensaje;
