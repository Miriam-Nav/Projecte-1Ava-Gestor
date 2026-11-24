const mongoose = require('mongoose');

// Esquema que define la estructura y validaciones de cada movimiento en MongoDB
const movimientoSchema = new mongoose.Schema(
    {
        concepto: {
            type: String,
            required: [true, 'El concepto es obligatorio'],
            // Elimina espacios sobrantes al principio y al final
            trim: true
        },
        cantidad: {
            type: Number,
            required: [true, 'La cantidad es obligatoria'],
            min: [0.01, 'La cantidad debe ser mayor que 0']
        },
        tipo: {
            type: String,
            required: [true, 'El tipo es obligatorio'],
            // Solo permite guardar uno de estos dos valores exactos
            enum: {
                values: ['ingreso', 'gasto'],
                message: 'El tipo debe ser "ingreso" o "gasto"'
            }
        },
        categoria: {
            type: String,
            required: [true, 'La categoría es obligatoria'],
            trim: true
        },
        fecha: {
            type: Date,
            required: [true, 'La fecha es obligatoria'],
            // Si no se envía fecha, guarda la fecha y hora actuales
            default: Date.now
        }
    },
    {
        // Crea automáticamente los campos createdAt y updatedAt
        timestamps: true
    }
);

// Crea el modelo 'Movimiento' a partir del esquema (colección 'movimientos' en MongoDB)
const Movimiento = mongoose.model('Movimiento', movimientoSchema);

module.exports = Movimiento;
