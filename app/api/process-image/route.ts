import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execPromise = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const numClusters = formData.get('numClusters') as string || '4';

    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó ninguna imagen' },
        { status: 400 }
      );
    }

    // Convertir el archivo a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Crear el nombre del archivo con timestamp
    const timestamp = Date.now();
    const fileName = `satellite-${timestamp}.png`;
    const tempDir = path.join(process.cwd(), 'temp');
    const filePath = path.join(tempDir, fileName);

    // Asegurar que el directorio temp existe
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Guardar el archivo
    await writeFile(filePath, buffer);
    console.log(`✅ Imagen guardada en: ${filePath}`);

    // Ejecutar el script de Python
    console.log('🐍 Ejecutando script de Python...');
    const pythonScript = path.join(process.cwd(), 'process_satellite.py');
    const command = `python "${pythonScript}" "${filePath}" ${numClusters}`;

    try {
      const { stdout, stderr } = await execPromise(command);

      console.log('📄 Salida del script:');
      console.log(stdout);

      if (stderr) {
        console.error('⚠️ Errores del script:');
        console.error(stderr);
      }

      // Extraer el JSON de los resultados
      const jsonMatch = stdout.match(/JSON_RESULTS:\s*(\{[\s\S]*?\})\s*={50}/);
      let results = null;

      if (jsonMatch && jsonMatch[1]) {
        try {
          results = JSON.parse(jsonMatch[1]);
        } catch (e) {
          console.error('Error parseando JSON:', e);
        }
      }

      // Leer la imagen generada si existe
      let analysisImageBase64 = null;
      if (results && results.output_image) {
        try {
          const analysisImageBuffer = fs.readFileSync(results.output_image);
          analysisImageBase64 = `data:image/png;base64,${analysisImageBuffer.toString('base64')}`;
        } catch (e) {
          console.error('Error leyendo imagen de análisis:', e);
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Imagen procesada exitosamente',
        results: results,
        analysisImage: analysisImageBase64,
        output: stdout,
        filePath: fileName
      });

    } catch (execError: any) {
      console.error('❌ Error ejecutando Python:', execError);
      return NextResponse.json({
        error: 'Error al ejecutar el procesamiento de Python',
        details: execError.message,
        stderr: execError.stderr,
        stdout: execError.stdout
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('❌ Error general:', error);
    return NextResponse.json(
      {
        error: 'Error procesando la imagen',
        details: error.message
      },
      { status: 500 }
    );
  }
}
