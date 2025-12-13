interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  bytes: number;
}

export const uploadBase64ToCloudinary = async (
  base64String: string,
  fileName: string = 'upload'
): Promise<CloudinaryUploadResult> => {
  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    
    if (!cloudName) {
      throw new Error('Cloudinary cloud name not configured');
    }

    const formData = new FormData();
    formData.append('file', base64String);
    formData.append('upload_preset', 'event_decorations');
    formData.append('public_id', fileName);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    console.log('✅ Uploaded to Cloudinary:', data.secure_url);
    return data;
  } catch (error) {
    console.error('❌ Upload failed:', error);
    throw new Error(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Extract public_id and resource type from Cloudinary URL
export const extractFileInfoFromUrl = (url: string): { publicId: string | null; resourceType: string } => {
  if (!url || !url.includes('cloudinary')) {
    return { publicId: null, resourceType: 'image' };
  }
  
  try {
    // Determine resource type from URL path
    let resourceType = 'image';
    if (url.includes('/video/upload/')) {
      resourceType = 'video';
    } else if (url.includes('/image/upload/')) {
      resourceType = 'image';
    }
    
    // Extract public_id - get the filename without extension
    const urlParts = url.split('/');
    const filenameWithExt = urlParts[urlParts.length - 1];
    const publicId = filenameWithExt.replace(/\.[^/.]+$/, ''); // Remove file extension
    
    return { publicId: publicId || null, resourceType };
  } catch {
    return { publicId: null, resourceType: 'image' };
  }
};

// Simple public_id extraction (backward compatibility)
export const extractPublicIdFromUrl = (url: string): string | null => {
  const { publicId } = extractFileInfoFromUrl(url);
  return publicId;
};

// Delete file from Cloudinary using API route (supports both images and videos)
export const deleteFromCloudinary = async (url: string): Promise<boolean> => {
  try {
    const { publicId, resourceType } = extractFileInfoFromUrl(url);
    
    if (!publicId) {
      console.warn('⚠️ No public_id found for URL:', url);
      return false;
    }

    console.log(`🔄 Deleting ${resourceType} via API route:`, publicId);

    const response = await fetch('/api/cloudinary/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId, resourceType }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.warn('⚠️ API delete failed:', result.error);
      return false;
    }

    console.log(`✅ Successfully deleted ${resourceType} via API:`, publicId);
    return true;

  } catch (error) {
    console.error('❌ Cloudinary delete error:', error);
    return false;
  }
};

// Delete multiple files from Cloudinary
export const deleteMultipleFromCloudinary = async (urls: string[]): Promise<void> => {
  if (!urls || urls.length === 0) {
    console.log('🔄 No files to delete from Cloudinary');
    return;
  }

  console.log('🔄 Deleting from Cloudinary:', urls.length, 'files');
  
  const validUrls = urls.filter(url => url && url.includes('cloudinary'));
  
  if (validUrls.length === 0) {
    console.log('🔄 No valid Cloudinary URLs');
    return;
  }

  // Delete files sequentially
  let successCount = 0;
  for (const url of validUrls) {
    try {
      const success = await deleteFromCloudinary(url);
      if (success) successCount++;
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.warn('⚠️ Failed to delete, continuing:', url);
    }
  }
  
  console.log(`✅ Cloudinary deletion completed: ${successCount}/${validUrls.length} files deleted`);
};