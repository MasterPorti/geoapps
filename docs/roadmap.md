# Roadmap del Proyecto

## Corto Plazo (Inmediato)
-   [ ] **Seguridad:** Corregir la vulnerabilidad de inyección de comandos en `route.ts`.
-   [ ] **Limpieza:** Implementar borrado automático de archivos en `temp/`.
-   [ ] **Validación:** Añadir validación estricta de tipos de archivo (solo imágenes).

## Mediano Plazo (Mejoras de Arquitectura)
-   [ ] **Dockerización:** Crear `Dockerfile` para asegurar que las dependencias de Python y Node.js sean consistentes en cualquier entorno.
-   [ ] **API Robusta:** Reemplazar la llamada `exec` por un microservicio real en Python (FastAPI) o usar una cola de tareas (Celery/BullMQ) para no bloquear el hilo principal.
-   [ ] **Frontend:** Mejorar el feedback visual (barras de carga reales, manejo de errores amigable).

## Largo Plazo (Evolución)
-   [ ] **Base de Datos:** Implementar PostgreSQL + PostGIS para guardar análisis históricos y geometrías.
-   [ ] **GIS Real:** Permitir exportar resultados en formato GeoJSON o GeoTIFF.
-   [ ] **Auth:** Sistema de usuarios para guardar proyectos personales.
