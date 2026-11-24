const express = require('express');
const router = express.Router();
const movimientoController = require('../controllers/movimientoController');

// Asocia cada ruta de /api/movimientos con su función del controlador
router.get('/', movimientoController.obtenerMovimientos);
router.get('/:id', movimientoController.obtenerMovimientoPorId);
router.post('/', movimientoController.crearMovimiento);
router.put('/:id', movimientoController.actualizarMovimiento);
router.delete('/:id', movimientoController.eliminarMovimiento);

module.exports = router;
