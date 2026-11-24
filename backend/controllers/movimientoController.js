const mongoose = require('mongoose');
const Movimiento = require('../models/Movimiento');

// Devuelve todos los movimientos ordenados del más reciente al más antiguo
async function obtenerMovimientos(req, res) {
    try {
        // -1 ordena de forma descendente (primero por fecha y, si empatan, por fecha de creación)
        const movimientos = await Movimiento.find().sort({ fecha: -1, createdAt: -1 });
        res.status(200).json(movimientos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los movimientos', error: error.message });
    }
}

// Busca y devuelve un único movimiento usando su ID de MongoDB
async function obtenerMovimientoPorId(req, res) {
    try {
        const id = req.params.id;

        // Comprueba que el ID tiene el formato válido de MongoDB antes de buscar
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ mensaje: 'ID de movimiento no válido' });
        }

        const movimiento = await Movimiento.findById(id);

        if (!movimiento) {
            return res.status(404).json({ mensaje: 'Movimiento no encontrado' });
        }

        res.status(200).json(movimiento);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el movimiento', error: error.message });
    }
}

// Crea y guarda un nuevo movimiento en la base de datos
async function crearMovimiento(req, res) {
    try {
        const { concepto, cantidad, tipo, categoria, fecha } = req.body;

        const datosMovimiento = {
            concepto: concepto,
            cantidad: cantidad,
            tipo: tipo,
            categoria: categoria
        };

        // Solo añade la fecha si viene en la petición. Si no, Mongoose usa Date.now
        if (fecha) {
            datosMovimiento.fecha = fecha;
        }

        const nuevoMovimiento = new Movimiento(datosMovimiento);
        const movimientoGuardado = await nuevoMovimiento.save();

        res.status(201).json(movimientoGuardado);
    } catch (error) {
        // ValidationError ocurre si algún campo incumple las reglas del modelo
        if (error.name === 'ValidationError') {
            return res.status(400).json({ mensaje: 'Datos no válidos', error: error.message });
        }
        res.status(500).json({ mensaje: 'Error al crear el movimiento', error: error.message });
    }
}

// Actualiza los datos de un movimiento existente por su ID
async function actualizarMovimiento(req, res) {
    try {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ mensaje: 'ID de movimiento no válido' });
        }

        const { concepto, cantidad, tipo, categoria, fecha } = req.body;
        const datosActualizados = {};

        // Se añaden solo los campos que el cliente haya enviado para actualizar
        if (concepto !== undefined) {
            datosActualizados.concepto = concepto;
        }
        if (cantidad !== undefined) {
            datosActualizados.cantidad = cantidad;
        }
        if (tipo !== undefined) {
            datosActualizados.tipo = tipo;
        }
        if (categoria !== undefined) {
            datosActualizados.categoria = categoria;
        }
        if (fecha !== undefined && fecha !== '') {
            datosActualizados.fecha = fecha;
        }

        const movimientoActualizado = await Movimiento.findByIdAndUpdate(
            id,
            datosActualizados,
            // new: true devuelve el documento ya actualizado 
            // runValidators aplica las reglas del esquema
            { new: true, runValidators: true }
        );

        if (!movimientoActualizado) {
            return res.status(404).json({ mensaje: 'Movimiento no encontrado' });
        }

        res.status(200).json(movimientoActualizado);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ mensaje: 'Datos no válidos', error: error.message });
        }
        res.status(500).json({ mensaje: 'Error al actualizar el movimiento', error: error.message });
    }
}

// Elimina un movimiento de la base de datos por su ID
async function eliminarMovimiento(req, res) {
    try {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ mensaje: 'ID de movimiento no válido' });
        }

        const movimientoEliminado = await Movimiento.findByIdAndDelete(id);

        if (!movimientoEliminado) {
            return res.status(404).json({ mensaje: 'Movimiento no encontrado' });
        }

        res.status(200).json({ mensaje: 'Movimiento eliminado correctamente', movimiento: movimientoEliminado });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el movimiento', error: error.message });
    }
}

module.exports = {
    obtenerMovimientos,
    obtenerMovimientoPorId,
    crearMovimiento,
    actualizarMovimiento,
    eliminarMovimiento
};
