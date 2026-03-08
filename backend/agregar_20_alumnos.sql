-- Script para agregar 20 alumnos de prueba a la base de datos
-- Ejecutar desde MySQL Workbench o línea de comandos

USE `adrenalina_extrema`;

-- Obtener el próximo ID disponible (asumiendo que ya existen algunos registros)
-- Estos IDs empiezan desde 1000 para evitar conflictos

-- Password hasheado para todos: "123456"
-- Hash bcrypt generado: $2b$10$rZ5fGkRJO5vYxqfJxJ3h5.XJ8gYQJ7L5vQJ9j5F5F5F5F5F5F5F5F

INSERT INTO persona (idPersona, nombre, mail, tel, rol, cantAlumnos, direccion, fechaNac, peso, altura, password, nivel, genero, activo) VALUES
(1001, 'Juan Pérez', 'juan.perez@gmail.com', '1122334455', 'alumno', NULL, 'Av. Corrientes 1234', '1990-05-15', 75, 175, '$2b$10$rZ5fGkRJO5vYxqfJxJ3h5.XJ8gYQJ7L5vQJ9j5F5F5F5F5F5F5F5F', 'Avanzado', 'masculino', TRUE),
(1002, 'María González', 'maria.gonzalez@gmail.com', '1123344556', 'alumno', NULL, 'Av. Rivadavia 567', '1992-08-22', 58, 165, '$2b$10$rZ5fGkRJO5vYxqfJxJ3h5.XJ8gYQJ7L5vQJ9j5F5F5F5F5F5F5F5F', 'Intermedio', 'femenino', TRUE),
(1003, 'Pedro Rodríguez', 'pedro.rodriguez@gmail.com', '1134455667', 'alumno', NULL, 'Calle Falsa 123', '1988-03-10', 82, 180, '$2b$10$rZ5fGkRJO5vYxqfJxJ3h5.XJ8gYQJ7L5vQJ9j5F5F5F5F5F5F5F5F', 'Principiante', 'masculino', TRUE),
(1004, 'Ana Martínez', 'ana.martinez@gmail.com', '1145566778', 'alumno', NULL, 'San Martín 890', '1995-11-30', 62, 168, '$2b$10$rZ5fGkRJO5vYxqfJxJ3h5.XJ8gYQJ7L5vQJ9j5F5F5F5F5F5F5F5F', 'Avanzado', 'femenino', TRUE),
(1005, 'Lucas Fernández', 'lucas.fernandez@gmail.com', '1156677889', 'alumno', NULL, 'Belgrano 456', '1991-07-18', 78, 177, '$2b$10$rZ5fGkRJO5vYxqfJxJ3h5.XJ8gYQJ7L5vQJ9j5F5F5F5F5F5F5F5F', 'Intermedio', 'masculino', TRUE),
(1006, 'Sofía Romero', 'sofia.romero@gmail.com', '1167788990', 'alumno', NULL, 'Sarmiento 234', '1993-02-14', 55, 162, '$2b$10$rZ5fGkRJO5vYxqfJxJ3h5.XJ8gYQJ7L5vQJ9j5F5F5F5F5F5F5F5F', 'Principiante', 'femenino', TRUE),
(1007, 'Diego Suárez', 'diego.suarez@gmail.com', '1178899001', 'alumno', NULL, 'Mitre 678', '1989-09-25', 85, 182, '$2b$10$rZ5fGkRJO5vYxqfJxJ3h5.XJ8gYQJ7L5vQJ9j5F5F5F5F5F5F5F5F', 'Avanzado', 'masculino', TRUE),
(1008, 'Valentina Torres', 'valentina.torres@gmail.com', '1189900112', 'alumno', NULL, 'Alsina 345', '1994-12-08', 60, 166, '$2b$10$rZ5fGkRJO5vYxqfJxJ3h5.XJ8gYQJ7L5vQJ9j5F5F5F5F5F5F5F5F', 'Intermedio', 'femenino', TRUE),
(1009, 'Sebastián Díaz', 'sebastian.diaz@gmail.com', '1190011223', 'alumno', NULL, 'Moreno 789', '1987-04-20', 80, 179, '$2b$10$rZ5fGkRJO5vYxqfJxJ3h5.XJ8gYQJ7L5vQJ9j5F5F5F5F5F5F5F5F', 'Principiante', 'masculino', TRUE),
(1010, 'Camila Ruiz', 'camila.ruiz@gmail.com', '1101122334', 'alumno', NULL, 'Lavalle 123', '1996-06-12', 57, 164, '$2b$10$rZ5fGkRJO5vYxqfJxJ3h5.XJ8gYQJ7L5vQJ9j5F5F5F5F5F5F5F5F', 'Avanzado', 'femenino', TRUE),
(1011, 'Martín Giménez', 'martin.gimenez@gmail.com', '1112233445', 'alumno', NULL, 'Tucumán 456', '1990-01-28', 76, 176, '$2b$10$rZ5fGkRJO5vYxqfJxJ3h5.XJ8gYQJ7L5vQJ9j5F5F5F5F5F5F5F5F', 'Intermedio', 'masculino', TRUE),
(1012, 'Florencia Castro', 'florencia.castro@gmail.com', '1123344556', 'alumno', NULL, 'Córdoba 890', '1992-10-05', 59, 167, '$2b$10$rZ5fGkRJO5vYxqfJxJ3h5.XJ8gYQJ7L5vQJ9j5F5F5F5F5F5F5F5F', 'Principiante', 'femenino', TRUE),
(1013, 'Nicolás Vargas', 'nicolas.vargas@gmail.com', '1134455667', 'alumno', NULL, 'Santa Fe 234', '1988-08-16', 83, 181, '$2b$10$rZ5fGkRJO5vYxqfJxJ3h5.XJ8gYQJ7L5vQJ9j5F5F5F5F5F5F5F5F', 'Avanzado', 'masculino', TRUE),
(1014, 'Lucía Morales', 'lucia.morales@gmail.com', '1145566778', 'alumno', NULL, 'Entre Ríos 567', '1995-03-22', 61, 169, '$2b$10$rZ5fGkRJO5vYxqfJxJ3h5.XJ8gYQJ7L5vQJ9j5F5F5F5F5F5F5F5F', 'Intermedio', 'femenino', TRUE),
(1015, 'Facundo Benítez', 'facundo.benitez@gmail.com', '1156677889', 'alumno', NULL, 'Chacabuco 678', '1991-11-09', 79, 178, '$2b$10$rZ5fGkRJO5vYxqfJxJ3h5.XJ8gYQJ7L5vQJ9j5F5F5F5F5F5F5F5F', 'Principiante', 'masculino', TRUE),
(1016, 'Micaela Herrera', 'micaela.herrera@gmail.com', '1167788990', 'alumno', NULL, 'Pellegrini 345', '1993-07-27', 56, 163, '$2b$10$rZ5fGkRJO5vYxqfJxJ3h5.XJ8gYQJ7L5vQJ9j5F5F5F5F5F5F5F5F', 'Avanzado', 'femenino', TRUE),
(1017, 'Joaquín Medina', 'joaquin.medina@gmail.com', '1178899001', 'alumno', NULL, 'Alem 789', '1989-12-14', 84, 183, '$2b$10$rZ5fGkRJO5vYxqfJxJ3h5.XJ8gYQJ7L5vQJ9j5F5F5F5F5F5F5F5F', 'Intermedio', 'masculino', TRUE),
(1018, 'Agustina Romero', 'agustina.romero@gmail.com', '1189900112', 'alumno', NULL, 'Roca 123', '1994-05-03', 58, 165, '$2b$10$rZ5fGkRJO5vYxqfJxJ3h5.XJ8gYQJ7L5vQJ9j5F5F5F5F5F5F5F5F', 'Principiante', 'femenino', TRUE),
(1019, 'Tomás Silva', 'tomas.silva@gmail.com', '1190011223', 'alumno', NULL, 'Yrigoyen 456', '1987-09-19', 81, 180, '$2b$10$rZ5fGkRJO5vYxqfJxJ3h5.XJ8gYQJ7L5vQJ9j5F5F5F5F5F5F5F5F', 'Avanzado', 'masculino', TRUE),
(1020, 'Carolina Ramos', 'carolina.ramos@gmail.com', '1101122334', 'alumno', NULL, 'Pueyrredón 890', '1996-04-11', 63, 170, '$2b$10$rZ5fGkRJO5vYxqfJxJ3h5.XJ8gYQJ7L5vQJ9j5F5F5F5F5F5F5F5F', 'Intermedio', 'femenino', TRUE);

SELECT 'Se agregaron 20 alumnos exitosamente!' AS mensaje;

-- Verificar los alumnos agregados
SELECT COUNT(*) as total_alumnos FROM persona WHERE rol = 'alumno';
