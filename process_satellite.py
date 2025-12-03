import numpy as np
import matplotlib
matplotlib.use('Agg')  # Backend sin interfaz gráfica para servidores
import matplotlib.pyplot as plt
import cv2
import sys
import os
import json
import traceback

# Configurar UTF-8 para Windows
if sys.platform == "win32":
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

def process_image(nombre_imagen, num_clusters=4):
    """
    Procesa una imagen satelital usando K-Means clustering
    """
    results = {
        "success": False,
        "output_image": None,
        "clusters": [],
        "error": None
    }

    try:
        # 1. VALIDACIÓN
        if not os.path.exists(nombre_imagen):
            raise FileNotFoundError(f"No se encontró el archivo: {nombre_imagen}")

        # 2. CARGA Y PREPROCESAMIENTO
        print(f"🔄 Procesando {nombre_imagen}...")
        img = cv2.imread(nombre_imagen)

        if img is None:
            raise ValueError("El archivo no es una imagen válida o está corrupto")

        # Convertir a RGB
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        # Aplanar imagen para K-Means
        pixel_values = img_rgb.reshape((-1, 3))
        pixel_values = np.float32(pixel_values)

        # 3. ALGORITMO K-MEANS
        print("🧮 Ejecutando K-Means clustering...")
        criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 100, 0.2)
        _, labels, centers = cv2.kmeans(pixel_values, num_clusters, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)

        # Convertir centros a colores enteros (0-255)
        centers = np.uint8(centers)

        # Reconstruir imagen segmentada
        segmented_data = centers[labels.flatten()]
        segmented_image = segmented_data.reshape((img_rgb.shape))

        # 4. CÁLCULOS ESTADÍSTICOS
        counts = np.bincount(labels.flatten())
        total_pixels = len(labels.flatten())
        percentages = (counts / total_pixels) * 100

        # Ordenar por porcentaje (Mayor a menor)
        indices_ordenados = np.argsort(percentages)[::-1]
        percentages_sorted = percentages[indices_ordenados]
        centers_sorted = centers[indices_ordenados]

        # ==========================================
        # 🎨 GENERACIÓN DEL DASHBOARD
        # ==========================================
        print("📊 Generando dashboard...")
        plt.figure(figsize=(20, 12))

        # --- FILA SUPERIOR: RESUMEN GLOBAL ---

        # 1. Original
        plt.subplot(2, 3, 1)
        plt.imshow(img_rgb)
        plt.title("1. Imagen Satelital Original", fontsize=14, fontweight='bold')
        plt.axis('off')

        # 2. Segmentada (Caricatura)
        plt.subplot(2, 3, 2)
        plt.imshow(segmented_image)
        plt.title(f"2. Segmentación K-Means (K={num_clusters})", fontsize=14, fontweight='bold')
        plt.axis('off')

        # 3. Gráfico de Barras
        plt.subplot(2, 3, 3)
        colors_normalized = centers_sorted / 255.0
        bars = plt.bar(range(num_clusters), percentages_sorted, color=colors_normalized, edgecolor='black')
        plt.title("3. Distribución de Cobertura (%)", fontsize=14, fontweight='bold')
        plt.xticks(range(num_clusters), [f'Cluster {i}' for i in indices_ordenados])
        plt.ylim(0, 100)

        # Etiquetas en barras
        for bar, pct in zip(bars, percentages_sorted):
            plt.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1,
                     f'{pct:.1f}%', ha='center', va='bottom', fontsize=11, fontweight='bold')

        # --- FILA INFERIOR: DESGLOSE DETALLADO (MODO DETECTIVE) ---
        for i in range(min(3, num_clusters)):  # Mostramos hasta 3 clusters
            cluster_idx = indices_ordenados[i]

            # Crear máscara
            mask = (labels.flatten() == cluster_idx).reshape(img.shape[0], img.shape[1])
            mask = np.uint8(mask)

            # Aplicar máscara a imagen original
            masked_img = cv2.bitwise_and(img_rgb, img_rgb, mask=mask)

            plt.subplot(2, 3, 4 + i)
            plt.imshow(masked_img)
            pct = percentages[cluster_idx]
            plt.title(f"Cluster {cluster_idx} ({pct:.1f}%)\n¿Qué es esto?", fontsize=12)
            plt.axis('off')

            # Poner borde del color del cluster
            for spine in plt.gca().spines.values():
                spine.set_edgecolor(centers[cluster_idx]/255.0)
                spine.set_linewidth(3)

        plt.tight_layout()

        # Guardar figura
        base_name = os.path.splitext(nombre_imagen)[0]
        output_path = f"{base_name}_analysis.png"
        plt.savefig(output_path, dpi=150, bbox_inches='tight')
        plt.close()

        print(f"✅ Dashboard guardado en: {output_path}")

        # Preparar resultados
        results["success"] = True
        results["output_image"] = output_path
        
        # --- REPORTE DE TEXTO ---
        print("\n📊 REPORTE DE RESULTADOS:")
        print("-" * 30)
        for i in indices_ordenados:
            cluster_info = {
                "cluster_id": int(i),
                "percentage": float(percentages[i]),
                "color_rgb": centers[i].tolist()
            }
            results["clusters"].append(cluster_info)
            print(f"🔹 Cluster {i}: {percentages[i]:.2f}% -> Color RGB Promedio: {centers[i]}")

    except Exception as e:
        print(f"❌ Error en process_image: {str(e)}")
        traceback.print_exc()
        results["error"] = str(e)
        results["success"] = False

    return results

if __name__ == "__main__":
    try:
        if len(sys.argv) < 2:
            print("❌ ERROR: Debes proporcionar el nombre de la imagen")
            sys.exit(1)

        nombre_imagen = sys.argv[1]
        num_clusters = int(sys.argv[2]) if len(sys.argv) > 2 else 4

        results = process_image(nombre_imagen, num_clusters)

        # Imprimir resultados en formato JSON para que puedan ser parseados
        print("\n" + "="*50)
        print("JSON_RESULTS:")
        print(json.dumps(results, indent=2))
        print("="*50)
        
    except Exception as e:
        print(f"❌ Error fatal: {e}")
        sys.exit(1)
