-- =====================================================
-- MIGRACIÓN: Sistema Avanzado para Ejercicios de Running
-- =====================================================
-- Fecha: 2026-03-09
-- Descripción: Amplía el modelo de ejercicios para soportar
--              rutinas complejas de running con distancias,
--              tiempos, intervalos, bloques y pausas
-- =====================================================

USE `adrenalina_extrema`;

-- =====================================================
-- 1. MODIFICAR TABLA EJERCICIO
-- =====================================================

-- Agregar columna 'unidad' (tipo de medida)
ALTER TABLE `ejercicio` 
ADD COLUMN IF NOT EXISTS `unidad` ENUM(
  'reps',           -- Repeticiones (default para compatibilidad)
  'segundos',       -- Segundos
  'minutos',        -- Minutos
  'horas',          -- Horas
  'km',             -- Kilómetros
  'metros'          -- Metros
) DEFAULT 'reps' AFTER `tipoContador`;

-- Agregar columna 'distancia' (para ejercicios basados en distancia)
ALTER TABLE `ejercicio`
ADD COLUMN IF NOT EXISTS `distancia` VARCHAR(50) DEFAULT NULL AFTER `unidad`;

-- Agregar columna 'duracion' (para ejercicios basados en tiempo)
ALTER TABLE `ejercicio`
ADD COLUMN IF NOT EXISTS `duracion` VARCHAR(50) DEFAULT NULL AFTER `distancia`;

-- Agregar columna 'descripcionIntervalo' (ej: "3' suaves x 3' fuertes")
ALTER TABLE `ejercicio`
ADD COLUMN IF NOT EXISTS `descripcionIntervalo` TEXT DEFAULT NULL AFTER `duracion`;

-- =====================================================
-- 2. MODIFICAR TABLA RUTINA_EJERCICIO (PLANTILLA)
-- =====================================================

-- Agregar columna 'pausaSeries' (pausa entre series/repeticiones)
ALTER TABLE `rutina_ejercicio`
ADD COLUMN IF NOT EXISTS `pausaSeries` VARCHAR(50) DEFAULT NULL AFTER `cantidad`;

-- Agregar columna 'intensidad' (rápidos, fondo, subida, etc.)
ALTER TABLE `rutina_ejercicio`
ADD COLUMN IF NOT EXISTS `intensidad` TEXT DEFAULT NULL AFTER `pausaSeries`;

-- Agregar columna 'calentamiento' (si es ejercicio de calentamiento)
ALTER TABLE `rutina_ejercicio`
ADD COLUMN IF NOT EXISTS `esCalentamiento` BOOLEAN DEFAULT FALSE AFTER `intensidad`;

-- =====================================================
-- 3. MODIFICAR TABLA ALUMNO_RUTINA_EJERCICIO (PERSONALIZADA)
-- =====================================================

-- Agregar las mismas columnas para ejercicios personalizados
ALTER TABLE `alumno_rutina_ejercicio`
ADD COLUMN IF NOT EXISTS `pausaSeries` VARCHAR(50) DEFAULT NULL AFTER `especificaciones`;

ALTER TABLE `alumno_rutina_ejercicio`
ADD COLUMN IF NOT EXISTS `intensidad` TEXT DEFAULT NULL AFTER `pausaSeries`;

ALTER TABLE `alumno_rutina_ejercicio`
ADD COLUMN IF NOT EXISTS `esCalentamiento` BOOLEAN DEFAULT FALSE AFTER `intensidad`;

-- =====================================================
-- 4. CREAR EJERCICIOS BASE DE RUNNING
-- =====================================================

-- Ejercicio 1: Correr (basado en distancia)
INSERT INTO `ejercicio` (`idEjercicio`, `nombre`, `tipoContador`, `unidad`, `distancia`)
VALUES (10001, 'Correr', 'reps', 'km', NULL)
ON DUPLICATE KEY UPDATE nombre = nombre;

-- Ejercicio 2: Correr (basado en tiempo)
INSERT INTO `ejercicio` (`idEjercicio`, `nombre`, `tipoContador`, `unidad`, `duracion`)
VALUES (10002, 'Correr por tiempo', 'segundos', 'minutos', NULL)
ON DUPLICATE KEY UPDATE nombre = nombre;

-- Ejercicio 3: Intervalos (tiempo)
INSERT INTO `ejercicio` (`idEjercicio`, `nombre`, `tipoContador`, `unidad`)
VALUES (10003, 'Intervalos', 'segundos', 'minutos')
ON DUPLICATE KEY UPDATE nombre = nombre;

-- Ejercicio 4: Repeticiones en distancia
INSERT INTO `ejercicio` (`idEjercicio`, `nombre`, `tipoContador`, `unidad`)
VALUES (10004, 'Repeticiones en distancia', 'reps', 'metros')
ON DUPLICATE KEY UPDATE nombre = nombre;

-- Ejercicio 5: Fondo
INSERT INTO `ejercicio` (`idEjercicio`, `nombre`, `tipoContador`, `unidad`)
VALUES (10005, 'Fondo', 'segundos', 'horas')
ON DUPLICATE KEY UPDATE nombre = nombre;

