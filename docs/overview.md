# Visión General del Proyecto GeoApps

## 🌍 Descripción
GeoApps es una plataforma web diseñada para el procesamiento y visualización de imágenes satelitales. Su funcionalidad principal permite a los usuarios subir imágenes satelitales y aplicar algoritmos de segmentación (K-Means Clustering) para identificar diferentes tipos de cobertura terrestre (agua, vegetación, suelo urbano, etc.).

## 🎯 Objetivo
Proporcionar una herramienta accesible y visual para el análisis rápido de imágenes geoespaciales sin necesidad de software GIS complejo.

## 🛠️ Stack Tecnológico

### Frontend
-   **Framework:** Next.js 16 (React 19)
-   **Lenguaje:** TypeScript
-   **Estilos:** Tailwind CSS 4
-   **Mapas:** Leaflet / React-Leaflet

### Backend / Procesamiento
-   **API:** Next.js API Routes (Node.js)
-   **Core Lógico:** Python 3
-   **Librerías de Ciencia de Datos:** OpenCV, NumPy, Matplotlib

## 📦 Estado Actual
El proyecto ha alcanzado una fase **Estable (v1.0)** lista para despliegue.
-   ✅ Interfaz de usuario funcional.
-   ✅ API segura y robusta (RCE parcheado).
-   ✅ Manejo de errores implementado en Python y Node.js.
-   ✅ Documentación completa para despliegue.
-   ⚠️ Persistencia de datos (base de datos) pendiente para futuras versiones.
