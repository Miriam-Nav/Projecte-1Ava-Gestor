# Gestor de Ingresos y Gastos

Aplicación web para el control personal de ingresos y gastos con arquitectura **MVC** en el backend (**Node.js + Express + MongoDB/Mongoose**) y frontend en **HTML5, CSS3 puro y JavaScript Vanilla**.

## 1. Requisitos previos

- **Node.js** (v18 o superior) y **npm**
- **MongoDB** (puede ejecutarse con **Docker**, instalado en local o mediante **MongoDB Atlas**)
- Navegador web moderno (Chrome, Firefox o Edge)

## 2. Estructura del proyecto

```text
.
├── backend/
│   ├── config/
│   │   └── db.js                      # Conexión a MongoDB
│   ├── controllers/
│   │   └── movimientoController.js    # Lógica CRUD de movimientos
│   ├── models/
│   │   └── Movimiento.js              # Esquema y modelo de Mongoose
│   ├── routes/
│   │   └── movimientoRoutes.js        # Rutas REST (/api/movimientos)
│   ├── .env.example                   # Plantilla de variables de entorno
│   ├── package.json
│   └── server.js                      # Punto de entrada de Express
├── frontend/
│   ├── css/
│   │   └── styles.css                 # Estilos responsive en CSS3 puro
│   ├── js/
│   │   └── app.js                     # Lógica CRUD, filtros, RegEx y localStorage
│   └── index.html                     # Interfaz principal HTML5
├── docs/
│   ├── guia-estilos.md                # Guía de estilos y prototipado
│   └── memoria-proyecto.md            # Memoria e idea de negocio del proyecto
├── .gitignore
└── README.md
```

## 3. Puesta en marcha paso a paso

### Paso 1: Clonar el repositorio

```bash
git clone https://github.com/Miriam-Nav/Projecte-1Ava-Gestor.git
cd Projecte-1Ava-Gestor
```

### Paso 2: Arrancar MongoDB

Elige una de estas tres opciones:

- **Opción A — Docker (recomendada):**
  ```bash
  docker run -d --name mongodb-gestor -p 27017:27017 mongo:7
  ```
  *(En siguientes sesiones solo necesitas `docker start mongodb-gestor`).*

- **Opción B — MongoDB local:** instala MongoDB Community Server como servicio en el puerto por defecto `27017`.

- **Opción C — MongoDB Atlas:** crea un clúster gratuito en la nube y usa tu cadena `mongodb+srv://...` en el paso siguiente.

### Paso 3: Configurar variables de entorno del backend

Dentro de la carpeta `backend/`, crea un archivo `.env` tomando como base `backend/.env.example`:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/gestor-gastos
```

### Paso 4: Instalar dependencias y arrancar el backend

```bash
cd backend
npm install
npm run dev
```

*(Para ejecución normal sin reinicio automático: `npm start`).*

Si todo está correcto, verás en consola:

```text
Servidor escuchando en http://localhost:3000
Conexión a MongoDB establecida correctamente
```

### Paso 5: Abrir el frontend

Abre `frontend/index.html` directamente en el navegador o utilizando la extensión **Live Server** de VS Code. El frontend realiza las peticiones automáticamente a `http://localhost:3000/api/movimientos`.

## 4. Endpoints de la API REST

URL base: `http://localhost:3000/api/movimientos`

| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| `GET` | `/` | Comprueba que la API está activa |
| `GET` | `/api/movimientos` | Lista todos los movimientos ordenados por fecha descendente |
| `GET` | `/api/movimientos/:id` | Obtiene un movimiento por su `_id` |
| `POST` | `/api/movimientos` | Crea un nuevo movimiento |
| `PUT` | `/api/movimientos/:id` | Actualiza un movimiento existente |
| `DELETE` | `/api/movimientos/:id` | Elimina un movimiento por su `_id` |

### Modelo de datos (`Movimiento`)

```json
{
  "concepto": "Compra supermercado",
  "cantidad": 45.50,
  "tipo": "gasto",
  "categoria": "Alimentación",
  "fecha": "2026-11-24"
}
```

- `concepto`: `String` obligatorio.
- `cantidad`: `Number` obligatorio, mayor que `0` (`min: 0.01`).
- `tipo`: `String` obligatorio (`"ingreso"` o `"gasto"`).
- `categoria`: `String` obligatorio.
- `fecha`: `Date` obligatorio (por defecto la fecha actual).

