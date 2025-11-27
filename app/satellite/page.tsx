"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import CoordinateInput from "@/components/CoordinateInput";

// Dynamically import SatelliteMap with no SSR to avoid Leaflet issues
const SatelliteMap = dynamic(() => import("@/components/SatelliteMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] rounded-lg bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center border border-zinc-200 dark:border-zinc-800">
      <p className="text-zinc-600 dark:text-zinc-400">Cargando mapa...</p>
    </div>
  ),
});

export default function SatellitePage() {
  // Default coordinates: New York City
  const [coordinates, setCoordinates] = useState({
    lat: 40.7128,
    lng: -74.006,
  });

  const handleCoordinatesChange = (lat: number, lng: number) => {
    setCoordinates({ lat, lng });
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Visor de Imágenes Satelitales
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Ingresa las coordenadas para ver la imagen satelital del lugar
          </p>
        </header>

        <div className="space-y-6">
          <CoordinateInput
            onCoordinatesChange={handleCoordinatesChange}
            initialLat={coordinates.lat}
            initialLng={coordinates.lng}
          />

          <SatelliteMap
            latitude={coordinates.lat}
            longitude={coordinates.lng}
            zoom={13}
          />
        </div>

        <footer className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-500">
          <p>
            Coordenadas actuales: {coordinates.lat.toFixed(6)},{" "}
            {coordinates.lng.toFixed(6)}
          </p>
        </footer>
      </div>
    </div>
  );
}
