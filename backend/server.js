const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const conectarDB = require('./config/db');
const movimientoRoutes = require('./routes/movimientoRoutes');

// Carga las variables del archivo .env en process.env
dotenv.config();
conectarDB();

const app = express();

// Permite peticiones desde el frontend (aunque esté en otro puerto u origen)
app.use(cors());
// Permite leer el cuerpo de las peticiones en formato JSON (req.body)
app.use(express.json());

// Ruta de prueba para comprobar que la API responde
app.get('/', function (req, res) {
    res.json({ mensaje: 'API del gestor de ingresos y gastos funcionando' });
});

// Conecta todas las rutas de movimientos bajo el prefijo /api/movimientos
app.use('/api/movimientos', movimientoRoutes);

const puerto = process.env.PORT || 3000;

// Arranca el servidor HTTP en el puerto configurado
app.listen(puerto, function () {
    console.log('Servidor escuchando en http://localhost:' + puerto);
});
