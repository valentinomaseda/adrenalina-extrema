# Sistema de Correos Transaccionales - Documentación de Implementación

## 📧 Resumen

Se ha implementado un sistema completo de correos transaccionales usando **Resend** y **React Email** para:

1. **Confirmación de registro**: Validar el email del alumno tras el alta
2. **Recuperación de contraseña**: Flujo seguro de reset de contraseña

---

## 🗂️ Archivos Creados

### Backend

#### 📄 SQL y Base de Datos
- **`backend/auth_tokens_table.sql`**: Script SQL para crear la tabla de tokens de autenticación
  - Tabla `auth_tokens`: Almacena tokens temporales con tipo, expiración y estado
  - Columna `email_verificado` en tabla `persona`
  - Índices optimizados para búsquedas

#### 📧 Email Templates (React Email)
- **`backend/emails/ConfirmEmail.tsx`**: Template de confirmación de email
- **`backend/emails/ResetPasswordEmail.tsx`**: Template de recuperación de contraseña
- **`backend/emails/package.json`**: Dependencias de React Email

**Características de los templates**:
- Diseño inline con colores de la marca (#00BFFF, #0a0e1a, #1a2942)
- Compatibilidad máxima con clientes de email
- Responsivos y accesibles
- Botones de acción claros

#### 🔧 Servicios y Utilidades
- **`backend/utils/emailService.js`**: Servicio principal de emails con Resend
  - `enviarEmailConfirmacion()`: Envía email de confirmación
  - `enviarEmailRecuperacion()`: Envía email de reset
  - `verificarEmailToken()`: Valida token de verificación
  - `verificarResetToken()`: Valida token de reset
  - Generación de tokens criptográficamente seguros
  - Gestión de expiración (24h para verificación, 1h para reset)

#### 🛣️ Rutas API
- **`backend/routes/auth.js`**: Endpoints de autenticación
  - `POST /api/auth/verify-email`: Verifica email con token
  - `POST /api/auth/resend-verification`: Reenvía email de verificación
  - `POST /api/auth/forgot-password`: Inicia recuperación de contraseña
  - `POST /api/auth/verify-reset-token`: Verifica validez de token (sin consumir)
  - `POST /api/auth/reset-password`: Cambia contraseña con token

#### 🔄 Actualizaciones
- **`backend/server.js`**: Agregada ruta `/api/auth`
- **`backend/controllers/personaController.js`**: 
  - Importado `enviarEmailConfirmacion`
  - Envío automático de email al registrarse

### Frontend

#### 🖼️ Vistas
- **`frontend/src/views/VerifyEmail.jsx`**: Vista de verificación de email
  - Estados: verificando, éxito, error
  - Botón de reenvío de email
  - Auto-redirect al login tras éxito

- **`frontend/src/views/ForgotPassword.jsx`**: Vista de solicitud de recuperación
  - Formulario de email con validación
  - Mensaje de confirmación seguro
  - Estados de carga

- **`frontend/src/views/ResetPassword.jsx`**: Vista de cambio de contraseña
  - Verificación automática de token
  - Campos de password con toggle de visibilidad
  - Indicador de fortaleza de contraseña
  - Validación de coincidencia

#### 🔄 Actualizaciones
- **`frontend/src/context/AppContext.jsx`**: 
  - Nuevo estado `authView` para navegación entre vistas de auth
  - Export de `setAuthView` en context

- **`frontend/src/App.jsx`**: 
  - Importación de nuevas vistas
  - Lógica de routing para vistas de autenticación
  - Detección de tokens en URL

- **`frontend/src/views/Login.jsx`**: 
  - Agregado link "¿Olvidaste tu contraseña?"
  - Uso de `setAuthView` para navegación

---

## 🔧 Configuración Requerida

### Variables de Entorno - Backend

Agregar al archivo **`.env`** en `/backend`:

```env
# Resend API Key (obtener en https://resend.com)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx

# Email remitente (debe estar verificado en Resend)
EMAIL_FROM=Adrenalina Extrema <noreply@tudominio.com>

# URL del frontend para links en emails
FRONTEND_URL=http://localhost:5173
# FRONTEND_URL=https://tu-dominio.com  # En producción
```

### Variables de Entorno - Frontend

Agregar al archivo **`.env`** en `/frontend` (si no existe):

```env
# URL de la API backend
VITE_API_URL=http://localhost:3000
# VITE_API_URL=https://api.tudominio.com  # En producción
```

---

## 📦 Instalación de Dependencias

### Backend

```powershell
cd backend

# Instalar Resend
npm install resend

# Instalar React Email y dependencias
npm install @react-email/components @react-email/render

# Si usas el preview de React Email (opcional)
cd emails
npm install
```

### Frontend

No se requieren dependencias adicionales. El proyecto ya tiene `lucide-react` instalado.

---

## 🚀 Pasos de Implementación

### 1. Configurar Base de Datos

Ejecutar el script SQL en MySQL:

```powershell
cd backend
mysql -u root -p adrenalina_extrema < auth_tokens_table.sql
```

O ejecutar directamente en tu cliente MySQL:
```sql
-- Copiar y pegar el contenido de auth_tokens_table.sql
```

### 2. Configurar Resend

1. Crear cuenta en [https://resend.com](https://resend.com)
2. Verificar tu dominio de email (o usar el dominio de prueba)
3. Obtener API Key desde el dashboard
4. Agregar la API Key al `.env` backend

### 3. Instalar Dependencias Backend

```powershell
cd backend
npm install resend @react-email/components @react-email/render
```

### 4. Reiniciar el Servidor Backend

```powershell
npm run dev
# o
node server.js
```

### 5. Probar el Sistema

#### A. Probar desde Frontend:
1. Ir a `http://localhost:5173`
2. Hacer clic en "Regístrate aquí"
3. Completar el formulario de registro
4. Verificar que llegue el email de confirmación
5. Hacer clic en el link del email
6. Debería redirigir a la vista de verificación

#### B. Probar Recuperación de Contraseña:
1. En login, hacer clic en "¿Olvidaste tu contraseña?"
2. Ingresar email
3. Verificar email de recuperación
4. Hacer clic en el link
5. Ingresar nueva contraseña

---

## 🧪 Testing Manual

### Endpoints de API

#### 1. Verificar Email
```bash
POST http://localhost:3000/api/auth/verify-email
Content-Type: application/json

{
  "token": "token_generado_por_sistema"
}
```

#### 2. Solicitar Recuperación
```bash
POST http://localhost:3000/api/auth/forgot-password
Content-Type: application/json

{
  "email": "alumno@test.com"
}
```

#### 3. Cambiar Contraseña
```bash
POST http://localhost:3000/api/auth/reset-password
Content-Type: application/json

{
  "token": "token_de_reset",
  "newPassword": "nuevaPass123"
}
```

---

## 🔐 Seguridad Implementada

### Tokens
- ✅ Tokens criptográficamente seguros (32 bytes)
- ✅ Expiración automática (24h verificación, 1h reset)
- ✅ Un solo uso (marcados como `usado = TRUE`)
- ✅ Vinculados a usuario específico
- ✅ Tipo específico (verificación vs reset)

### Emails
- ✅ No revelar existencia de cuentas en forgot-password
- ✅ Links únicos y no reutilizables
- ✅ Mensajes claros sobre expiración
- ✅ Warnings de seguridad

### Contraseñas
- ✅ Bcrypt con SALT_ROUNDS=10
- ✅ Validación de longitud mínima (6 caracteres)
- ✅ Hash en backend antes de guardar

---

## 📱 Flujos de Usuario

### Flujo de Registro
```
1. Usuario completa formulario → POST /api/personas/register
2. Backend crea cuenta → Genera token → Envía email
3. Usuario recibe email → Hace clic en link
4. Frontend carga VerifyEmail → POST /api/auth/verify-email
5. Backend valida token → Marca email_verificado = TRUE
6. Redirect automático a login
```

### Flujo de Recovery
```
1. Usuario hace clic "Olvidé contraseña"
2. Ingresa email → POST /api/auth/forgot-password
3. Backend genera token → Envía email (si cuenta existe)
4. Usuario recibe email → Hace clic en link
5. Frontend carga ResetPassword → Verifica token
6. Usuario ingresa nueva password → POST /api/auth/reset-password
7. Backend actualiza password → Marca token usado
8. Redirect a login
```

---

## 🎨 Diseño UI/UX

### Paleta de Colores (consistente con la app)
- **Primary**: `#00BFFF` (Cyan brillante)
- **Secondary**: `#1E40AF` (Azul oscuro)
- **Background**: `#0a0e1a` (Casi negro)
- **Card BG**: `#1a2942` (Azul grisáceo)
- **Text**: `#F3F4F6` (Gris claro)
- **Success**: `#10B981` (Verde)
- **Error**: `#EF4444` (Rojo)

### Componentes Reutilizados
- Iconos: Lucide React (`Mail`, `Lock`, `Eye`, `CheckCircle`, etc.)
- Estados de carga: `Loader2` animado
- Botones: Estilo consistente con active scale
- Inputs: Bordes azules, focus rings

### Responsive
- ✅ Mobile-first design
- ✅ Padding y spacing optimizados
- ✅ Botones táctiles grandes
- ✅ Textos legibles en todo tamaño

---

## 🐛 Troubleshooting

### Email no llega
1. Verificar RESEND_API_KEY en .env
2. Verificar EMAIL_FROM esté verificado en Resend
3. Revisar logs del backend para errores
4. Verificar spam/promociones en email

### Token inválido o expirado
1. Verificar que la tabla auth_tokens existe
2. Revisar que los tokens no estén marcados como `usado = TRUE`
3. Verificar tiempo de expiración en `expiraEn`
4. Regenerar token con "Reenviar Email"

### Frontend no carga vistas
1. Verificar que todos los archivos estén en `/frontend/src/views/`
2. Verificar imports en App.jsx
3. Limpiar cache: `npm run build` y reload
4. Revisar consola del navegador

### Error de CORS
1. Verificar VITE_API_URL apunte al backend correcto
2. Backend debe tener `cors()` middleware activo
3. Revisar que el puerto del backend sea el configurado

---

## 📊 Estructura de Datos

### Tabla `auth_tokens`
```sql
CREATE TABLE auth_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  idPersona INT NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  tipo ENUM('email_verification', 'password_reset'),
  usado BOOLEAN DEFAULT FALSE,
  expiraEn DATETIME NOT NULL,
  creadoEn DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (idPersona) REFERENCES persona(idPersona)
);
```

### Tabla `persona` (columna agregada)
```sql
ALTER TABLE persona 
ADD COLUMN email_verificado BOOLEAN DEFAULT FALSE;
```

---

## 🔄 Próximos Pasos Opcionales

### Mejoras Futuras
- [ ] Agregar rate limiting en endpoints de email
- [ ] Implementar CAPTCHA en forgot-password
- [ ] Agregar templates para emails de bienvenida
- [ ] Notificaciones de cambio de contraseña exitoso
- [ ] Dashboard de emails enviados
- [ ] Testing automatizado con Jest
- [ ] Logs centralizados de eventos de autenticación
- [ ] Soporte multi-idioma en emails

### Monitoreo
- Revisar logs de Resend dashboard
- Monitorear tasa de verificación de emails
- Trackear intentos de reset fallidos
- Analizar bounces y spam reports

---

## 📞 Soporte

Para problemas o preguntas:
1. Revisar esta documentación
2. Verificar logs del backend (`console.log`)
3. Revisar dashboard de Resend
4. Contactar al equipo de desarrollo

---

## ✅ Checklist de Producción

Antes de llevar a producción:

- [ ] Actualizar `FRONTEND_URL` a dominio real
- [ ] Actualizar `EMAIL_FROM` con dominio verificado
- [ ] Obtener API Key de producción de Resend
- [ ] Configurar DNS (SPF, DKIM, DMARC)
- [ ] Testear en entorno staging
- [ ] Implementar rate limiting
- [ ] Configurar alertas de errores
- [ ] Backup de base de datos
- [ ] Documentar runbook de operaciones
- [ ] Capacitar al equipo de soporte

---

**Documentación creada:** 2026-03-08  
**Versión:** 1.0.0  
**Autor:** Sistema de IA - GitHub Copilot
