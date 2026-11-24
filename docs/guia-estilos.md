# Guía de Estilos y Prototipado

Documento de referencia visual y estructural para la aplicación **Gestor de Ingresos y Gastos** (`frontend/`).

## 1. Paleta de colores

Definida mediante variables CSS en `:root` dentro de `frontend/css/styles.css`:

| Uso | Variable CSS | Código Hex | Aplicación |
| :--- | :--- | :--- | :--- |
| Fondo general | `--fondo` | `#eef1f4` | Fondo de la página |
| Superficie | `--blanco` | `#ffffff` | Cabecera, tarjetas de resumen, paneles e inputs |
| Texto principal | `--texto` | `#1f2937` | Títulos, etiquetas y celdas de la tabla |
| Texto secundario | `--suave` | `#6b7280` | Subtítulo, encabezados de tabla, títulos de tarjeta y estado vacío |
| Bordes | `--borde` | `#d1d5db` | Bordes de paneles, tarjetas, inputs y divisores de tabla |
| Primario (acción) | `--nvidia` | `#76b900` | Botón guardar movimiento y foco de campos |
| Ingreso / Éxito | `--verde` | `#1e8e3e` | Importe de ingresos, etiqueta ingreso y mensajes de éxito |
| Gasto / Error | `--rojo` | `#d93025` | Importe de gastos, etiqueta gasto, botón eliminar y errores |
| Secundario | `--turquesa` | `#1a8fa3` | Botones secundarios (cancelar edición y limpiar filtros) |
| Edición | `--naranja` | `#d97706` | Botón editar movimiento |

Fondos suaves para etiquetas y avisos:
- Éxito / Ingreso: `#dcfce7`
- Error / Gasto: `#fee2e2`

## 2. Tipografía

- **Familia principal:** `Arial`.
- **Interlineado base:** `1.5`.
- **Jerarquía de tamaños (en píxeles):**
  - Importes de resumen (`.importe`): `28px`, peso `700`.
  - Título principal (`.cabecera h1`): `20px`.
  - Títulos de panel (`.panel h2`): `18px`.
  - Texto base de tabla y controles: `16px` (`font: inherit` en inputs, selects y botones).
  - Subtítulo, etiquetas de campo, botones de tabla y badges: `14px`.
  - Encabezados de tabla (`th`): `13px`, mayúsculas.

## 3. Espaciado y bordes

- **Ancho máximo del contenido (`main`):** `1200px`, centrado con `margin: 0 auto` y `padding: 0 24px`.
- **Separación entre secciones:** `gap: 20px`.
- **Separación en grids (resumen, formulario y filtros):** `gap: 16px`.
- **Padding de paneles:** `24px`; **tarjetas de resumen:** `20px 24px`; **celdas de tabla:** `12px`.
- **Bordes:** `1px solid var(--borde)` y radio uniforme `--radio: 4px`.

## 4. Componentes de interfaz

1. **Cabecera (`.cabecera`)**: fondo blanco con borde inferior, título principal y subtítulo descriptivo.
2. **Tarjetas de resumen (`.resumen` / `.tarjeta-resumen`)**: tres tarjetas en fila (`Total ingresos` en verde, `Total gastos` en rojo y `Balance total` dinámico según signo).
3. **Formulario de movimiento (`.formulario`)**: grid de 2 columnas con campos alineados al modelo `Movimiento` (`tipo`, `cantidad`, `categoria`, `fecha` y `concepto` ocupando todo el ancho con `.campo-completo`), campo oculto `#movimiento-id` para editar y mensaje de estado `#mensaje-formulario`.
4. **Barra de filtros (`.filtros`)**: grid de 4 columnas con filtro de tipo, filtro de categoría, selector de mes (`input[type="month"]`) y botón `Limpiar filtros` ocupando el ancho de su columna.
5. **Tabla de movimientos (`.tabla-movimientos`)**: envuelta en `.tabla-contenedor` (`overflow-x: auto`) con columnas `Fecha`, `Concepto`, `Categoría`, `Tipo`, `Cantidad` y `Acciones` (`Editar` en naranja y `Eliminar` en rojo).

## 5. Diseño responsive

- **Escritorio (`> 768px`):**
  - Resumen en 3 columnas iguales (`repeat(3, 1fr)`).
  - Formulario en 2 columnas (`repeat(2, 1fr)`).
  - Filtros en 4 columnas (`repeat(4, 1fr)`).
- **Móvil y tablet pequeña (`<= 768px`):**
  - `.resumen`, `.formulario` y `.filtros` pasan a 1 columna (`grid-template-columns: 1fr`).
  - La tabla mantiene desplazamiento horizontal sin romper el diseño.

## 6. Prototipado y flujo de pantalla

La aplicación se organiza en una única pantalla principal sin recargas para agilizar el registro y la consulta diaria.

### Boceto de estructura (Wireframe)

```text
+-------------------------------------------------------------------+
| CABECERA: Gestor de Ingresos y Gastos                             |
| Subtítulo: Control personal de movimientos financieros            |
+-------------------------------------------------------------------+
| [ Total ingresos ]    [ Total gastos ]      [ Balance total ]     |
+-------------------------------------------------------------------+
| NUEVO MOVIMIENTO                                                  |
| [ Tipo v ]            [ Cantidad (€) ]                            |
| [ Categoría v ]       [ Fecha ]                                   |
| [ Concepto (ancho completo)                                     ] |
| [ Guardar movimiento ] [ Cancelar edición ]                       |
+-------------------------------------------------------------------+
| FILTROS                                                           |
| [ Tipo v ]   [ Categoría v ]   [ Mes ]   [ Limpiar filtros ]      |
+-------------------------------------------------------------------+
| HISTORIAL DE MOVIMIENTOS                                          |
| Fecha | Concepto | Categoría | Tipo | Cantidad | Acciones         |
| ...   | ...      | ...       | ...  | ...      | [Editar][Borrar] |
+-------------------------------------------------------------------+
```

### Flujo de interacción

1. **Carga inicial:** se recuperan los filtros guardados en `localStorage`, se solicita `GET /api/movimientos`, se pintan las filas y se calculan los totales.
2. **Crear movimiento:** se validan los datos con expresiones regulares (`REGEX_CONCEPTO` y `REGEX_FECHA`), se envía `POST /api/movimientos` y se refresca la vista.
3. **Editar movimiento:** al pulsar `Editar`, los datos se cargan en el formulario, cambia el botón a `Actualizar movimiento` y se envía `PUT /api/movimientos/:id`.
4. **Eliminar movimiento:** tras confirmar con `confirm()`, se envía `DELETE /api/movimientos/:id` y se actualiza el listado y el balance.
5. **Filtrar:** los cambios en tipo, categoría o mes se guardan en `localStorage` y actualizan al instante la tabla y las tarjetas de resumen.
