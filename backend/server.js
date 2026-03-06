import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas básicas
app.get('/', (req, res) => {
  res.json({ message: 'API Adrenalina Extrema funcionando' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Importar rutas (descomentar cuando las crees)
// import studentRoutes from './routes/students.js';
// import routineRoutes from './routes/routines.js';
// import exerciseRoutes from './routes/exercises.js';

// Usar rutas (descomentar cuando las crees)
// app.use('/api/students', studentRoutes);
// app.use('/api/routines', routineRoutes);
// app.use('/api/exercises', exerciseRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal!' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
