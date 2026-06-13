# TP DDS - Seguimiento de tareas en proyectos

Proyecto full stack simple para el TP previo al Parcial 2 de Desarrollo de Software.

La aplicacion permite administrar tareas dentro de proyectos, con login, JWT, roles, permisos, filtros, historial, resumen administrativo y pruebas de backend.

## Estructura

```text
backend/
  src/
    controllers/
    data/
    middlewares/
    routes/
    services/
    utils/
  tests/
frontend/
  src/
    components/
    context/
    pages/
    services/
```

## Como ejecutar el backend

```bash
cd backend
npm install
npm run dev
```

La API queda en:

```text
http://localhost:3000/api
```

Para reiniciar la base JSON con datos semilla:

```bash
npm run seed
```

## Como ejecutar el frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite normalmente abre en:

```text
http://localhost:5173
```

## Usuarios de prueba

Todos tienen password:

```text
123456
```

| Rol | Email |
|---|---|
| admin | admin@dds.com |
| lider | lider@dds.com |
| colaborador | lucia@dds.com |
| colaborador | mateo@dds.com |
| colaborador | florencia@dds.com |

## Endpoints principales

### Auth

```text
POST /api/auth/register
POST /api/auth/login
```

### Proyectos

```text
GET /api/proyectos
```

### Usuarios

```text
GET /api/usuarios
```

Este endpoint se agrego para que el frontend pueda cargar responsables en los selects.

### Tareas

```text
GET /api/tareas?proyectoId=&responsableId=&estado=&prioridad=&page=&limit=&sortBy=&order=
GET /api/tareas/resumen
GET /api/tareas/:id
GET /api/tareas/:id/historial
POST /api/tareas
PUT /api/tareas/:id
PATCH /api/tareas/:id/iniciar
PATCH /api/tareas/:id/bloquear
PATCH /api/tareas/:id/cancelar
PATCH /api/tareas/:id/finalizar
```

## Rutas frontend

```text
/login
/registro
/tareas
/tareas/nueva
/tareas/:id
/tareas/:id/editar
/resumen
*
```

## Reglas principales del dominio

Una tarea debe:

- pertenecer a un proyecto existente;
- tener un responsable que integre ese proyecto;
- usar una prioridad valida;
- usar un estado valido;
- respetar las transiciones de estado.

## Prioridades validas

```text
baja
media
alta
critica
```

## Estados validos

```text
pendiente
en_progreso
bloqueada
finalizada
cancelada
```

## Transiciones permitidas

```text
pendiente -> en_progreso
pendiente -> cancelada
en_progreso -> bloqueada
en_progreso -> finalizada
en_progreso -> cancelada
bloqueada -> cancelada
```

No se pueden editar tareas finalizadas o canceladas.

## Proyectos pausados y finalizados

- Proyecto activo: permite crear y editar tareas.
- Proyecto pausado: no permite crear tareas nuevas, pero permite editar tareas existentes.
- Proyecto finalizado: no permite crear ni editar tareas.

## Roles y permisos

### colaborador

- Puede ver sus tareas asignadas.
- Puede editar solamente la descripcion de sus tareas.
- Puede pasar sus tareas a `en_progreso` o `bloqueada`, si la transicion corresponde.

### lider / admin

- Puede crear tareas.
- Puede editar tareas.
- Puede reasignar responsables.
- Puede cambiar prioridad.
- Puede finalizar o cancelar tareas.
- Puede ver el resumen administrativo.

## JWT

Al hacer login, el backend devuelve un JWT. El frontend lo guarda en `localStorage` y lo manda en cada request protegida con:

```text
Authorization: Bearer <token>
```

El payload del JWT no incluye password ni datos sensibles.

## Persistencia

Se usa archivo JSON para que el proyecto sea simple y facil de revisar.

El archivo se crea automaticamente al iniciar el backend:

```text
backend/src/data/db.json
```

En los tests se usa otro archivo:

```text
backend/src/data/test-db.json
```

## Pruebas

Para ejecutar los tests del backend:

```bash
cd backend
npm test
```

Los tests cubren:

- login correcto e invalido;
- listado con y sin filtros;
- detalle existente e inexistente;
- creacion valida;
- creacion invalida por responsable incorrecto;
- prioridad y estado invalidos;
- ruta protegida sin JWT;
- falta de permisos con colaborador;
- proyecto finalizado o pausado;
- transicion/edicion invalida;
- historial de cambios.

## Limitaciones conocidas

- La persistencia usa JSON y no base SQL para mantener el trabajo simple.
- El frontend es funcional y basico, sin librerias visuales externas.
- El registro permite crear usuarios nuevos, pero no los agrega automaticamente como integrantes de un proyecto.