-- Ejercicio 6: Series en subida
INSERT INTO `ejercicio` (`idEjercicio`, `nombre`, `tipoContador`, `unidad`)
VALUES (10006, 'Series en subida', 'reps', 'metros')
ON DUPLICATE KEY UPDATE nombre = nombre;

-- =====================================================
-- 5. EJEMPLO: RUTINA COMPLETA DEL LUNES
-- =====================================================

-- Crear rutina de ejemplo
INSERT INTO `rutina` (`idRutina`, `nombre`, `fechaHoraCreacion`)
VALUES (9001, 'Rutina Lunes - 16km con rápidos', NOW())
ON DUPLICATE KEY UPDATE nombre = nombre;

-- Agregar ejercicio: 16 km con especificación de rápidos
INSERT INTO `rutina_ejercicio` (
  `idRutina`, 
  `idEjercicio`, 
  `cantSets`, 
  `cantidad`, 
  `intensidad`,
  `orden`
) VALUES (
  9001,
  10001,  -- Correr
  1,
  16,
  'Rápidos en km 4, 8 y 12',
  1
) ON DUPLICATE KEY UPDATE idRutina = idRutina;

-- =====================================================
-- 6. EJEMPLO: RUTINA COMPLETA DEL MARTES
-- =====================================================

INSERT INTO `rutina` (`idRutina`, `nombre`, `fechaHoraCreacion`)
VALUES (9002, 'Rutina Martes - Intervalos complejos', NOW())
ON DUPLICATE KEY UPDATE nombre = nombre;

-- Calentamiento: 2 km
INSERT INTO `rutina_ejercicio` (
  `idRutina`, `idEjercicio`, `cantSets`, `cantidad`, 
  `esCalentamiento`, `orden`
) VALUES (9002, 10001, 1, 2, TRUE, 1)
ON DUPLICATE KEY UPDATE idRutina = idRutina;

-- Bloque 1: 18' de 3x3
INSERT INTO `rutina_ejercicio` (
  `idRutina`, `idEjercicio`, `cantSets`, `cantidad`, 
  `intensidad`, `pausaSeries`, `orden`
) VALUES (
  9002, 10003, 1, 18,
  '3 x 3: 3 minutos suaves x 3 minutos fuertes',
  '3 minutos entre bloques', 2
) ON DUPLICATE KEY UPDATE idRutina = idRutina;

-- Bloque 2: 10' de 1x1
INSERT INTO `rutina_ejercicio` (
  `idRutina`, `idEjercicio`, `cantSets`, `cantidad`, 
  `intensidad`, `pausaSeries`, `orden`
) VALUES (
  9002, 10003, 1, 10,
  '1 x 1: 1 minuto suave x 1 minuto fuerte',
  '3 minutos entre bloques', 3
) ON DUPLICATE KEY UPDATE idRutina = idRutina;

-- Bloque 3: 18' de 3x3
INSERT INTO `rutina_ejercicio` (
  `idRutina`, `idEjercicio`, `cantSets`, `cantidad`, 
  `intensidad`, `orden`
) VALUES (
  9002, 10003, 1, 18,
  '3 x 3: 3 minutos suaves x 3 minutos fuertes',
  4
) ON DUPLICATE KEY UPDATE idRutina = idRutina;

-- =====================================================
-- 7. VERIFICACIÓN
-- =====================================================

SELECT '✅ Migración completada: Sistema de ejercicios de running' AS mensaje;

-- Mostrar nuevas columnas en ejercicio
DESCRIBE ejercicio;

-- Mostrar nuevas columnas en rutina_ejercicio
DESCRIBE rutina_ejercicio;

-- Mostrar nuevas columnas en alumno_rutina_ejercicio
DESCRIBE alumno_rutina_ejercicio;

-- Mostrar ejercicios de running creados
SELECT * FROM ejercicio WHERE idEjercicio >= 10001;

-- Mostrar rutina de ejemplo
SELECT 
  r.nombre AS rutina,
  e.nombre AS ejercicio,
  re.cantSets AS sets,
  re.cantidad,
  re.intensidad,
  re.pausaSeries,
  re.esCalentamiento
FROM rutina r
JOIN rutina_ejercicio re ON r.idRutina = re.idRutina
JOIN ejercicio e ON re.idEjercicio = e.idEjercicio
WHERE r.idRutina IN (9001, 9002)
ORDER BY r.idRutina, re.orden;

-- =====================================================
-- NOTAS DE USO
-- =====================================================
-- 
-- UNIDADES DISPONIBLES:
--   - reps: Repeticiones (default)
--   - segundos: Para tiempos cortos
--   - minutos: Para intervalos y duraciones medianas
--   - horas: Para fondos largos
--   - km: Para distancias largas
--   - metros: Para distancias cortas (200m, 300m)
--
-- CAMPOS NUEVOS:
--   - unidad: Tipo de medida del ejercicio
--   - distancia: Texto libre para distancias ("16 km", "200m")
--   - duracion: Texto libre para tiempos ("1 hora", "18'")
--   - descripcionIntervalo: Descripción de intervalos complejos
--   - pausaSeries: Pausa entre series ("1'", "3'", "trote")
--   - intensidad: Tipo de intensidad ("rápidos", "fondo", "subida")
--   - esCalentamiento: Si es ejercicio de calentamiento
--
-- =====================================================
