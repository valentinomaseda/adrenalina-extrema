// Middleware para validar requests
export const validateRequest = (schema) => {
  return (req, res, next) => {
    // Implementar validación aquí
    next();
  };
};
