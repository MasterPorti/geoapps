# Plan de Pruebas (Testing Strategy)

Para asegurar la robustez de GeoApps, se propone la siguiente estrategia de pruebas.

## 1. Tests Unitarios (Python)
Validar la lógica de procesamiento de imágenes de forma aislada.

**Herramienta:** `pytest`

**Casos de Prueba:**
-   `test_process_image_valid`: Pasar una imagen pequeña conocida y verificar que retorna el JSON con la estructura correcta.
-   `test_process_image_invalid_path`: Pasar una ruta inexistente y verificar que maneja el error.
-   `test_kmeans_logic`: Verificar que el número de clusters devueltos coincide con el solicitado.

**Ejemplo de Fixture:**
Crear una imagen dummy de 10x10 píxeles con 2 colores sólidos para predecir el resultado exacto del clustering.

## 2. Tests de Integración (API)
Validar que la API de Next.js se comunica correctamente con el script de Python.

**Herramienta:** `Jest` + `node-mocks-http` o `supertest`

**Casos de Prueba:**
-   `POST /api/process-image` con imagen válida: Debe retornar 200 y JSON con `success: true`.
-   `POST /api/process-image` sin imagen: Debe retornar 400.
-   `POST /api/process-image` con `numClusters` inválido: (Tras aplicar el fix de seguridad) Debe retornar 400.

## 3. Tests End-to-End (E2E)
Simular el flujo completo del usuario en el navegador.

**Herramienta:** `Playwright` o `Cypress`

**Flujo:**
1.  Abrir página `/satellite`.
2.  Subir una imagen de prueba.
3.  Seleccionar 3 clusters.
4.  Clic en "Procesar".
5.  Esperar a que aparezca la imagen de resultado.
6.  Verificar que se muestran las estadísticas.

## 4. Cobertura de Código (Coverage)
-   **Meta:** >80% en lógica de negocio (Python) y >70% en API Routes.
