import { NextRequest, NextResponse } from 'next/server';
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

    // use tmpfiles
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    const uploadResponse = await fetch('https://tmpfiles.org/api/v1/upload', {
      method: 'POST',
      body: uploadFormData
    });

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload to temporary storage');
    }

    const uploadData = await uploadResponse.json();
    const uploadUrl = uploadData.data.url;
    const downloadUrl = uploadUrl.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
    console.log("URL: " + downloadUrl)
    const latex = await img2latex({
      filePath: downloadUrl,
      apiKey: process.env.TOGETHER_API_KEY as string,
    });

    return NextResponse.json({ latex });
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error processing image' },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';