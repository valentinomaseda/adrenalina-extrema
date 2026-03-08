-- Script para marcar como verificados los emails de usuarios existentes con contraseña
-- Esto permite que los usuarios existentes puedan seguir iniciando sesión

-- Marcar como verificados todos los usuarios que ya tienen contraseña
-- (excepto profesores que no necesitan contraseña)
UPDATE persona 
SET email_verificado = TRUE 
WHERE password IS NOT NULL AND password != '';

-- Verificar resultados
SELECT 
  rol,
  COUNT(*) as total,
  SUM(CASE WHEN email_verificado = TRUE THEN 1 ELSE 0 END) as verificados,
  SUM(CASE WHEN email_verificado = FALSE THEN 1 ELSE 0 END) as no_verificados
FROM persona
GROUP BY rol;

SELECT 'Actualización completada!' as status;
