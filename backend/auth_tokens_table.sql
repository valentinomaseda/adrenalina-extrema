-- Tabla para almacenar tokens de autenticación temporales
-- Para verificación de email y recuperación de contraseña

CREATE TABLE IF NOT EXISTS auth_tokens (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  idPersona INT UNSIGNED NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  tipo ENUM('email_verification', 'password_reset') NOT NULL,
  usado BOOLEAN DEFAULT FALSE,
  expiraEn DATETIME NOT NULL,
  creadoEn DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (idPersona) REFERENCES persona(idPersona) ON DELETE CASCADE,
  INDEX idx_token (token),
  INDEX idx_expiracion (expiraEn),
  INDEX idx_persona_tipo (idPersona, tipo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Agregar campo email_verificado a la tabla persona si no existe
SET @column_exists = (
  SELECT COUNT(*) 
  FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'persona' 
  AND COLUMN_NAME = 'email_verificado'
);

SET @sql = IF(@column_exists = 0, 
  'ALTER TABLE persona ADD COLUMN email_verificado BOOLEAN DEFAULT FALSE AFTER mail',
  'SELECT "Column email_verificado already exists" AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Crear índice en mail para búsquedas rápidas si no existe
SET @index_exists = (
  SELECT COUNT(*) 
  FROM INFORMATION_SCHEMA.STATISTICS 
  WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'persona' 
  AND INDEX_NAME = 'idx_mail'
);

SET @sql = IF(@index_exists = 0, 
  'ALTER TABLE persona ADD INDEX idx_mail (mail)',
  'SELECT "Index idx_mail already exists" AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verificar que todo se creó correctamente
SELECT 'Migration completed successfully!' AS status;
SHOW TABLES LIKE 'auth_tokens';
DESCRIBE auth_tokens;
DESCRIBE persona;
