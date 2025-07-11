# Sistema de Evaluación Online - Hosting Gratuito

## Descripción
Sistema completo de evaluación online para Programación en Internet II (UCATEC) desarrollado únicamente con **HTML, CSS y JavaScript** para máxima compatibilidad con servicios de hosting gratuito como GitHub Pages, Netlify, Vercel, etc.

## ✨ Características Principales

### 🎯 Funcionalidades del Sistema
- **Control de acceso único**: Un intento por estudiante basado en CI
- **Temporizador automático**: 2 horas de duración con auto-envío
- **Almacenamiento local**: Persistencia de datos usando localStorage
- **Cálculo automático de puntajes**: Evaluación inmediata (68/100 puntos)
- **Editores de código profesionales**: Con números de línea y resaltado
- **Diseño 100% responsive**: Compatible con móviles, tablets y escritorio
- **Panel de administración completo**: Gestión y exportación de datos
- **Auto-guardado inteligente**: Progreso guardado cada 30 segundos

### 🔒 Medidas de Seguridad
- Hash del CI para protección de identidad
- Prevención de intentos múltiples
- Validación de sesiones activas
- Confirmación antes de envío
- Protección contra cierre accidental

## 📁 Archivos del Sistema

### Archivos Principales
- **`index_js_only.html`** - Sistema principal de evaluación (renombrar a `index.html`)
- **`exam-system.js`** - Lógica completa del sistema (960+ líneas)
- **`admin_js.html`** - Panel de administración con estadísticas
- **`images/UcatecLogo.png`** - Logo institucional

## 🚀 Instalación y Despliegue

### Opción 1: GitHub Pages (Recomendado)

1. **Crear repositorio en GitHub:**
   - Subir archivos: `index_js_only.html`, `exam-system.js`, `admin_js.html`, `images/`
   - Renombrar `index_js_only.html` a `index.html`

2. **Activar GitHub Pages:**
   - Ir a Settings > Pages
   - Seleccionar source "Deploy from a branch"
   - Elegir branch main/master

3. **URLs de acceso:**
   - **Estudiantes:** `https://tu-usuario.github.io/tu-repo/`
   - **Administración:** `https://tu-usuario.github.io/tu-repo/admin_js.html`

### Opción 2: Netlify/Vercel

1. **Subir archivos:**
   ```bash
   index.html           (renombrado desde index_js_only.html)
   exam-system.js
   admin_js.html
   images/UcatecLogo.png
   ```

2. **Despliegue automático:**
   - Conectar repositorio GitHub o subir ZIP
   - Configuración automática, sin build steps necesarios

### Opción 3: Cualquier Hosting Gratuito

Compatible con **cualquier servicio** que soporte archivos estáticos:
- Firebase Hosting, Surge.sh, Render, Railway, etc.
- Solo subir los 4 archivos principales

## Configuración del Examen

### Parámetros Editables (en exam-system.js)
```javascript
const EXAM_CONFIG = {
    DURATION_MINUTES: 120,    // Duración en minutos
    MAX_ATTEMPTS: 1,          // Intentos máximos por estudiante
    EXAM_ID: 'PROG_INTERNET_II_2025'
};
```

### Estructura de Preguntas
- **Selección múltiple (q1-q5):** 4 puntos cada una
- **Verdadero/Falso (q6-q10, q17-q18):** 3 puntos cada una  
- **Respuesta corta (q11-q15):** 4 puntos (q11-q14), 3 puntos (q15)
- **Asociación CRUD (q16):** 2.5 puntos cada parte
- **Preguntas prácticas (p1-p5):** Evaluación manual

**Puntaje máximo objetivas:** 68 puntos  
**Puntaje máximo total:** 100 puntos (68 objetivas + 32 prácticas)

## 💾 Gestión de Datos

### Almacenamiento Local
Los datos se guardan automáticamente en `localStorage` del navegador:

- `exam_students_data` - Información de estudiantes
- `exam_submissions` - Respuestas enviadas  
- `exam_current_session` - Sesión actual

### Panel de Administración
Acceso en `admin_js.html` con funciones completas:

- ✅ Ver estadísticas generales
- ✅ Lista de estudiantes registrados
- ✅ Ver respuestas individuales
- ✅ Exportar datos a CSV/JSON
- ✅ Eliminar registros individuales
- ✅ Limpiar todos los datos

### Exportación de Datos

- **CSV:** Para análisis en Excel/Google Sheets
- **JSON:** Para backup completo y migración
- **Individual:** Descarga por estudiante

