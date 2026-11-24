# Memoria del Proyecto — Gestor de Ingresos y Gastos

## 1. Idea del proyecto y enfoque empresarial

### Problema detectado
Muchas personas particulares, estudiantes y trabajadores autónomos llevan sus cuentas en hojas de cálculo manuales o directamente no registran sus pequeños gastos diarios. Esto dificulta saber cuánto se gasta en cada categoría y cuál es el balance real al final del mes.

### Solución propuesta
**Gestor de Ingresos y Gastos** es una aplicación web ligera, rápida y sin fricción que permite registrar cualquier ingreso o gasto en segundos, consultar el balance neto actualizado al instante y filtrar el historial por tipo, categoría o mes.

### Público objetivo
- **Particulares y estudiantes** que buscan controlar su presupuesto mensual sin aplicaciones complejas.
- **Autónomos y pequeños profesionales** que necesitan llevar un registro claro y ordenado de cobros y gastos operativos antes de pasar la información a su gestoría.

### Propuesta de valor y modelo de negocio (visión empresarial)
El proyecto se plantea como un **MVP (Producto Mínimo Viable)** bajo un posible modelo **Freemium (SaaS)**:
- **Versión gratuita (actual MVP):** registro ilimitado de ingresos y gastos, categorización, cálculo automático de balance y filtros por mes/tipo/categoría.
- **Posible versión Pro (futuras fases):** autenticación multiusuario, exportación de informes en CSV/PDF para contabilidad, presupuestos mensuales con alertas y gráficos de evolución.

---

## 2. Funcionalidades implementadas

- **Resumen financiero en tiempo real:** cálculo automático de `Total ingresos`, `Total gastos` y `Balance total` adaptado también a los filtros activos.
- **CRUD completo conectado a MongoDB:**
  - **Crear** nuevos ingresos o gastos.
  - **Leer** el historial ordenado por fecha descendente.
  - **Actualizar** cualquier movimiento cargándolo de nuevo en el formulario.
  - **Eliminar** movimientos con diálogo de confirmación.
- **Validación en cliente y servidor:**
  - En frontend: atributos HTML5 + expresiones regulares (`RegEx`) para concepto y fecha.
  - En backend: validaciones de esquema en Mongoose (`required`, `min`, `enum`) y comprobación de `ObjectId`.
- **Filtros dinámicos con persistencia:** filtrado combinado por tipo (`ingreso`/`gasto`), categoría y mes (`AAAA-MM`), recordando la selección del usuario en `localStorage`.
- **Diseño responsive:** interfaz limpia en CSS3 puro adaptable a escritorio y dispositivos móviles (`<= 768px`).

---

## 3. Arquitectura y tecnologías utilizadas

- **Frontend:** HTML5 semántico, CSS3 puro (Grid, Flexbox y variables `:root`) y JavaScript Vanilla (`fetch`, `async/await`, DOM, eventos, `try/catch`, `RegEx` y `localStorage`).
- **Backend (patrón MVC):** Node.js con Express, separado en:
  - **Modelo:** `backend/models/Movimiento.js` (Mongoose).
  - **Controlador:** `backend/controllers/movimientoController.js`.
  - **Rutas:** `backend/routes/movimientoRoutes.js`.
  - **Configuración:** `backend/config/db.js` y `backend/server.js`.
- **Base de datos:** MongoDB (compatible con Docker, instalación local o MongoDB Atlas).

---

## 4. Accesos y recursos del proyecto

| Recurso | Ubicación / Enlace | Descripción |
| :--- | :--- | :--- |
| **Repositorio en GitHub** | [https://github.com/Miriam-Nav/Projecte-1Ava-Gestor](https://github.com/Miriam-Nav/Projecte-1Ava-Gestor) | Código fuente completo y control de versiones |
| **Guía técnica de instalación (`README.md`)** | [README.md](../README.md) | Requisitos, variables de entorno, comandos y endpoints |
| **Guía de estilos y prototipado** | [docs/guia-estilos.md](guia-estilos.md) | Paleta de colores, tipografía, componentes, wireframe y flujo |
| **Frontend (HTML / CSS / JS)** | `frontend/index.html`, `frontend/css/styles.css`, `frontend/js/app.js` | Interfaz y lógica de cliente |
| **Backend MVC (Node.js + Express + MongoDB)** | `backend/` | API REST `/api/movimientos` |

### Acceso rápido en local (resumen)
1. Arrancar MongoDB (`docker start mongodb-gestor` o servicio local).
2. Entrar en `backend/`, configurar `.env` (a partir de `.env.example`) y ejecutar `npm install && npm run dev`.
3. Abrir `frontend/index.html` en el navegador (el backend escucha en `http://localhost:3000`).
