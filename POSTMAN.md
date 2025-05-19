# Documentación de la API REST

## Endpoints de Estudiantes

### 1. Crear Estudiante
- **Método**: POST
- **URL**: http://localhost:3000/estudiantes
- **Ejemplo del Cuerpo**:
```json
{
    "cedula": 1234567890,
    "nombre": "Juan Pérez",
    "semestre": 6,
    "programa": "Ingeniería de Sistemas",
    "promedio": 4.20
}
```
- **Respuesta Exitosa**: 201 Created
- **Respuesta de Error**: 400 Bad Request
  - Cuando el promedio ≤ 3.2 o el semestre < 4

### 2. Eliminar Estudiante
- **Método**: DELETE
- **URL**: http://localhost:3000/estudiantes/:id
- **Respuesta Exitosa**: 200 OK
- **Respuesta de Error**: 400 Bad Request
  - Cuando el estudiante tiene proyectos activos

## Endpoints de Proyectos

### 1. Crear Proyecto
- **Método**: POST
- **URL**: http://localhost:3000/proyectos
- **Ejemplo del Cuerpo**:
```json
{
    "titulo": "Sistema de Gestión Ambiental Inteligente",
    "area": "Sostenibilidad",
    "presupuesto": 5000000,
    "notaFinal": 0,
    "estado": 1,
    "fechaInicio": "2024-03-15",
    "fechaFin": "2024-12-15",
    "lider": {"id": 1}
}
```
- **Respuesta Exitosa**: 201 Created
- **Respuesta de Error**: 400 Bad Request
  - Cuando la longitud del título ≤ 15 caracteres
  - Cuando el presupuesto ≤ 0

### 2. Avanzar Estado de Proyecto
- **Método**: PUT
- **URL**: http://localhost:3000/proyectos/:id/avanzar
- **Respuesta Exitosa**: 200 OK
- **Respuesta de Error**: 400 Bad Request
  - Cuando el proyecto ya está en estado final

### 3. Obtener Estudiantes de Proyecto
- **Método**: GET
- **URL**: http://localhost:3000/proyectos/:id/estudiantes
- **Respuesta Exitosa**: 200 OK
- **Respuesta de Error**: 404 Not Found
  - Cuando el proyecto no existe

## Endpoints de Profesores

### 1. Crear Profesor
- **Método**: POST
- **URL**: http://localhost:3000/profesores
- **Ejemplo del Cuerpo**:
```json
{
    "cedula": 1234567890,
    "nombre": "Dra. María González",
    "departamento": "Sistemas",
    "extension": 12345,
    "esParEvaluador": false
}
```
- **Respuesta Exitosa**: 201 Created
- **Respuesta de Error**: 400 Bad Request
  - Cuando la extensión no tiene exactamente 5 dígitos

### 2. Asignar como Evaluador
- **Método**: PUT
- **URL**: http://localhost:3000/profesores/:id/asignar-evaluador
- **Respuesta Exitosa**: 200 OK
- **Respuesta de Error**: 400 Bad Request
  - Cuando el profesor tiene ≥ 3 evaluaciones activas

## Endpoints de Evaluaciones

### 1. Crear Evaluación
- **Método**: POST
- **URL**: http://localhost:3000/evaluaciones/:evaluadorId
- **Ejemplo del Cuerpo**:
```json
{
    "proyecto": {"id": 1}
}
```
- **Respuesta Exitosa**: 201 Created
- **Respuesta de Error**: 400 Bad Request
  - Cuando el evaluador es el mentor del proyecto 