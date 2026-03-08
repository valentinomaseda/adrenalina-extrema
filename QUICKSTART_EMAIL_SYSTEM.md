# 🚀 Quick Start - Sistema de Emails Transaccionales

## ⚡ Setup Rápido (5 minutos)

### 1️⃣ Configurar Base de Datos

```powershell
# Desde la raíz del proyecto
cd backend
mysql -u root -p adrenalina_extrema < auth_tokens_table.sql
```

### 2️⃣ Instalar Dependencias Backend

```powershell
# Asegúrate de estar en /backend
npm install resend @react-email/components @react-email/render
```

### 3️⃣ Configurar Variables de Entorno

Crea o actualiza `backend/.env`:

```env
RESEND_API_KEY=re_tu_api_key_aqui
EMAIL_FROM=Adrenalina Extrema <noreply@resend.dev>
FRONTEND_URL=http://localhost:5173
```

**Para obtener RESEND_API_KEY:**
1. Ve a [https://resend.com](https://resend.com)
2. Crea una cuenta gratis
3. En el dashboard, ve a "API Keys"
4. Crea una nueva key y cópiala

### 4️⃣ Reiniciar Backend

```powershell
# En /backend
npm run dev
```

### 5️⃣ Probar el Sistema

1. Abre el frontend: `http://localhost:5173`
2. Haz clic en "Regístrate aquí"
3. Completa el formulario con tu email real
4. Revisa tu bandeja de entrada
5. ¡Haz clic en el link de verificación!

---

## 🧪 Testing Rápido

### Verificación de Email
```bash
curl -X POST http://localhost:3000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{"token":"tu_token_aqui"}'
```

### Recuperación de Contraseña
```bash
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

---

## ❌ Problemas Comunes

### "Email no llega"
- ✅ Verifica RESEND_API_KEY en .env
- ✅ Revisa la carpeta de spam
- ✅ Usa un email real (no .test/.local)

### "Token inválido"
- ✅ Los tokens expiran (24h verificación, 1h reset)
- ✅ Solo se pueden usar una vez
- ✅ Solicita uno nuevo si expiró

### "Error al enviar email"
- ✅ Revisa los logs del backend
- ✅ Verifica conexión a internet
- ✅ API Key debe ser válida

---

## 📂 Archivos Clave

```
backend/
├── auth_tokens_table.sql      ← Ejecutar en MySQL
├── utils/emailService.js      ← Servicio de emails
├── routes/auth.js             ← Endpoints de autenticación
├── emails/
│   ├── ConfirmEmail.tsx       ← Template confirmación
│   └── ResetPasswordEmail.tsx ← Template recovery

frontend/
└── src/
    └── views/
        ├── VerifyEmail.jsx    ← Vista verificación
        ├── ForgotPassword.jsx ← Solicitar recovery
        └── ResetPassword.jsx  ← Cambiar contraseña
```

---

## 🎯 Endpoints Disponibles

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/auth/verify-email` | POST | Verifica email con token |
| `/api/auth/resend-verification` | POST | Reenvía email de verificación |
| `/api/auth/forgot-password` | POST | Solicita recuperación |
| `/api/auth/verify-reset-token` | POST | Valida token de reset |
| `/api/auth/reset-password` | POST | Cambia contraseña |

---

## 📖 Documentación Completa

Para más detalles, consulta **EMAIL_SYSTEM_DOCS.md**

---

**¿Todo funciona?** ✨ ¡Perfecto! Ya tienes un sistema de emails transaccionales completo.

**¿Problemas?** 🔧 Revisa los logs del backend y la documentación completa.
