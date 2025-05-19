# Documentación de Pruebas de Postman

## Resumen de Casos de Prueba

Este documento describe las pruebas automatizadas implementadas en Postman para validar los endpoints de la API. Cada caso de prueba está diseñado para verificar tanto las operaciones exitosas como el manejo adecuado de errores.

## Implementación de Pruebas

### Endpoints de Estudiantes

#### 1. Pruebas de Crear Estudiante
```javascript
// Prueba: Creación exitosa de estudiante
pm.test("Debe crear estudiante con datos válidos", function () {
    pm.response.to.have.status(201);
    var jsonData = pm.response.json();
    pm.expect(jsonData.promedio).to.be.above(3.2);
    pm.expect(jsonData.semestre).to.be.at.least(4);
});

// Prueba: Validación de promedio mínimo
pm.test("Debe rechazar estudiante con promedio bajo", function () {
    pm.response.to.have.status(400);
    pm.expect(pm.response.text()).to.include("promedio mayor a 3.2");
});
```

**Justificación**: Estas pruebas verifican la regla de negocio que establece que los estudiantes deben tener un promedio superior a 3.2 y estar al menos en el semestre 4.

#### 2. Pruebas de Eliminar Estudiante
```javascript
// Prueba: Eliminación exitosa de estudiante
pm.test("Debe eliminar estudiante sin proyectos activos", function () {
    pm.response.to.have.status(200);
});

// Prueba: No se puede eliminar estudiante con proyectos activos
pm.test("Debe prevenir la eliminación de estudiante con proyectos activos", function () {
    pm.response.to.have.status(400);
    pm.expect(pm.response.text()).to.include("proyectos activos");
});
```

**Justificación**: Valida la restricción de que los estudiantes con proyectos activos no pueden ser eliminados.

### Endpoints de Proyectos

#### 1. Pruebas de Crear Proyecto
```javascript
// Prueba: Creación exitosa de proyecto
pm.test("Debe crear proyecto con datos válidos", function () {
    pm.response.to.have.status(201);
    var jsonData = pm.response.json();
    pm.expect(jsonData.titulo.length).to.be.above(15);
    pm.expect(jsonData.presupuesto).to.be.above(0);
});

// Prueba: Validación de longitud del título
pm.test("Debe rechazar proyecto con título corto", function () {
    pm.response.to.have.status(400);
    pm.expect(pm.response.text()).to.include("título debe tener más de 15 caracteres");
});
```

**Justificación**: Asegura que los proyectos cumplan con los requisitos mínimos de longitud del título y presupuesto.

#### 2. Pruebas de Avanzar Estado
```javascript
// Prueba: Avance exitoso de estado
pm.test("Debe avanzar el estado del proyecto", function () {
    pm.response.to.have.status(200);
    var jsonData = pm.response.json();
    pm.expect(jsonData.estado).to.be.at.most(4);
});

// Prueba: No se puede avanzar más allá del estado final
pm.test("Debe prevenir avanzar más allá del estado final", function () {
    pm.response.to.have.status(400);
    pm.expect(pm.response.text()).to.include("estado máximo");
});
```

**Justificación**: Verifica las transiciones correctas de estado y previene avances de estado inválidos.

### Endpoints de Profesores

#### 1. Pruebas de Crear Profesor
```javascript
// Prueba: Creación exitosa de profesor
pm.test("Debe crear profesor con datos válidos", function () {
    pm.response.to.have.status(201);
    var jsonData = pm.response.json();
    pm.expect(jsonData.extension.toString()).to.have.lengthOf(5);
});

// Prueba: Validación de extensión
pm.test("Debe rechazar extensión inválida", function () {
    pm.response.to.have.status(400);
    pm.expect(pm.response.text()).to.include("extensión debe tener exactamente 5 dígitos");
});
```

**Justificación**: Valida el requisito de que los números de extensión deben tener exactamente 5 dígitos.

#### 2. Pruebas de Asignar Evaluador
```javascript
// Prueba: Asignación exitosa de evaluador
pm.test("Debe asignar profesor como evaluador", function () {
    pm.response.to.have.status(200);
    var jsonData = pm.response.json();
    pm.expect(jsonData.esParEvaluador).to.be.true;
});

// Prueba: Límite máximo de evaluaciones
pm.test("Debe prevenir asignación con demasiadas evaluaciones activas", function () {
    pm.response.to.have.status(400);
    pm.expect(pm.response.text()).to.include("3 o más evaluaciones activas");
});
```

**Justificación**: Asegura que los profesores no excedan el número máximo de evaluaciones activas.

### Endpoints de Evaluaciones

#### 1. Pruebas de Crear Evaluación
```javascript
// Prueba: Creación exitosa de evaluación
pm.test("Debe crear evaluación con evaluador válido", function () {
    pm.response.to.have.status(201);
});

// Prueba: El mentor no puede ser evaluador
pm.test("Debe prevenir que el mentor sea evaluador", function () {
    pm.response.to.have.status(400);
    pm.expect(pm.response.text()).to.include("no puede ser el mentor del proyecto");
});
```

**Justificación**: Valida la regla de negocio que establece que los mentores de proyecto no pueden ser evaluadores.

## Ejecución de las Pruebas

1. Importar la colección en Postman
2. Configurar variables de entorno:
   - `baseUrl`: http://localhost:3000
   - `studentId`: ID de un estudiante de prueba
   - `projectId`: ID de un proyecto de prueba
   - `professorId`: ID de un profesor de prueba

3. Ejecutar la colección con la función "Runner" en Postman

## Requisitos de Datos de Prueba

Para ejecutar todas las pruebas exitosamente, necesitarás:
- Un estudiante con promedio > 3.2 y semestre ≥ 4
- Un estudiante con proyectos activos
- Un proyecto en su estado final
- Un profesor con 3 evaluaciones activas
- Un proyecto con un mentor asignado

Estos casos de prueba cubren tanto escenarios exitosos como condiciones de error, asegurando una validación robusta de las reglas de negocio y restricciones de la API. 