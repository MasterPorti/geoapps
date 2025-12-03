# Procesamiento de Imágenes Satelitales con K-Means

Este proyecto incluye funcionalidad de procesamiento de imágenes satelitales usando el algoritmo K-Means clustering implementado en Python.

## Requisitos

- Python 3.7 o superior
- Node.js 18 o superior
- Dependencias de Python instaladas (ver abajo)

## Instalación de Dependencias de Python

Las dependencias ya están instaladas, pero si necesitas reinstalarlas:

```bash
pip install -r requirements.txt
```

Las dependencias incluyen:
- `numpy` - Procesamiento numérico
- `matplotlib` - Generación de gráficos
- `opencv-python` - Procesamiento de imágenes

## Cómo Usar

1. **Inicia el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

2. **Abre la aplicación en tu navegador**:
   - Ve a http://localhost:3000/satellite

3. **Captura y procesa imágenes**:
   - La aplicación mostrará un mapa satelital
   - Usa el botón **"Guardar Imagen PNG"** para descargar la imagen localmente
   - Usa el botón **"Analizar con Python"** para procesar la imagen con K-Means

4. **Resultados del análisis**:
   - Se generará un dashboard completo con:
     - Imagen original
     - Imagen segmentada (4 clusters por defecto)
     - Gráfico de distribución de cobertura
     - Desglose detallado de cada cluster
   - Tabla con información de cada cluster (color RGB y porcentaje)

## Cómo Funciona

### Algoritmo K-Means

El script de Python ([process_satellite.py](process_satellite.py)) realiza:

1. **Carga de imagen**: Lee la imagen satelital
2. **Preprocesamiento**: Convierte la imagen a RGB y aplana los píxeles
3. **Clustering K-Means**: Agrupa los píxeles en 4 clusters (clases)
4. **Segmentación**: Reconstruye la imagen con los colores representativos de cada cluster
5. **Análisis estadístico**: Calcula el porcentaje de cada cluster
6. **Visualización**: Genera un dashboard completo con todos los resultados

### Clusters Típicos

Los 4 clusters usualmente representan:
- **Agua**: Tonos azules/oscuros
- **Vegetación**: Tonos verdes
- **Zonas urbanas**: Tonos grises/blancos
- **Tierra desnuda**: Tonos marrones/beige

## Estructura de Archivos

```
geoapps/
├── process_satellite.py        # Script principal de procesamiento
├── requirements.txt            # Dependencias de Python
├── temp/                       # Carpeta temporal para imágenes
├── app/
│   └── api/
│       └── process-image/
│           └── route.ts        # API endpoint para procesamiento
└── components/
    └── SatelliteMap.tsx        # Componente React del mapa
```

## Notas Importantes

- ⚠️ **Solo funciona localmente**: El procesamiento de Python requiere que tengas Python instalado en tu máquina
- 🔒 **No se sube al repositorio**: La carpeta `temp/` está en `.gitignore`
- 📊 **Personalizable**: Puedes cambiar el número de clusters editando la línea 140 en [SatelliteMap.tsx](components/SatelliteMap.tsx:140):
  ```typescript
  formData.append('numClusters', '4'); // Cambia este número
  ```

## Troubleshooting

### Error: "python no se reconoce como comando"
- Asegúrate de que Python esté instalado y en el PATH del sistema
- Intenta usar `python3` en lugar de `python` en sistemas Unix

### Error: "No se encontró el módulo cv2"
- Reinstala las dependencias: `pip install -r requirements.txt`

### Error: "Cannot find module 'sharp'"
- Instala sharp: `npm install sharp`

### El análisis tarda mucho
- Es normal, el procesamiento de K-Means puede tomar 10-30 segundos dependiendo del tamaño de la imagen

## Ejemplo de Uso

1. Navega al mapa satelital
2. Busca una ubicación interesante (por ejemplo, un bosque, ciudad, lago)
3. Haz clic en "Analizar con Python"
4. Espera 10-30 segundos
5. Observa el dashboard generado con la segmentación y estadísticas

## Desarrollo Futuro

Posibles mejoras:
- [ ] Selector de número de clusters en la UI
- [ ] Exportar resultados en formato JSON
- [ ] Comparación temporal de imágenes
- [ ] Detección automática de tipos de cobertura
- [ ] Cálculo de áreas en km²
