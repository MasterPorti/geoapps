# Guía de Despliegue en VPS (HestiaCP)

Esta guía detalla los pasos para desplegar GeoApps en un servidor VPS gestionado con HestiaCP.

## Prerrequisitos del Servidor
1.  **Node.js**: Versión 18 o superior.
2.  **Python**: Versión 3.9 o superior.
3.  **PM2**: Gestor de procesos para Node.js.
4.  **Nginx**: Servidor web (gestionado por HestiaCP).

## 1. Preparación del Entorno (SSH)

Accede a tu VPS vía SSH y asegúrate de tener las herramientas necesarias.

```bash
# Actualizar sistema
apt update && apt upgrade -y

# Instalar Python y venv (si no viene instalado)
apt install python3 python3-pip python3-venv -y

# Instalar Node.js (si usas NVM es recomendado, o vía repositorio)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Instalar PM2 globalmente
npm install -g pm2
```

## 2. Configuración en HestiaCP

1.  Entra al panel de HestiaCP.
2.  Ve a **WEB** y añade un nuevo dominio (ej. `geoapps.tudominio.com`).
3.  **Opciones avanzadas**:
    *   Habilita **Nginx Proxy**.
    *   Crea una plantilla personalizada o edita la configuración para hacer proxy a `localhost:3000`.
    *   Si HestiaCP tiene un instalador de "Node.js App", úsalo para configurar la ruta, pero el despliegue manual suele ser más flexible.

## 3. Instalación de la Aplicación

Navega a la carpeta de tu usuario/dominio (usualmente `/home/usuario/web/dominio/public_html`).

```bash
# Clonar el repo (o subir archivos vía SFTP)
git clone https://github.com/josprox/geoapps.git .
# O si subiste los archivos, asegúrate de estar en la raíz del proyecto

# 1. Instalar dependencias de Node
npm install

# 2. Configurar entorno Python
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
deactivate
```

> **Nota:** El script `route.ts` espera ejecutar `python`. Al usar un entorno virtual, asegúrate de que la variable de entorno o el comando apunten al python del venv, o instala las librerías globalmente (menos recomendado pero funcional en VPS dedicados).
>
> **Opción recomendada:** Modificar el comando en `route.ts` o usar un wrapper. Para este despliegue, asumiremos que instalas las librerías en el entorno global del usuario o activas el venv antes de lanzar PM2.

## 4. Construcción (Build)

```bash
npm run build
```

## 5. Ejecución con PM2

Crea un archivo `ecosystem.config.js` en la raíz (si no existe) con este contenido:

```javascript
module.exports = {
  apps: [{
    name: "geoapps",
    script: "npm",
    args: "start",
    env: {
      NODE_ENV: "production",
      PORT: 3000
    }
  }]
}
```

Inicia la aplicación:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 6. Configuración de Nginx (Reverse Proxy)

Si HestiaCP no configuró el proxy automáticamente, edita la configuración de Nginx para tu dominio:

```nginx
location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

## Verificación

Visita `https://geoapps.tudominio.com`. Deberías ver la aplicación funcionando.
Prueba subir una imagen para verificar que Python se ejecuta correctamente en el servidor.
