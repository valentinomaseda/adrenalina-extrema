-- Script para crear usuarios de prueba en Adrenalina Extrema
-- Ejecutar después de crear la base de datos con adrenalina_extrema.sql
-- Y después de ejecutar fix_telefono.sql para actualizar el campo tel a VARCHAR

USE adrenalina_extrema;

-- Insertar un entrenador/coach para hacer login
INSERT INTO persona (nombre, mail, password, rol, tel, direccion, fechaNac, peso, altura)
VALUES 
('Coach Admin', 'admin@adrenalina.com', 'admin123', 'entrenador', '1122334455', 'Av. Corrientes 1234, CABA', '1985-03-15', 80, 182),
('Valentina Coach', 'vale@adrenalina.com', '123456', 'entrenador', '1155667788', 'Av. Santa Fe 5678, CABA', '1990-07-20', 62, 170);

-- Insertar algunos alumnos de ejemplo
INSERT INTO persona (nombre, mail, password, rol, tel, direccion, fechaNac, peso, altura)
VALUES 
('Juan Pérez', 'juan.perez@email.com', '123456', 'alumno', '1123456789', 'Av. Corrientes 1234, CABA', '1995-05-15', 75, 178),
('María López', 'maria.lopez@email.com', '123456', 'alumno', '1134567890', 'Av. Santa Fe 2345, CABA', '1998-08-22', 62, 165),
('Carlos Ruiz', 'carlos.ruiz@email.com', '123456', 'alumno', '1145678901', 'Av. Rivadavia 3456, CABA', '2000-03-10', 82, 180),
('Ana García', 'ana.garcia@email.com', '123456', 'alumno', '1156789012', 'Av. Cabildo 4567, CABA', '1994-11-30', 58, 168),
('Luis Fernández', 'luis.fernandez@email.com', '123456', 'alumno', '1167890123', 'Av. Callao 5678, CABA', '1997-07-18', 70, 175);

-- Insertar algunos ejercicios de ejemplo
INSERT INTO ejercicio (nombre, cantSets, contador)
VALUES 
('Burpees', 4, '15 reps'),
('Sentadillas', 4, '20 reps'),
('Flexiones', 4, '15 reps'),
('Plancha', 3, '60 segundos'),
('Mountain Climbers', 4, '30 reps'),
('Jumping Jacks', 3, '40 reps'),
('Estocadas', 3, '15 reps'),
('Sprint 100m', 5, '15 segundos'),
('Trote Suave', 1, '300 segundos'),
('Skipping Alto', 4, '25 reps'),
('Desplazamientos Laterales', 4, '20 reps'),
('Abdominales', 4, '25 reps'),
('Press de Banca', 4, '12 reps'),
('Dominadas', 4, '10 reps'),
('Remo con Barra', 4, '12 reps');

-- Insertar algunas rutinas de ejemplo
INSERT INTO rutina (nombre, descripcion, nivel)
VALUES 
('HIIT Avanzado', 'Rutina de alta intensidad para nivel avanzado', 'Avanzado'),
('Iniciación Completa', 'Rutina para principiantes con ejercicios básicos', 'Principiante'),
('Cardio Intenso', 'Enfoque en resistencia cardiovascular', 'Intermedio'),
('Fuerza Total', 'Desarrollo de fuerza en todo el cuerpo', 'Avanzado'),
('Resistencia Base', 'Construcción de base aeróbica', 'Intermedio');

-- Crear algunas relaciones ejercicio-rutina (primera rutina: HIIT Avanzado)
INSERT INTO rutina_ejercicio (idRutina, idEjercicio, orden)
VALUES 
(1, 1, 1),  -- Burpees
(1, 5, 2),  -- Mountain Climbers
(1, 8, 3),  -- Sprint 100m
(1, 4, 4),  -- Plancha
(1, 10, 5); -- Skipping Alto

-- Segunda rutina: Iniciación Completa
INSERT INTO rutina_ejercicio (idRutina, idEjercicio, orden)
VALUES 
(2, 9, 1),  -- Trote Suave
(2, 6, 2),  -- Jumping Jacks
(2, 2, 3),  -- Sentadillas
(2, 7, 4),  -- Estocadas
(2, 12, 5); -- Abdominales

-- Tercera rutina: Cardio Intenso
INSERT INTO rutina_ejercicio (idRutina, idEjercicio, orden)
VALUES 
(3, 8, 1),  -- Sprint 100m
(3, 1, 2),  -- Burpees
(3, 6, 3),  -- Jumping Jacks
(3, 5, 4),  -- Mountain Climbers
(3, 11, 5); -- Desplazamientos Laterales

-- Asignar algunas rutinas a alumnos
-- Juan Pérez (id=3) - Nivel Avanzado - Rutina HIIT
INSERT INTO persona_rutina (idPersona, idRutina, fechaAsign, activa)
VALUES 
(3, 1, '2026-03-01', 1);

-- María López (id=4) - Nivel Intermedio - Rutina Cardio
INSERT INTO persona_rutina (idPersona, idRutina, fechaAsign, activa)
VALUES 
(4, 3, '2026-03-02', 1);

-- Carlos Ruiz (id=5) - Nivel Principiante - Rutina Iniciación
INSERT INTO persona_rutina (idPersona, idRutina, fechaAsign, activa)
VALUES 
(5, 2, '2026-03-03', 1);

-- Verificar que todo se insertó correctamente
SELECT 'Personas insertadas:' as Info, COUNT(*) as Cantidad FROM persona
UNION ALL
SELECT 'Ejercicios insertados:', COUNT(*) FROM ejercicio
UNION ALL
SELECT 'Rutinas insertadas:', COUNT(*) FROM rutina
UNION ALL
SELECT 'Relaciones ejercicio-rutina:', COUNT(*) FROM rutina_ejercicio
UNION ALL
SELECT 'Asignaciones persona-rutina:', COUNT(*) FROM persona_rutina;

-- Mostrar credenciales de login
SELECT 
    'CREDENCIALES DE LOGIN' as Info,
    nombre as Nombre,
    mail as Email,
    password as Password,
    rol as Rol
FROM persona
WHERE rol = 'entrenador';
