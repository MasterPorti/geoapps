"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import leafletImage from "leaflet-image";
import "leaflet/dist/leaflet.css";

interface SatelliteMapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
}

// Fix for default marker icon in Next.js
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function SatelliteMap({
  latitude,
  longitude,
  zoom = 13,
}: SatelliteMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Update map center when coordinates change
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.flyTo([latitude, longitude], zoom, {
        duration: 1.5,
      });
    }
  }, [latitude, longitude, zoom]);

  const handleDownloadImage = () => {
    if (!mapRef.current) return;

    setIsDownloading(true);

    // Hide marker before capturing
    if (markerRef.current) {
      markerRef.current.remove();
    }

    // Wait a bit for the marker to be removed from the map
    setTimeout(() => {
      if (!mapRef.current) return;

      leafletImage(mapRef.current, (err: Error | null, canvas: HTMLCanvasElement) => {
        // Show marker again after capturing
        if (markerRef.current && mapRef.current) {
          markerRef.current.addTo(mapRef.current);
        }

        if (err) {
          console.error("Error al capturar el mapa:", err);
          alert("Error al capturar la imagen. Por favor intenta nuevamente.");
          setIsDownloading(false);
          return;
        }

        // Convert canvas to blob and download
        canvas.toBlob((blob) => {
          if (!blob) {
            alert("Error al crear la imagen.");
            setIsDownloading(false);
            return;
          }

          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `satellite-${latitude.toFixed(4)}-${longitude.toFixed(4)}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          setIsDownloading(false);
        });
      });
    }, 100);
  };

  const position: [number, number] = [latitude, longitude];

  return (
    <div className="w-full">
      <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg border border-zinc-200 dark:border-zinc-800">
        <MapContainer
          center={position}
          zoom={zoom}
          className="h-full w-full"
          ref={mapRef}
        >
          <TileLayer
            attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
          <Marker position={position} icon={icon} ref={markerRef}>
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">Ubicación:</p>
                <p>Latitud: {latitude.toFixed(6)}</p>
                <p>Longitud: {longitude.toFixed(6)}</p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      <div className="mt-4 flex justify-center">
        <button
          onClick={handleDownloadImage}
          disabled={isDownloading}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center gap-2"
        >
          {isDownloading ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Guardando...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Guardar Imagen PNG
            </>
          )}
        </button>
      </div>
    </div>
  );
}
