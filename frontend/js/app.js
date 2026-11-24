// ==========================================================
// Gestor de Ingresos y Gastos - Lógica del frontend
// ==========================================================

// Dirección del backend (API REST)
const API_URL = 'http://localhost:3000/api/movimientos';

// Clave para guardar los filtros en localStorage
const CLAVE_FILTROS = 'gestor_gastos_filtros';

// Expresiones regulares para validar concepto (3-80 caracteres) y fecha (AAAA-MM-DD)
const REGEX_CONCEPTO = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s.,()\-/]{3,80}$/;
const REGEX_FECHA = /^\d{4}-\d{2}-\d{2}$/;

// ---------- DOM ----------
const tituloFormulario = document.getElementById('titulo-formulario');
const formulario = document.getElementById('formulario-movimiento');
const inputId = document.getElementById('movimiento-id');
const inputTipo = document.getElementById('tipo');
const inputCantidad = document.getElementById('cantidad');
const inputCategoria = document.getElementById('categoria');
const inputFecha = document.getElementById('fecha');
const inputConcepto = document.getElementById('concepto');
const btnGuardar = document.getElementById('btn-guardar');
const btnCancelar = document.getElementById('btn-cancelar');

const filtroTipo = document.getElementById('filtro-tipo');
const filtroCategoria = document.getElementById('filtro-categoria');
const filtroMes = document.getElementById('filtro-mes');
const btnLimpiarFiltros = document.getElementById('btn-limpiar-filtros');

const listaMovimientosTabla = document.getElementById('lista-movimientos');
const mensajeVacio = document.getElementById('mensaje-vacio');
const mensajeFormulario = document.getElementById('mensaje-formulario');
const totalIngresos = document.getElementById('total-ingresos');
const totalGastos = document.getElementById('total-gastos');
const balanceTotal = document.getElementById('balance-total');

// Todos los movimientos que llegan del backend
let listaMovimientos = [];

// ---------- Funciones ----------

// Pone la fecha de hoy en el input de fecha (formato AAAA-MM-DD)
function establecerFechaActual() {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    inputFecha.value = anio + '-' + mes + '-' + dia;
}

