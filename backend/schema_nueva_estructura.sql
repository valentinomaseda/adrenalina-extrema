-- Script simplificado para instalación nueva (sin datos previos)
-- Ejecutar este script si empiezas de cero o si no te importa perder los datos existentes

USE `adrenalina_extrema`;

-- Paso 1: Eliminar tablas existentes en orden correcto (por las foreign keys)
DROP TABLE IF EXISTS `alumno_rutina`;
DROP TABLE IF EXISTS `rutina_ejercicio`;
DROP TABLE IF EXISTS `rutina`;
DROP TABLE IF EXISTS `ejercicio`;
DROP TABLE IF EXISTS `persona`;

-- Paso 2: Crear tabla persona con password ampliado
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
  PRIMARY KEY (`idPersona`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Paso 3: Crear tabla ejercicio con nueva estructura
CREATE TABLE `ejercicio` (
  `idEjercicio` int unsigned NOT NULL,
  `nombre` varchar(45) NOT NULL,
  `tipoContador` enum('reps','segundos') NOT NULL DEFAULT 'reps',
  PRIMARY KEY (`idEjercicio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Paso 4: Crear tabla rutina
CREATE TABLE `rutina` (
  `idRutina` int unsigned NOT NULL,
  `nombre` varchar(45) NOT NULL,
  `fechaHoraCreacion` datetime DEFAULT NULL,
  PRIMARY KEY (`idRutina`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Paso 5: Crear tabla rutina_ejercicio con campos de sets y cantidad
CREATE TABLE `rutina_ejercicio` (
  `idRutina` int unsigned NOT NULL,
  `idEjercicio` int unsigned NOT NULL,
  `cantSets` int NOT NULL DEFAULT 3,
  `cantidad` int NOT NULL DEFAULT 10,
  `orden` int DEFAULT NULL,
  PRIMARY KEY (`idRutina`,`idEjercicio`),
  KEY `fk_rutina_ejercicio_ejercicio_idx` (`idEjercicio`),
  CONSTRAINT `fk_rutina_ejercicio_ejercicio` FOREIGN KEY (`idEjercicio`) REFERENCES `ejercicio` (`idEjercicio`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_rutina_ejercicio_rutina` FOREIGN KEY (`idRutina`) REFERENCES `rutina` (`idRutina`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Paso 6: Crear tabla alumno_rutina
CREATE TABLE `alumno_rutina` (
  `idPersona` int unsigned NOT NULL,
  `idRutina` int unsigned NOT NULL,
  `estado` varchar(45) DEFAULT NULL,
  `fechaAsignacion` datetime NOT NULL,
  PRIMARY KEY (`idPersona`,`idRutina`,`fechaAsignacion`),
  KEY `fk_alumno_rutina_rutina_idx` (`idRutina`),
  CONSTRAINT `fk_alumno_rutina_alumno` FOREIGN KEY (`idPersona`) REFERENCES `persona` (`idPersona`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_alumno_rutina_rutina` FOREIGN KEY (`idRutina`) REFERENCES `rutina` (`idRutina`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Verificar creación de tablas
SHOW TABLES;

SELECT 'Base de datos recreada exitosamente con nueva estructura' AS mensaje;
