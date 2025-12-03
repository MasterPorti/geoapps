# GeoApps 🌍

> Plataforma de análisis satelital impulsada por Inteligencia Artificial y Visión por Computadora.

![Status](https://img.shields.io/badge/Status-Stable-green)
![Security](https://img.shields.io/badge/Security-Patched-blue)

## 📖 Descripción
GeoApps permite a investigadores y entusiastas analizar imágenes satelitales utilizando algoritmos de clustering (K-Means) para segmentar y clasificar tipos de terreno de manera automática.

## 🚀 Características
-   **Análisis Visual:** Segmentación de imágenes en tiempo real.
-   **Dashboard Interactivo:** Visualización de estadísticas de cobertura.
-   **Stack Moderno:** Construido con Next.js 16 y Python.

## 🛠️ Instalación y Configuración

### Prerrequisitos
-   Node.js 18+
-   Python 3.9+
-   Pip

### Pasos
1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/josprox/geoapps.git
    cd geoapps
    ```

2.  **Instalar dependencias de Frontend:**
    ```bash
    npm install
    ```

3.  **Instalar dependencias de Python:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Iniciar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

5.  **Acceder:**
    Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📂 Estructura del Proyecto
```
geoapps/
├── app/                # Código fuente Next.js (App Router)
│   ├── api/            # API Routes (Backend Node.js)
│   └── satellite/      # Página principal de la herramienta
├── docs/               # Documentación técnica detallada
├── process_satellite.py # Script Core de procesamiento (Python)
└── public/             # Assets estáticos
```

## 📚 Documentación
Para detalles técnicos profundos, consulta la carpeta `/docs`:
-   [Visión General](docs/overview.md)
-   [Arquitectura](docs/architecture.md)
-   [Seguridad](docs/security.md)
-   [Testing](docs/testing.md)
-   [Guía de Despliegue (VPS/HestiaCP)](docs/deployment.md) 🚀

## 🤝 Contribuir
Este proyecto es de código abierto. Por favor, lee `docs/roadmap.md` antes de contribuir.

---
Desarrollado con ❤️ por JosProx
