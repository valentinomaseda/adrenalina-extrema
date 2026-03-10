import jwt from 'jsonwebtoken';

// Middleware para logging de requests
export const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
};

// Middleware para CORS adicional si es necesario
export const corsConfig = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware para manejo de errores async
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Clave secreta para JWT (en producción debe estar en .env)
const JWT_SECRET = process.env.JWT_SECRET || 'adrenalina-extrema-secret-key-2024';

// Middleware de autenticación - Verifica JWT
export const authenticateToken = (req, res, next) => {
  // Obtener token del header Authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ 
      error: 'Acceso denegado. No se proporcionó token de autenticación.' 
    });
  }

  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Agregar información del usuario al request
    req.user = {
      idPersona: decoded.idPersona,
      email: decoded.email,
      rol: decoded.rol,
      nombre: decoded.nombre
    };
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expirado. Por favor, inicia sesión nuevamente.' 
      });
    }
    
    return res.status(403).json({ 
      error: 'Token inválido.' 
    });
  }
};

// Middleware de autorización por rol - Verifica roles permitidos
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    // Este middleware debe usarse DESPUÉS de authenticateToken
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Usuario no autenticado.' 
      });
    }

    // Verificar si el rol del usuario está en los roles permitidos
    if (!allowedRoles.includes(req.user.rol)) {
      return res.status(403).json({ 
        error: 'No tienes permisos para acceder a este recurso.',
        requiredRoles: allowedRoles,
        userRole: req.user.rol
      });
    }

    next();
  };
};

// Función helper para generar JWT
export const generateToken = (persona) => {
  return jwt.sign(
    {
      idPersona: persona.idPersona,
      email: persona.mail,
      rol: persona.rol,
      nombre: persona.nombre
    },
    JWT_SECRET,
    { expiresIn: '7d' } // Token válido por 7 días
  );
};
