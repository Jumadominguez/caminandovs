// Middleware para respuestas API consistentes
export const apiResponse = (req: any, res: any, next: any) => {
  // Método para respuestas exitosas
  res.success = (data: any, message = 'Operación exitosa', statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  };

  // Método para respuestas de error
  res.error = (message = 'Error interno del servidor', statusCode = 500, errors = null) => {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString()
    });
  };

  next();
};

// Middleware para manejo de errores global
export const errorHandler = (err: any, req: any, res: any, next: any) => {
  console.error('Error:', err);

  // Errores de validación de Mongoose
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e: any) => e.message);
    return res.error('Datos de entrada inválidos', 400, errors);
  }

  // Errores de duplicados de MongoDB
  if (err.code === 11000) {
    return res.error('Registro duplicado', 409);
  }

  // Errores de cast de MongoDB
  if (err.name === 'CastError') {
    return res.error('ID inválido', 400);
  }

  // Error por defecto
  res.error('Error interno del servidor', 500);
};
