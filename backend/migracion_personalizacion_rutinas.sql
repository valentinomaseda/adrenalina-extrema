-- =====================================================
-- MIGRACIÓN: Sistema de Personalización de Rutinas
-- =====================================================
-- Fecha: 2026-03-09
-- Descripción: Permite al profesor asignar rutinas plantilla
--              y personalizarlas por alumno (volumen, intensidad, specs)
-- =====================================================

USE `adrenalina_extrema`;

-- OPCIÓN 1: MIGRACIÓN SIN PÉRDIDA DE DATOS (si existen asignaciones)
-- =====================================================

-- Paso 1: Crear tabla alumno_rutina_ejercicio
CREATE TABLE IF NOT EXISTS `alumno_rutina_ejercicio` (
  `idPersona` int unsigned NOT NULL,
  `idRutina` int unsigned NOT NULL,
  `idEjercicio` int unsigned NOT NULL,
  `cantSets` int NOT NULL DEFAULT 3,
  `cantidad` int NOT NULL DEFAULT 10,
  `especificaciones` TEXT,
  `orden` int DEFAULT NULL,
  PRIMARY KEY (`idPersona`, `idRutina`, `idEjercicio`),
  KEY `fk_are_alumno_rutina_idx` (`idPersona`, `idRutina`),
  KEY `fk_are_ejercicio_idx` (`idEjercicio`),
  CONSTRAINT `fk_are_alumno_rutina` FOREIGN KEY (`idPersona`, `idRutina`) 
    REFERENCES `alumno_rutina` (`idPersona`, `idRutina`) 
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_are_ejercicio` FOREIGN KEY (`idEjercicio`) 
    REFERENCES `ejercicio` (`idEjercicio`) 
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Paso 2: Migrar datos existentes (si hay asignaciones previas)
-- Copiar ejercicios de rutinas ya asignadas con valores de la plantilla
INSERT INTO `alumno_rutina_ejercicio` 
  (idPersona, idRutina, idEjercicio, cantSets, cantidad, orden)
SELECT 
  ar.idPersona,
  ar.idRutina,
  re.idEjercicio,
  re.cantSets,
  re.cantidad,
  re.orden
FROM `alumno_rutina` ar
INNER JOIN `rutina_ejercicio` re ON ar.idRutina = re.idRutina
WHERE NOT EXISTS (
  SELECT 1 FROM `alumno_rutina_ejercicio` are
  WHERE are.idPersona = ar.idPersona 
    AND are.idRutina = ar.idRutina 
    AND are.idEjercicio = re.idEjercicio
);

-- Paso 3: Verificar migración
SELECT 
  'Rutinas asignadas' AS tipo,
  COUNT(*) AS cantidad
FROM alumno_rutina
UNION ALL
SELECT 
  'Ejercicios personalizados' AS tipo,
  COUNT(*) AS cantidad
FROM alumno_rutina_ejercicio;

SELECT 'Migración completada exitosamente' AS mensaje;

-- =====================================================
-- OPCIÓN 2: RESET COMPLETO (VACIAR BASE DE DATOS)
-- =====================================================
-- Descomentar las siguientes líneas si quieres empezar de cero

/*
-- Eliminar tablas en orden correcto
DROP TABLE IF EXISTS `alumno_rutina_ejercicio`;
DROP TABLE IF EXISTS `alumno_rutina`;
DROP TABLE IF EXISTS `rutina_ejercicio`;
DROP TABLE IF EXISTS `rutina`;
DROP TABLE IF EXISTS `ejercicio`;
DROP TABLE IF EXISTS `persona`;

-- Recrear estructura completa
CREATE TABLE `persona` (
  `idPersona` int unsigned NOT NULL,
  `nombre` varchar(45) NOT NULL,
  `mail` varchar(45) DEFAULT NULL,
  `tel` varchar(20) NOT NULL,
  `rol` varchar(45) DEFAULT NULL,
  `cantAlumnos` int DEFAULT NULL,
  `direccion` varchar(45) DEFAULT NULL,
  `fechaNac` date DEFAULT NULL,
  `peso` int DEFAULT NULL,
  `altura` int DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `activo` BOOLEAN DEFAULT TRUE,
  `genero` ENUM('Masculino', 'Femenino', 'Otro') DEFAULT NULL,
  `nivel` ENUM('Principiante', 'Intermedio', 'Avanzado') DEFAULT 'Principiante',
  PRIMARY KEY (`idPersona`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `ejercicio` (
  `idEjercicio` int unsigned NOT NULL,
  `nombre` varchar(45) NOT NULL,
  `tipoContador` enum('reps','segundos') NOT NULL DEFAULT 'reps',
  PRIMARY KEY (`idEjercicio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `rutina` (
  `idRutina` int unsigned NOT NULL,
  `nombre` varchar(45) NOT NULL,
  `fechaHoraCreacion` datetime DEFAULT NULL,
  PRIMARY KEY (`idRutina`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `rutina_ejercicio` (
  `idRutina` int unsigned NOT NULL,
  `idEjercicio` int unsigned NOT NULL,
  `cantSets` int NOT NULL DEFAULT 3,
  `cantidad` int NOT NULL DEFAULT 10,
  `orden` int DEFAULT NULL,
  PRIMARY KEY (`idRutina`,`idEjercicio`),
  KEY `fk_rutina_ejercicio_ejercicio_idx` (`idEjercicio`),
  CONSTRAINT `fk_rutina_ejercicio_ejercicio` FOREIGN KEY (`idEjercicio`) 
    REFERENCES `ejercicio` (`idEjercicio`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_rutina_ejercicio_rutina` FOREIGN KEY (`idRutina`) 
    REFERENCES `rutina` (`idRutina`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `alumno_rutina` (
  `idPersona` int unsigned NOT NULL,
  `idRutina` int unsigned NOT NULL,
  `estado` varchar(45) DEFAULT 'activa',
  `fechaAsignacion` datetime NOT NULL,
  PRIMARY KEY (`idPersona`,`idRutina`),
  KEY `fk_alumno_rutina_rutina_idx` (`idRutina`),
  CONSTRAINT `fk_alumno_rutina_alumno` FOREIGN KEY (`idPersona`) 
    REFERENCES `persona` (`idPersona`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_alumno_rutina_rutina` FOREIGN KEY (`idRutina`) 
    REFERENCES `rutina` (`idRutina`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `alumno_rutina_ejercicio` (
  `idPersona` int unsigned NOT NULL,
  `idRutina` int unsigned NOT NULL,
  `idEjercicio` int unsigned NOT NULL,
  `cantSets` int NOT NULL DEFAULT 3,
  `cantidad` int NOT NULL DEFAULT 10,
  `especificaciones` TEXT,
  `orden` int DEFAULT NULL,
  PRIMARY KEY (`idPersona`, `idRutina`, `idEjercicio`),
  KEY `fk_are_alumno_rutina_idx` (`idPersona`, `idRutina`),
  KEY `fk_are_ejercicio_idx` (`idEjercicio`),
  CONSTRAINT `fk_are_alumno_rutina` FOREIGN KEY (`idPersona`, `idRutina`) 
    REFERENCES `alumno_rutina` (`idPersona`, `idRutina`) 
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_are_ejercicio` FOREIGN KEY (`idEjercicio`) 
    REFERENCES `ejercicio` (`idEjercicio`) 
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

SELECT 'Base de datos recreada con sistema de personalización' AS mensaje;
*/
