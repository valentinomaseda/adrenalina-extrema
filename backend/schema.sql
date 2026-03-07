-- Base de datos para Adrenalina Extrema
-- MySQL Schema

CREATE DATABASE IF NOT EXISTS adrenalina_extrema;
USE adrenalina_extrema;

-- Tabla de Estudiantes
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50),
    age INT,
    goal TEXT,
    level ENUM('principiante', 'intermedio', 'avanzado') DEFAULT 'principiante',
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de Ejercicios
CREATE TABLE IF NOT EXISTS exercises (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    muscle_group VARCHAR(100),
    description TEXT,
    video_url VARCHAR(500),
    instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de Rutinas
CREATE TABLE IF NOT EXISTS routines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration_weeks INT,
    goal TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Tabla de Días de Entrenamiento
CREATE TABLE IF NOT EXISTS routine_days (
    id INT AUTO_INCREMENT PRIMARY KEY,
    routine_id INT NOT NULL,
    day_number INT NOT NULL,
    day_name VARCHAR(50),
    focus VARCHAR(100),
    notes TEXT,
    FOREIGN KEY (routine_id) REFERENCES routines(id) ON DELETE CASCADE
);

-- Tabla de Ejercicios en Días (relación N:M)
CREATE TABLE IF NOT EXISTS routine_exercises (
    id INT AUTO_INCREMENT PRIMARY KEY,
    routine_day_id INT NOT NULL,
    exercise_id INT NOT NULL,
    order_in_day INT DEFAULT 0,
    sets INT DEFAULT 3,
    reps VARCHAR(50),
    rest_seconds INT DEFAULT 60,
    notes TEXT,
    FOREIGN KEY (routine_day_id) REFERENCES routine_days(id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
);

-- Tabla de Progreso (opcional, para tracking futuro)
CREATE TABLE IF NOT EXISTS progress_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    routine_id INT,
    date DATE NOT NULL,
    weight DECIMAL(5,2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (routine_id) REFERENCES routines(id) ON DELETE SET NULL
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_student_email ON students(email);
CREATE INDEX idx_routine_student ON routines(student_id);
CREATE INDEX idx_routine_day ON routine_days(routine_id);
CREATE INDEX idx_progress_student ON progress_logs(student_id);
CREATE INDEX idx_progress_date ON progress_logs(date);
