import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { img2latex } from 'llama-latex';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Create a temporary file path
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Save file temporarily in /tmp directory
    const tempFilePath = path.join('/tmp', `${Date.now()}-${file.name}`);
    await writeFile(tempFilePath, buffer);

    // Convert to LaTeX
    const latex = await img2latex({
      filePath: tempFilePath,
      apiKey: process.env.TOGETHER_API_KEY as string,
    });

    return NextResponse.json({ latex });
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { error: 'Error processing image' },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';