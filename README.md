# Sistema de Evaluación Online - Programación en Internet II

## 🎯 Descripción
Sistema completo de evaluación online con control de acceso por carnet de identidad, que permite realizar exámenes una sola vez por estudiante con seguimiento completo y almacenamiento seguro de datos.

## 🔧 Instalación y Configuración

### Requisitos
- Servidor web con PHP 7.4 o superior
- Permisos de escritura en el directorio del proyecto

### Configuración Inicial

1. **Subir archivos al servidor**
   - Copie todos los archivos al directorio web del servidor
   - Asegúrese de que el servidor tenga permisos de escritura

2. **Configurar parámetros** (archivo `config.php`)
   ```php
   define('EXAM_ACTIVE', true);        // Activar/desactivar examen
   define('MAX_ATTEMPTS', 1);          // Intentos permitidos por estudiante
   define('EXAM_DURATION_SECONDS', 7200); // 2 horas
   define('ADMIN_PASSWORD', 'su_contraseña_segura');
   ```

3. **Verificar permisos**
   - El servidor debe poder crear archivos `.exam_data.json` y `.exam_submissions.json`
   - Estos archivos se crean automáticamente en el primer uso

## 📚 Archivos del Sistema

### Archivos Principales
- `index.html` - Interfaz del examen para estudiantes
- `exam_controller.php` - API para control de acceso y envío
- `admin.php` - Panel de administración para docentes
- `export_results.php` - Exportación de resultados en CSV
- `config.php` - Configuración del sistema

### Archivos de Datos (creados automáticamente)
- `.exam_data.json` - Registro de estudiantes y sesiones
- `.exam_submissions.json` - Respuestas de los exámenes
- `.exam_log.txt` - Log de actividades (opcional)

## 👨‍🏫 Uso para Docentes

### Panel de Administración
1. Acceder a `admin.php`
2. Ingresar contraseña de administrador
3. Ver estadísticas en tiempo real:
   - Total de estudiantes registrados
   - Exámenes completados
   - Exámenes en progreso
   - Sesiones expiradas

### Activar/Desactivar Examen
En `config.php`, cambiar:
```php
define('EXAM_ACTIVE', true);  // Examen disponible
define('EXAM_ACTIVE', false); // Examen cerrado
```

### Exportar Resultados
1. En el panel de administración, hacer clic en "Descargar Resultados (CSV)"
2. El archivo incluye:
   - Datos del estudiante
   - Todas las respuestas
   - Puntajes automáticos calculados
   - Tiempo de inicio y entrega

## 🎓 Uso para Estudiantes

### Proceso de Examen
1. **Inicio**: Ingresar nombre completo y carnet de identidad
2. **Verificación**: El sistema verifica automáticamente:
   - Si ya completó el examen
   - Si tiene una sesión en progreso
   - Si excedió los intentos permitidos
3. **Realización**: Interfaz profesional con:
   - Editor de código con números de línea
   - Temporizador en tiempo real
   - Indicador de progreso
   - Guardado automático de sesión
4. **Entrega**: Envío seguro al servidor

### Características de Seguridad
- **Un intento por carnet**: Control estricto por CI
- **Sesiones protegidas**: Hash seguro del carnet
- **Control de tiempo**: Envío automático al expirar
- **Validación de sesión**: Verificación continua
- **Recuperación de sesión**: Continuar si se interrumpe

## 🔒 Seguridad Implementada

### Control de Acceso
- Hash SHA-256 del carnet con salt personalizado
- Validación de formato de CI boliviano (6-8 dígitos)
- Verificación de IP y sesión
- Límite de intentos por estudiante

### Integridad de Datos
- Archivos JSON ocultos (prefijo punto)
- Validación de sesión en cada operación
- Log de actividades para auditoría
- Verificación de tiempo de servidor

### Prevención de Fraude
- Control de una sesión por estudiante
- Tiempo máximo de examen (2 horas)
- Verificación de sesión activa
- Invalidación automática de sesiones expiradas

## 📊 Tipos de Preguntas

### Evaluación Automática (68 puntos)
1. **Selección Múltiple** (20 pts) - 5 preguntas × 4 pts
2. **Verdadero o Falso** (18 pts) - 6 preguntas × 3 pts
3. **Respuesta Corta** (20 pts) - 5 preguntas × 4 pts
4. **Asociación** (10 pts) - 4 asociaciones × 2.5 pts

### Evaluación Manual (32 puntos)
1. **Código PHP** - Clase con propiedades y métodos
2. **Documento XML** - Estructura de estudiantes
3. **API Fetch JavaScript** - Peticiones AJAX
4. **API RESTful** - Endpoints CRUD
5. **Explicación teórica** - Hosting vs VPS

## 🛠️ Personalización

### Modificar Tiempo de Examen
En `config.php`:
```php
define('EXAM_DURATION_SECONDS', 7200); // 2 horas
```

### Cambiar Puntajes
Editar array `$SCORING_CONFIG` en `config.php`

### Personalizar Mensajes
Modificar array `$SYSTEM_MESSAGES` en `config.php`

### Activar/Desactivar Logs
```php
define('LOG_ENABLED', true); // Activar logging
```

## 🔧 Mantenimiento

### Limpieza de Datos
- Los archivos de datos pueden eliminarse para reiniciar
- Se recomienda respaldar antes de limpiar
- Los logs ayudan a auditar problemas

### Respaldo
```bash
# Respaldar datos importantes
cp .exam_data.json backup_data_$(date +%Y%m%d).json
cp .exam_submissions.json backup_submissions_$(date +%Y%m%d).json
```

### Monitoreo
- Revisar logs en `.exam_log.txt`
- Verificar tamaño de archivos de datos
- Monitorear sesiones activas en panel de administración

## 🆘 Solución de Problemas

### Estudiante no puede acceder
1. Verificar que `EXAM_ACTIVE = true`
2. Comprobar formato de CI (6-8 dígitos)
3. Revisar si ya completó el examen
4. Verificar permisos de escritura del servidor

### Error al enviar examen
1. Verificar conexión de red
2. Comprobar que la sesión no haya expirado
3. Revisar logs del servidor
4. Verificar espacio en disco del servidor

### Panel de administración no carga
1. Verificar contraseña en `config.php`
2. Comprobar permisos de archivos
3. Revisar errores de PHP en logs del servidor

## 📞 Soporte Técnico
Para soporte adicional, revisar:
- Logs del sistema en `.exam_log.txt`
- Errores de PHP en logs del servidor
- Panel de administración para estado del sistema

---

**Desarrollado para UCATEC - Ingeniería de Sistemas**  
**Materia: Programación en Internet II**
