-- Script para corregir el tipo de dato del campo teléfono
-- El teléfono debe ser VARCHAR porque:
-- 1. Los números pueden ser muy grandes (superan el rango de INT)
-- 2. Pueden incluir caracteres especiales (+, -, espacios, paréntesis)
-- 3. No se usan para cálculos matemáticos

USE adrenalina_extrema;

-- Modificar la columna tel de INT a VARCHAR(20)
ALTER TABLE persona 
MODIFY COLUMN tel VARCHAR(20) NULL;

-- Verificar el cambio
DESCRIBE persona;

-- Mensaje de confirmación
SELECT 'La columna tel ha sido modificada exitosamente a VARCHAR(20)' as Resultado;
