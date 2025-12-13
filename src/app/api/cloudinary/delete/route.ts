import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { publicId, resourceType = 'image' } = await request.json();

    console.log('🔄 Cloudinary delete API called for:', { publicId, resourceType });

    if (!publicId) {
      console.error('❌ No publicId provided');
      return NextResponse.json(
        { error: 'Public ID is required' },
        { status: 400 }
      );
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.error('❌ Cloudinary environment variables missing');
      return NextResponse.json(
        { error: 'Cloudinary configuration incomplete' },
        { status: 500 }
      );
    }

    // Create the signature for authenticated request
    const timestamp = Math.round(Date.now() / 1000);
    const signature = require('crypto')
      .createHash('sha1')
      .update(`public_id=${publicId}&timestamp=${timestamp}${apiSecret}`)
      .digest('hex');

    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);

    // Use the correct endpoint based on resource type
    const endpoint = resourceType === 'video' ? 'video/destroy' : 'image/destroy';
    
    console.log(`📤 Sending authenticated request to Cloudinary ${endpoint}...`);

    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${endpoint}`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const result = await cloudinaryResponse.json();
    console.log('📥 Cloudinary response:', result);

    if (result.result === 'ok') {
      console.log(`✅ Successfully deleted ${resourceType} from Cloudinary:`, publicId);
      return NextResponse.json({ 
        success: true, 
        message: `${resourceType} deleted from Cloudinary`,
        publicId,
        resourceType,
        result: result.result
      });
    } else {
      console.error(`❌ Cloudinary ${resourceType} deletion failed:`, result);
      return NextResponse.json(
        { error: `Cloudinary ${resourceType} deletion failed: ${result.result}`, details: result },
        { status: 400 }
      );
    }
    
  } catch (error) {
    console.error('❌ Cloudinary delete API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}