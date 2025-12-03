# Documentación de Módulos

## 🐍 Python: `process_satellite.py`

Este script es el núcleo de procesamiento de imágenes.

### Funciones
#### `process_image(nombre_imagen, num_clusters=4)`
-   **Entrada:** Ruta de la imagen (str), número de clusters (int).
-   **Salida:** Diccionario con resultados y ruta de la imagen generada.
-   **Lógica:**
    1.  Carga la imagen con OpenCV.
    2.  Convierte a espacio de color RGB.
    3.  Aplana la matriz de píxeles para alimentar el algoritmo K-Means.
    4.  Ejecuta `cv2.kmeans` para agrupar píxeles similares.
    5.  Reconstruye la imagen segmentada.
    6.  Calcula estadísticas (porcentaje de cobertura de cada cluster).
    7.  Genera un dashboard visual usando Matplotlib.

### Dependencias Clave
-   `opencv-python`: Procesamiento de imágenes.
-   `numpy`: Operaciones matriciales.
-   `matplotlib`: Generación de gráficos.

---

## ⚡ API Route: `app/api/process-image/route.ts`

Endpoint encargado de recibir la imagen y coordinar el procesamiento.

### Método: `POST`
-   **Body:** `FormData` con:
    -   `image`: Archivo de imagen.
    -   `numClusters`: String (número entero).

### Flujo de Ejecución
1.  **Validación:** Verifica si existe el archivo.
2.  **Almacenamiento:** Guarda el buffer del archivo en `temp/satellite-{timestamp}.png`.
3.  **Ejecución:** Llama a `python process_satellite.py` usando `child_process.exec`.
4.  **Parsing:** Captura `stdout`, busca el bloque JSON delimitado y lo parsea.
5.  **Lectura de Resultado:** Lee la imagen generada por Python y la convierte a Base64.
6.  **Respuesta:** Retorna JSON con metadatos y la imagen en Base64.

### Errores Comunes
-   `500 Internal Server Error`: Si Python falla o no se puede parsear el JSON.
-   `400 Bad Request`: Si no se envía imagen.
