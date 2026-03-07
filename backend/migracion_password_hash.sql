-- Migración: Actualizar campo password para soportar contraseñas hasheadas con bcrypt
-- Las contraseñas hasheadas con bcrypt tienen 60 caracteres

USE `adrenalina_extrema`;

-- Aumentar el tamaño del campo password de VARCHAR(45) a VARCHAR(255)
ALTER TABLE `persona`
MODIFY COLUMN `password` VARCHAR(255) NOT NULL;

-- Verificar cambios
SELECT 'Campo password actualizado correctamente' AS mensaje;
DESCRIBE persona;