## 🌐 Compatibilidad Total

### Navegadores Soportados

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

### Dispositivos

- ✅ Computadoras de escritorio
- ✅ Laptops
- ✅ Tablets
- ✅ Smartphones

### Servicios de Hosting Gratuito

- ✅ **GitHub Pages** (recomendado)
- ✅ **Netlify** (fácil despliegue)
- ✅ **Vercel** (rápido)
- ✅ **Firebase Hosting**
- ✅ **Surge.sh**
- ✅ **Render**, **Railway**
- ✅ Cualquier hosting que soporte HTML/CSS/JS

## ⚡ Ventajas de la Versión JavaScript

### ✅ Beneficios Principales

- **Costo cero**: Compatible con hosting 100% gratuito
- **Despliegue instantáneo**: Solo subir archivos, sin configuración
- **Sin dependencias**: No requiere base de datos ni servidor
- **Máxima compatibilidad**: Funciona en cualquier hosting web
- **Fácil migración**: Exportar/importar datos en JSON
- **Mantenimiento mínimo**: Sin actualizaciones de servidor

### ⚠️ Consideraciones Importantes

- Los datos se almacenan localmente en cada navegador
- Al limpiar datos del navegador, se pierden los registros
- Para instituciones grandes, considerar solución con base de datos
- Los datos son accesibles desde herramientas del desarrollador

## 🔧 Personalización del Sistema

### Configuración Básica (exam-system.js)

```javascript
const EXAM_CONFIG = {
    DURATION_MINUTES: 120,    // Duración en minutos
    MAX_ATTEMPTS: 1,          // Intentos máximos por estudiante
    EXAM_ID: 'PROG_INTERNET_II_2025'  // Identificador del examen
};
```

### Modificar Preguntas
- Editar directamente en `index_js_only.html`
- Mantener la estructura de `name="q1"`, `name="q2"`, etc.
- Actualizar respuestas correctas en `exam-system.js` función `calculateScore()`

### Cambiar Institución
- Reemplazar logo en `images/UcatecLogo.png`
- Actualizar textos institucionales en el HTML
- Modificar información de contacto

## � Estructura de Evaluación

### Tipos de Preguntas

- **Selección múltiple (q1-q5):** 4 puntos cada una = 20 pts
- **Verdadero/Falso (q6-q10, q17-q18):** 3 puntos c/u = 21 pts  
- **Respuesta corta (q11-q15):** Variable (3-4 pts) = 19 pts
- **Asociación CRUD (q16):** 2.5 puntos por parte = 10 pts
- **Preguntas prácticas (p1-p5):** Evaluación manual = 32 pts

## 🛠️ Soporte Técnico

### Problemas Comunes y Soluciones

#### "No se guardan las respuestas"

- Verificar que localStorage esté habilitado en el navegador
- Comprobar espacio disponible en el navegador
- Revisar si está en modo incógnito (no persiste datos)

#### "El temporizador no funciona"

- Verificar que JavaScript esté habilitado
- Revisar consola del navegador por errores
- Comprobar conexión estable a internet

#### "No aparecen estudiantes en admin"

- Verificar que se hayan completado exámenes
- Comprobar mismo dominio/origen del sitio web
- Limpiar caché del navegador

### Migración de Datos

Para transferir datos entre instalaciones:

1. **Exportar:** Usar panel admin para descargar JSON completo
2. **Respaldar:** Guardar archivo en lugar seguro
3. **Migrar:** Subir datos manualmente en nueva instalación

---

## 📞 Información del Proyecto

**Sistema:** Evaluación Online - Hosting Gratuito  
**Versión:** 3.0 JavaScript Optimizada  
**Fecha:** Julio 2025  
**Institución:** Universidad Católica Luis Amigó (UCATEC)  
**Materia:** Programación en Internet II  
**Desarrollado para:** Máxima compatibilidad con hosting gratuito

### Características Técnicas

- **Frontend:** HTML5, CSS3, JavaScript ES6+
- **Estilos:** Tailwind CSS (CDN)
- **Almacenamiento:** localStorage API
- **Compatibilidad:** 100% navegadores modernos
- **Dependencias:** Cero (completamente standalone)

### Enlaces Útiles

- **GitHub Pages:** [Documentación](https://pages.github.com/)
- **Netlify:** [Guía de despliegue](https://www.netlify.com/)
- **Vercel:** [Deploy estático](https://vercel.com/)

---

✨ **¡Listo para usar!** Solo subir archivos y comenzar a evaluar.
