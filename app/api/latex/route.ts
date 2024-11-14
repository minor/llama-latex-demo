import { NextRequest, NextResponse } from 'next/server';
import { img2latex } from 'llama-latex';
import { writeFile } from 'fs/promises';
import path from 'path';
import os from 'os';

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

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload an image.' },
        { status: 400 }
      );
    }

    // Get file buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename using a timestamp and random string
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const tempFilePath = path.join(os.tmpdir(), `latex-${uniqueSuffix}-${file.name}`);

    try {
      // Write to temp directory
      await writeFile(tempFilePath, buffer);
      
      const latex = await img2latex({
        filePath: tempFilePath,
        apiKey: process.env.TOGETHER_API_KEY as string,
      });
      return NextResponse.json({ latex });
    } catch (error) {
      if (error instanceof Error) {
        console.error('Conversion error:', error.message);
        return NextResponse.json(
          { error: `Error converting image: ${error.message}` },
          { status: 500 }
        );
      }
      throw error;
    } finally {
      // Cleanup: Try to remove the temporary file
      try {
        const fs = require('fs');
        if (fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
        }
      } catch (cleanupError) {
        console.error('Error cleaning up temp file:', cleanupError);
      }
    }
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { error: 'Error processing image. Please try again.' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};

export const runtime = 'nodejs';