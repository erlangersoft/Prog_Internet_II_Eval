# Sistema de Evaluación Online - Programación en Internet II

## 🎯 Descripción
Sistema completo de evaluación online con control de acceso por carnet de identidad, que permite realizar exámenes una sola vez por estudiante con seguimiento completo, calificación automática/manual y generación de reportes oficiales para evaluaciones académicas.

## 🔧 Instalación y Configuración

### Requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexión a internet estable
- JavaScript habilitado

### Configuración del Sistema
El sistema está preconfigurado y listo para usar. No requiere instalación adicional por parte de estudiantes o docentes.

## 📚 Archivos del Sistema

### Archivos de Interfaz

- `index.html` - Interfaz principal del examen para estudiantes
- `admin_js.html` - Panel de administración avanzado con JavaScript
- `modelo1.html` - Plantilla de examen (archivo de referencia)

### Recursos y Configuración

- `images/UcatecLogo.png` - Logotipo oficial de la universidad
- Archivos de datos generados automáticamente por el sistema

## 👨‍🏫 Panel de Administración

### Características Principales

**🔐 Acceso Seguro**
- Sistema de autenticación con credenciales protegidas
- Control de intentos de acceso fallidos
- Bloqueo temporal por seguridad
- Sesiones con tiempo de expiración

**📊 Estadísticas en Tiempo Real**
- Total de estudiantes registrados
- Exámenes completados y en progreso
- Sesiones expiradas
- Estados de calificación

**📋 Gestión de Respuestas**
- Visualización completa de respuestas por estudiante
- Indicadores visuales de respuestas correctas/incorrectas
- Resumen detallado de puntuaciones por sección
- Navegación intuitiva con scroll optimizado

**✏️ Sistema de Calificación Manual**
- Calificación automática para preguntas objetivas
- Calificación manual para preguntas de desarrollo
- Calificación ajustable para respuestas cortas
- Actualización automática de puntajes totales
- Validación de rangos de puntuación

**📄 Generación de Reportes**
- Creación de reportes oficiales de evaluación
- Formato profesional con logo institucional
- Detalles completos del examen y respuestas
- Sección de firmas para docente y estudiante
- Optimizado para impresión en formato A4

**💾 Gestión de Datos**
- Exportación de resultados en formato CSV
- Descarga individual de datos por estudiante
- Herramientas de limpieza y mantenimiento
- Respaldo automático de información

## 🎓 Uso para Estudiantes

### Proceso de Examen

1. **Inicio**: Ingresar nombre completo y carnet de identidad
2. **Verificación**: El sistema verifica automáticamente:
   - Si ya completó el examen previamente
   - Si tiene una sesión en progreso
   - Validez del formato de carnet de identidad
3. **Realización**: Interfaz profesional con:
   - Editor de código con resaltado de sintaxis y números de línea
   - Temporizador en tiempo real con alertas visuales
   - Indicador de progreso por secciones
   - Guardado automático de respuestas
   - Navegación fluida entre preguntas
4. **Entrega**: Envío seguro con confirmación del sistema

### Características de la Interfaz

- **Diseño Responsivo**: Adaptable a diferentes tamaños de pantalla
- **Experiencia Intuitiva**: Navegación clara y fácil de usar
- **Feedback Visual**: Indicadores de estado y progreso
- **Accesibilidad**: Optimizado para diferentes dispositivos
- **Prevención de Pérdida de Datos**: Guardado automático continuo

### Características de Seguridad

- **Un intento por carnet**: Control estricto por cédula de identidad
- **Sesiones protegidas**: Hash seguro del carnet
- **Control de tiempo**: Envío automático al expirar
- **Validación continua**: Verificación de sesión activa
- **Recuperación inteligente**: Continuar sesión si se interrumpe

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
