# Auditoría de Seguridad - GeoApps

## 🚨 Hallazgos Críticos

### 1. Inyección de Comandos (RCE) en `route.ts`
**Estado:** ✅ RESUELTO
**Severidad:** CRÍTICA
**Ubicación:** `app/api/process-image/route.ts`

**Descripción Original:**
La variable `numClusters` se obtenía directamente del input del usuario sin validación.

**Solución Aplicada:**
- Se valida que `numClusters` sea un entero entre 2 y 10.
- Se reemplazó `exec` por `execFile` para evitar interpretación de shell.
- Se pasan argumentos como array.

### 2. Path Traversal Potencial
**Severidad:** MEDIA
**Ubicación:** `process_satellite.py`

El script de Python acepta un nombre de archivo y lo procesa. Aunque en la implementación actual de `route.ts` el nombre del archivo es generado por el servidor (`Date.now()`), si en el futuro se permite al usuario definir el nombre, podría sobrescribir archivos del sistema.

### 3. Denegación de Servicio (DoS) por Llenado de Disco
**Severidad:** ALTA
**Ubicación:** `app/api/process-image/route.ts`

**Descripción:**
El servidor guarda imágenes en `temp/` y genera imágenes de análisis (`_analysis.png`) pero **nunca las elimina**. Un atacante puede subir imágenes repetidamente hasta llenar el disco duro del servidor, causando una caída del sistema.

**Recomendación:**
Implementar una rutina de limpieza que elimine los archivos temporales después de procesarlos o usar un cron job para limpiar el directorio `temp/`.

## 🛡️ Recomendaciones Generales

1.  **Validación de Inputs:** Nunca confiar en los datos del cliente. Usar librerías como `zod` para validar esquemas.
2.  **Principio de Menor Privilegio:** El proceso de Node.js no debe correr como root/admin.
3.  **Sanitización:** Usar `child_process.execFile` en lugar de `exec` para evitar que se interpreten caracteres de shell.
