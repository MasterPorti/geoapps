declare module 'leaflet-image' {
  import { Map } from 'leaflet';

  function leafletImage(
    map: Map,
    callback: (error: Error | null, canvas: HTMLCanvasElement) => void
  ): void;

  export default leafletImage;
}
