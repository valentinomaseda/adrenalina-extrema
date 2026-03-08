-- Script para poblar la tabla tipo_ejercicio con los tipos de contador
-- Autor: Sistema
-- Fecha: 2026-03-08
-- Descripción: Inserta los dos tipos de ejercicios soportados: repeticiones y segundos

USE `adrenalina_extrema`;

-- Limpiar datos existentes (opcional)
TRUNCATE TABLE `tipo_ejercicio`;

-- Insertar los dos tipos de ejercicio
INSERT INTO `tipo_ejercicio` (`idTipoEjercicio`, `nombre`) VALUES
(1, 'reps'),
(2, 'segundos');

-- Verificar inserción
SELECT * FROM `tipo_ejercicio`;

SELECT 'Tipos de ejercicio insertados exitosamente' AS mensaje;
