# 📦 Dependencias a Instalar

## Backend

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "mysql2": "^3.6.5",
    "bcrypt": "^5.1.1",
    "resend": "^3.0.0",              // ← NUEVA
    "@react-email/components": "^0.0.25",  // ← NUEVA
    "@react-email/render": "^0.0.17"       // ← NUEVA
  }
}
```

### Comando de Instalación
```bash
cd backend
npm install resend @react-email/components @react-email/render
```

---

## Frontend

✅ **No se requieren dependencias adicionales**

El proyecto ya tiene todo lo necesario:
- `lucide-react` (iconos)
- `react` y `react-dom`
- Tailwind CSS

---

## Variables de Entorno

### `backend/.env`
```env
# Configuración existente
DB_HOST=localhost
DB_PORT=3306
DB_NAME=adrenalina_extrema
DB_USER=root
DB_PASSWORD=tu_password

PORT=3000

# ⚡ NUEVAS VARIABLES REQUERIDAS
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=Adrenalina Extrema <noreply@resend.dev>
FRONTEND_URL=http://localhost:5173
```

### `frontend/.env` (opcional, si no existe)
```env
VITE_API_URL=http://localhost:3000
```

---

## 🔑 Obtener API Key de Resend

1. Ve a [https://resend.com](https://resend.com)
2. Crea cuenta (tiene plan gratuito)
3. Dashboard → API Keys → Create API Key
4. Copia la key y pégala en `backend/.env`

**Plan Gratuito de Resend:**
- ✅ 100 emails/día
- ✅ 3,000 emails/mes
- ✅ Ideal para desarrollo y testing
- ✅ No requiere tarjeta de crédito

---

## 📋 Checklist de Setup

- [ ] Ejecutar `auth_tokens_table.sql` en MySQL
- [ ] Instalar dependencias backend: `npm install resend @react-email/components @react-email/render`
- [ ] Crear cuenta en Resend y obtener API Key
- [ ] Agregar variables de entorno en `backend/.env`
- [ ] Reiniciar servidor backend
- [ ] Probar registro con email real

---

## 🧪 Verificar Instalación

```bash
# Desde /backend
node -e "console.log(require('resend'))"
node -e "console.log(require('@react-email/render'))"
```

Si no hay errores, ✅ todo está instalado correctamente.

---

## 📝 Scripts SQL Requeridos

### 1. Crear tabla auth_tokens
```sql
-- Ver archivo: backend/auth_tokens_table.sql
```

### 2. Agregar columna email_verificado
```sql
ALTER TABLE persona 
ADD COLUMN email_verificado BOOLEAN DEFAULT FALSE AFTER mail;
```

Ambos están incluidos en `auth_tokens_table.sql`.

---

## 🚀 Next Steps

1. **Instalar dependencias** ← Empieza aquí
2. Configurar variables de entorno
3. Ejecutar migrations SQL
4. Reiniciar backend
5. Probar el sistema

Ver **QUICKSTART_EMAIL_SYSTEM.md** para guía paso a paso.
