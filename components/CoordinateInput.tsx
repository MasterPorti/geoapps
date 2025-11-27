"use client";

import { useState } from "react";

interface CoordinateInputProps {
  onCoordinatesChange: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
}

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
}

export default function CoordinateInput({
  onCoordinatesChange,
  initialLat = 40.7128,
  initialLng = -74.006,
}: CoordinateInputProps) {
  const [inputMode, setInputMode] = useState<"coordinates" | "location">("location");
  const [latitude, setLatitude] = useState<string>(initialLat.toString());
  const [longitude, setLongitude] = useState<string>(initialLng.toString());
  const [locationQuery, setLocationQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string>("");

  const handleCoordinateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    // Validation
    if (isNaN(lat) || isNaN(lng)) {
      setError("Por favor ingresa números válidos");
      return;
    }

    if (lat < -90 || lat > 90) {
      setError("La latitud debe estar entre -90 y 90");
      return;
    }

    if (lng < -180 || lng > 180) {
      setError("La longitud debe estar entre -180 y 180");
      return;
    }

    onCoordinatesChange(lat, lng);
  };

  const handleLocationSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSearchResults([]);

    if (!locationQuery.trim()) {
      setError("Por favor ingresa un nombre de ubicación");
      return;
    }

    setIsSearching(true);

    try {
      // Using Nominatim (OpenStreetMap) geocoding - free, no API key required
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          locationQuery
        )}&limit=5`,
        {
          headers: {
            "User-Agent": "GeoApps Satellite Viewer",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al buscar la ubicación");
      }

      const results: SearchResult[] = await response.json();

      if (results.length === 0) {
        setError("No se encontraron resultados. Intenta con otro nombre.");
        setIsSearching(false);
        return;
      }

      setSearchResults(results);
    } catch (err) {
      setError("Error al buscar la ubicación. Por favor intenta nuevamente.");
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectLocation = (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    setLatitude(lat.toString());
    setLongitude(lng.toString());
    setSearchResults([]);
    setLocationQuery("");
    onCoordinatesChange(lat, lng);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6 border border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-zinc-50">
          Buscar Ubicación
        </h2>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-zinc-200 dark:border-zinc-700">
          <button
            type="button"
            onClick={() => {
              setInputMode("location");
              setError("");
              setSearchResults([]);
            }}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              inputMode === "location"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            Por Nombre
          </button>
          <button
            type="button"
            onClick={() => {
              setInputMode("coordinates");
              setError("");
              setSearchResults([]);
            }}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              inputMode === "coordinates"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            Por Coordenadas
          </button>
        </div>

        {/* Location Search Form */}
        {inputMode === "location" && (
          <form onSubmit={handleLocationSearch}>
            <div className="mb-4">
              <label
                htmlFor="location"
                className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300"
              >
                Nombre del Lugar
              </label>
              <input
                type="text"
                id="location"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Torre Eiffel, París"
              />
            </div>

            <button
              type="submit"
              disabled={isSearching}
              className="w-full md:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isSearching ? "Buscando..." : "Buscar"}
            </button>
          </form>
        )}

        {/* Coordinate Input Form */}
        {inputMode === "coordinates" && (
          <form onSubmit={handleCoordinateSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="latitude"
                  className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300"
                >
                  Latitud (-90 a 90)
                </label>
                <input
                  type="number"
                  id="latitude"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  step="any"
                  className="w-full px-4 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: 40.7128"
                />
              </div>

              <div>
                <label
                  htmlFor="longitude"
                  className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300"
                >
                  Longitud (-180 a 180)
                </label>
                <input
                  type="number"
                  id="longitude"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  step="any"
                  className="w-full px-4 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: -74.0060"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full md:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Ver Ubicación
            </button>
          </form>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
              Resultados de búsqueda:
            </h3>
            <div className="space-y-2">
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectLocation(result)}
                  className="w-full text-left p-3 rounded-md bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 transition-colors"
                >
                  <p className="text-sm text-zinc-900 dark:text-zinc-100">
                    {result.display_name}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    {parseFloat(result.lat).toFixed(6)}, {parseFloat(result.lon).toFixed(6)}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
