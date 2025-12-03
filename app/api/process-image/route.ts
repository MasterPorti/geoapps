import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execFilePromise = promisify(execFile);

export async function POST(request: NextRequest) {
  let filePath: string | null = null;
  let analysisImagePath: string | null = null;

  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const numClustersRaw = formData.get('numClusters') as string;

    // 1. VALIDACIÓN DE INPUTS (Seguridad)
    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó ninguna imagen' },
        { status: 400 }
      );
    }

    // Validar que sea una imagen (básico)
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'El archivo debe ser una imagen válida' },
        { status: 400 }
      );
    }

    // Validar numClusters (Evitar RCE y valores locos)
    const numClusters = parseInt(numClustersRaw || '4', 10);
    if (isNaN(numClusters) || numClusters < 2 || numClusters > 10) {
      return NextResponse.json(
        { error: 'El número de clusters debe ser un entero entre 2 y 10' },
        { status: 400 }
      );
    }

    // 2. PREPARACIÓN DE ARCHIVOS
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = Date.now();
    // Sanitizar nombre de archivo (aunque usamos timestamp, es buena práctica)
    const safeFileName = `satellite-${timestamp}.png`;
    const tempDir = path.join(process.cwd(), 'temp');
    filePath = path.join(tempDir, safeFileName);

    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    await writeFile(filePath, buffer);
    console.log(`✅ Imagen guardada en: ${filePath}`);

    // 3. EJECUCIÓN SEGURA (execFile en lugar de exec)
    console.log('🐍 Ejecutando script de Python...');
    const pythonScript = path.join(process.cwd(), 'process_satellite.py');
    
    // Pasamos argumentos como array para evitar Shell Injection
    const args = [pythonScript, filePath, numClusters.toString()];

    const { stdout, stderr } = await execFilePromise('python', args);

    console.log('📄 Salida del script:', stdout);

    if (stderr) {
      console.warn('⚠️ Stderr del script:', stderr);
    }

    // 4. PROCESAMIENTO DE RESULTADOS
    const jsonMatch = stdout.match(/JSON_RESULTS:\s*(\{[\s\S]*?\})\s*={50}/);
    let results = null;

    if (jsonMatch && jsonMatch[1]) {
      try {
        results = JSON.parse(jsonMatch[1]);
      } catch (e) {
        console.error('Error parseando JSON:', e);
        throw new Error('La salida del script no es un JSON válido');
      }
    } else {
      throw new Error('No se encontraron resultados JSON en la salida del script');
    }

    // Leer la imagen generada
    let analysisImageBase64 = null;
    if (results && results.output_image) {
      analysisImagePath = results.output_image; // Guardamos path para borrar luego
      try {
        // Verificar que el path de salida esté dentro de temp (Path Traversal check)
        const resolvedOutputPath = path.resolve(results.output_image);
        if (!resolvedOutputPath.startsWith(path.resolve(tempDir))) {
           throw new Error('Intento de Path Traversal detectado en output_image');
        }

        const analysisImageBuffer = fs.readFileSync(resolvedOutputPath);
        analysisImageBase64 = `data:image/png;base64,${analysisImageBuffer.toString('base64')}`;
      } catch (e) {
        console.error('Error leyendo imagen de análisis:', e);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Imagen procesada exitosamente',
      results: results,
      analysisImage: analysisImageBase64
    });

  } catch (error: any) {
    console.error('❌ Error en API:', error);
    return NextResponse.json({
      error: 'Error procesando la imagen',
      details: error.message
    }, { status: 500 });

  } finally {
    // 5. LIMPIEZA (Evitar llenado de disco)
    try {
      if (filePath && fs.existsSync(filePath)) {
        await unlink(filePath);
        console.log(`🧹 Archivo temporal eliminado: ${filePath}`);
      }
      // Opcional: Borrar también la imagen de análisis generada por Python
      if (analysisImagePath && fs.existsSync(analysisImagePath)) {
         await unlink(analysisImagePath);
         console.log(`🧹 Imagen de análisis eliminada: ${analysisImagePath}`);
      }
    } catch (cleanupError) {
      console.error('⚠️ Error durante la limpieza de archivos:', cleanupError);
    }
  }
}