// Convierte un número en texto de euros. ( 1234.5 -> "1.234,50 €" )
function formatearEuros(numero) {
    return Number(numero).toLocaleString('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }) + ' €';
}

// Convierte la fecha recibida en JSON a objeto Date y la formatea en español (DD/MM/AAAA)
function formatearFecha(fechaIso) {
    if (!fechaIso) {
        return '';
    }
    const fecha = new Date(fechaIso);
    return fecha.toLocaleDateString('es-ES');
}

// Muestra un mensaje de aviso debajo del formulario ( exito o error )
function mostrarMensaje(texto, tipo) {
    mensajeFormulario.textContent = texto;
    mensajeFormulario.classList.remove('oculto', 'mensaje-exito', 'mensaje-error');

    if (tipo === 'exito') {
        mensajeFormulario.classList.add('mensaje-exito');
    } else {
        mensajeFormulario.classList.add('mensaje-error');
    }
}

// Oculta el mensaje de estado del formulario
function ocultarMensaje() {
    mensajeFormulario.textContent = '';
    mensajeFormulario.classList.add('oculto');
    mensajeFormulario.classList.remove('mensaje-exito', 'mensaje-error');
}

// ---------- Conexión con el backend (CRUD) ----------

// Obtiene todos los movimientos desde la API (GET)
async function cargarMovimientos() {
    try {
        // Se realiza la petición GET a la API_URL y guarda la respuesta
        const respuesta = await fetch(API_URL);

        if (!respuesta.ok) {
            throw new Error('No se pudieron cargar los movimientos');
        }

        listaMovimientos = await respuesta.json();
        aplicarFiltros();
    } catch (error) {
        mostrarMensaje('Error al conectar con el servidor: ' + error.message, 'error');
    }
}

// Calcula y pinta Total ingresos, Total gastos y Balance total
function actualizarResumen(movimientos) {
    let sumaIngresos = 0;
    let sumaGastos = 0;

    // Recorre el array de movimientos y suma la cantidad según el tipo
    for (let i = 0; i < movimientos.length; i++) {
        const movimiento = movimientos[i];
        const importe = Number(movimiento.cantidad) || 0;

        if (movimiento.tipo === 'ingreso') {
            sumaIngresos = sumaIngresos + importe;
        } else {
            sumaGastos = sumaGastos + importe;
        }
    }

    // Calcula el balance final
    const balance = sumaIngresos - sumaGastos;

    // Muestra los resultados
    totalIngresos.textContent = formatearEuros(sumaIngresos);
    totalGastos.textContent = formatearEuros(sumaGastos);
    balanceTotal.textContent = formatearEuros(balance);

    // Colorea el balance según sea positivo, negativo o cero
    balanceTotal.classList.remove('cantidad-ingreso', 'cantidad-gasto');
    if (balance > 0) {
        balanceTotal.classList.add('cantidad-ingreso');
    } else if (balance < 0) {
        balanceTotal.classList.add('cantidad-gasto');
    }
}

// Crea las filas de la tabla a partir del array de movimientos recibido
function renderizarMovimientos(movimientos) {
    // Limpia la tabla
    listaMovimientosTabla.innerHTML = '';

    // Si no hay movimientos, muestra el mensaje de "vacio"
    if (movimientos.length === 0) {
        mensajeVacio.classList.remove('oculto');
        return;
    }

    // Oculta el mensaje de "vacio"
    mensajeVacio.classList.add('oculto');

    for (let i = 0; i < movimientos.length; i++) {
        const movimiento = movimientos[i];
        const fila = document.createElement('tr');

        // Celda Fecha
        const celdaFecha = document.createElement('td');
        celdaFecha.textContent = formatearFecha(movimiento.fecha);
        fila.appendChild(celdaFecha);

        // Celda Concepto
        const celdaConcepto = document.createElement('td');
        celdaConcepto.textContent = movimiento.concepto;
        fila.appendChild(celdaConcepto);

        // Celda Categoría
        const celdaCategoria = document.createElement('td');
        celdaCategoria.textContent = movimiento.categoria;
        fila.appendChild(celdaCategoria);

        // Celda Tipo con etiqueta de color
        const celdaTipo = document.createElement('td');
        const etiquetaTipo = document.createElement('span');
        etiquetaTipo.textContent = movimiento.tipo;
        etiquetaTipo.classList.add('etiqueta');
        if (movimiento.tipo === 'ingreso') {
            etiquetaTipo.classList.add('etiqueta-ingreso');
        } else {
            etiquetaTipo.classList.add('etiqueta-gasto');
        }
        celdaTipo.appendChild(etiquetaTipo);
        fila.appendChild(celdaTipo);

        // Celda Cantidad (con signo + o - según el tipo)
        const celdaCantidad = document.createElement('td');
        if (movimiento.tipo === 'ingreso') {
            celdaCantidad.textContent = '+ ' + formatearEuros(movimiento.cantidad);
            celdaCantidad.classList.add('cantidad-ingreso');
        } else {
            celdaCantidad.textContent = '- ' + formatearEuros(movimiento.cantidad);
            celdaCantidad.classList.add('cantidad-gasto');
        }
        fila.appendChild(celdaCantidad);

        // Celda Acciones (botones Editar y Eliminar)
        const celdaAcciones = document.createElement('td');
        const contenedorAcciones = document.createElement('div');
        contenedorAcciones.classList.add('celda-acciones');

        const botonEditar = document.createElement('button');
        botonEditar.type = 'button';
        botonEditar.textContent = 'Editar';
        botonEditar.classList.add('btn', 'btn-editar');
        botonEditar.addEventListener('click', function () {
            prepararEdicion(movimiento);
        });

        const botonEliminar = document.createElement('button');
        botonEliminar.type = 'button';
        botonEliminar.textContent = 'Eliminar';
        botonEliminar.classList.add('btn', 'btn-eliminar');
        botonEliminar.addEventListener('click', function () {
            eliminarMovimiento(movimiento._id);
        });

        contenedorAcciones.appendChild(botonEditar);
        contenedorAcciones.appendChild(botonEliminar);
        celdaAcciones.appendChild(contenedorAcciones);
        fila.appendChild(celdaAcciones);

        listaMovimientosTabla.appendChild(fila);
    }
}

// Envía el formulario para crear (POST) o actualizar (PUT) un movimiento
async function manejarEnvioFormulario(evento) {
    evento.preventDefault();
    ocultarMensaje();

    const datosMovimiento = {
        tipo: inputTipo.value,
        cantidad: parseFloat(inputCantidad.value),
        categoria: inputCategoria.value,
        fecha: inputFecha.value,
        concepto: inputConcepto.value.trim()
    };

    if (!REGEX_CONCEPTO.test(datosMovimiento.concepto)) {
        mostrarMensaje('El concepto debe tener entre 3 y 80 caracteres válidos.', 'error');
        return;
    }

    if (isNaN(datosMovimiento.cantidad) || datosMovimiento.cantidad <= 0) {
        mostrarMensaje('La cantidad debe ser un número mayor que 0.', 'error');
        return;
    }

    if (!REGEX_FECHA.test(datosMovimiento.fecha)) {
        mostrarMensaje('La fecha debe tener un formato válido (AAAA-MM-DD).', 'error');
        return;
    }

    const idEdicion = inputId.value;
    let url = API_URL;
    let metodo = 'POST';

    // Si hay un ID en el campo oculto, se actualiza el movimiento
    if (idEdicion !== '') {
        url = API_URL + '/' + idEdicion;
        metodo = 'PUT';
    }

    try {
        // Realiza la petición POST o PUT al backend
        const respuesta = await fetch(url, {
            method: metodo,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosMovimiento)
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(resultado.mensaje || 'Error al guardar el movimiento');
        }

        if (metodo === 'POST') {
            mostrarMensaje('Movimiento guardado correctamente.', 'exito');
        } else {
            mostrarMensaje('Movimiento actualizado correctamente.', 'exito');
        }

        cancelarEdicion();
        await cargarMovimientos();
    } catch (error) {
        mostrarMensaje(error.message, 'error');
    }
}

// Carga los datos de un movimiento en el formulario para editarlo
function prepararEdicion(movimiento) {
    ocultarMensaje();
    inputId.value = movimiento._id;
    inputTipo.value = movimiento.tipo;
    inputCantidad.value = movimiento.cantidad;
    inputCategoria.value = movimiento.categoria;
    inputFecha.value = String(movimiento.fecha).slice(0, 10);
    inputConcepto.value = movimiento.concepto;

    tituloFormulario.textContent = 'Editar movimiento';
    btnGuardar.textContent = 'Actualizar movimiento';
    btnCancelar.classList.remove('oculto');
}

// Restaura el formulario al modo de creación
function cancelarEdicion() {
    inputId.value = '';
    formulario.reset();
    establecerFechaActual();
    tituloFormulario.textContent = 'Nuevo movimiento';
    btnGuardar.textContent = 'Guardar movimiento';
    btnCancelar.classList.add('oculto');
}

// Pide confirmación y elimina un movimiento de la base de datos (DELETE)
async function eliminarMovimiento(id) {
    const confirmado = confirm('¿Seguro que quieres eliminar este movimiento?');

    if (!confirmado) {
        return;
    }

    try {
        // Realiza la petición DELETE al backend 
        const respuesta = await fetch(API_URL + '/' + id, {
            method: 'DELETE'
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(resultado.mensaje || 'Error al eliminar el movimiento');
        }

        // Si se estaba editando justo el movimiento borrado, se limpia el formulario
        if (inputId.value === id) {
            cancelarEdicion();
        }

        mostrarMensaje('Movimiento eliminado correctamente.', 'exito');
        await cargarMovimientos();
    } catch (error) {
        mostrarMensaje(error.message, 'error');
    }
}

// ---------- Filtros y LocalStorage ----------

// Guarda los filtros actuales en localStorage como texto JSON
function guardarFiltros() {
    if (typeof Storage === 'undefined') {
        return;
    }

    // Si no hay filtros seleccionados, los borra de localStorage
    if (filtroTipo.value === 'todos' && filtroCategoria.value === 'todas' && filtroMes.value === '') {
        localStorage.removeItem(CLAVE_FILTROS);
        return;
    }

    const filtros = {
        tipo: filtroTipo.value,
        categoria: filtroCategoria.value,
        mes: filtroMes.value
    };

    // Convierte los filtros a formato JSON y los guarda en localStorage
    localStorage.setItem(CLAVE_FILTROS, JSON.stringify(filtros));
}

// Recupera los últimos filtros guardados en localStorage al abrir la página
function cargarFiltrosGuardados() {
    if (typeof Storage === 'undefined') {
        return;
    }

    // Obtiene los filtros guardados en localStorage
    const textoGuardado = localStorage.getItem(CLAVE_FILTROS);
    if (!textoGuardado) {
        return;
    }

    try {
        // Convierte los filtros de JSON a objeto
        const filtros = JSON.parse(textoGuardado);
        if (filtros.tipo) {
            filtroTipo.value = filtros.tipo;
        }
        if (filtros.categoria) {
            filtroCategoria.value = filtros.categoria;
        }
        if (filtros.mes !== undefined) {
            filtroMes.value = filtros.mes;
        }
    } catch (error) {
        localStorage.removeItem(CLAVE_FILTROS);
    }
}

// Filtra listaMovimientos según tipo, categoría y mes, y actualiza tabla y resumen
function aplicarFiltros() {
    guardarFiltros();

    const tipoSeleccionado = filtroTipo.value;
    const categoriaSeleccionada = filtroCategoria.value;
    const mesSeleccionado = filtroMes.value;

    // Movimientos que cumplen con los filtros
    const filtrados = [];

    // Recorre todos los movimientos y verifica si cumplen con los filtros
    for (let i = 0; i < listaMovimientos.length; i++) {
        const movimiento = listaMovimientos[i];
        let cumple = true;

        if (tipoSeleccionado !== 'todos' && movimiento.tipo !== tipoSeleccionado) {
            cumple = false;
        }

        if (categoriaSeleccionada !== 'todas' && movimiento.categoria !== categoriaSeleccionada) {
            cumple = false;
        }

        // Comprueba si la fecha del movimiento empieza por el mes elegido ( 2026-11 )
        if (mesSeleccionado !== '') {
            const fechaTexto = String(movimiento.fecha);
            if (!fechaTexto.startsWith(mesSeleccionado)) {
                cumple = false;
            }
        }

        if (cumple) {
            filtrados.push(movimiento);
        }
    }

    renderizarMovimientos(filtrados);
    actualizarResumen(filtrados);
}

// Restaura todos los filtros a su valor inicial y los borra de localStorage
function limpiarFiltros() {
    filtroTipo.value = 'todos';
    filtroCategoria.value = 'todas';
    filtroMes.value = '';
    if (typeof Storage !== 'undefined') {
        localStorage.removeItem(CLAVE_FILTROS);
    }
    aplicarFiltros();
}

// ---------- Arranque de la aplicación ----------

function iniciarAplicacion() {
    establecerFechaActual();
    cargarFiltrosGuardados();
    formulario.addEventListener('submit', manejarEnvioFormulario);
    btnCancelar.addEventListener('click', cancelarEdicion);
    filtroTipo.addEventListener('change', aplicarFiltros);
    filtroCategoria.addEventListener('change', aplicarFiltros);
    filtroMes.addEventListener('change', aplicarFiltros);
    btnLimpiarFiltros.addEventListener('click', limpiarFiltros);
    cargarMovimientos();
}

// Espera a que el navegador termine de leer y construir todo el HTML (DOMContentLoaded)
// luego ejecuta la función iniciarAplicacion
document.addEventListener('DOMContentLoaded', iniciarAplicacion);