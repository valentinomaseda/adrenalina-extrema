# 🔧 Solución al ERROR de Teléfono Fuera de Rango

## ❌ Problema
El campo `tel` está definido como `INT` en la base de datos, lo que causa el error:
```
Out of range value for column 'tel' at row 1
```

Los números de teléfono argentinos (ej: 2478471801) son muy grandes y superan el límite de INT.

## ✅ Solución Implementada

### 1. Base de Datos
He creado el script `fix_telefono.sql` que cambia el tipo de dato de `tel` de `INT` a `VARCHAR(20)`.

**Ejecuta este script en MySQL:**

#### Opción A: MySQL Workbench
1. Abre MySQL Workbench
2. Conecta a tu base de datos
3. Abre el archivo `backend/fix_telefono.sql`
4. Haz clic en el botón ⚡ (Execute)

#### Opción B: Línea de comandos
Si tienes MySQL en el PATH:
```bash
cd backend
mysql -u root -p adrenalina_extrema < fix_telefono.sql
```

#### Opción C: Ejecutar manualmente
Abre MySQL Workbench o tu cliente MySQL y ejecuta:
```sql
USE adrenalina_extrema;
ALTER TABLE persona MODIFY COLUMN tel VARCHAR(20) NULL;
```

### 2. Código Frontend
✅ **Ya está solucionado** - El código ahora envía el teléfono como string:
- Archivo: `frontend/src/context/AppContext.jsx`
- Cambio: `tel: studentData.phone || ''` (antes era `parseInt(studentData.phone)`)

## 🎯 Después de Aplicar el Script

1. Reinicia el servidor backend si está corriendo
2. Intenta crear un nuevo alumno
3. El teléfono ahora se guardará correctamente sin errores

## 📝 Notas
- El campo `tel` ahora acepta hasta 20 caracteres
- Puede contener cualquier formato: "1234567890", "+54 9 11 1234-5678", etc.
- Es NULL por defecto, así que es opcional
