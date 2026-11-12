export const MAX_IMAGE_UPLOAD_SIZE = 10 * 1024 * 1024;

export function getImageFileError(file: File): string | null {
  if (!file.type.startsWith('image/')) {
    return 'Choose an image file';
  }
  if (file.size > MAX_IMAGE_UPLOAD_SIZE) {
    return 'Image must be 10 MB or smaller';
  }
  return null;
}

export async function uploadImageToCloudinary(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  if (!cloudName || !uploadPreset) {
    throw new Error('Image upload is not configured');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`,
    { method: 'POST', body: formData }
  );
  const result: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage =
      result &&
      typeof result === 'object' &&
      'error' in result &&
      result.error &&
      typeof result.error === 'object' &&
      'message' in result.error &&
      typeof result.error.message === 'string'
        ? result.error.message
        : `Image upload failed (${response.status})`;
    throw new Error(errorMessage);
  }

  if (
    !result ||
    typeof result !== 'object' ||
    !('secure_url' in result) ||
    typeof result.secure_url !== 'string'
  ) {
    throw new Error('Cloudinary returned an invalid upload response');
  }

  let uploadedUrl: URL;
  try {
    uploadedUrl = new URL(result.secure_url);
  } catch {
    throw new Error('Cloudinary returned an invalid upload response');
  }
  if (uploadedUrl.protocol !== 'https:' || !uploadedUrl.hostname) {
    throw new Error('Cloudinary returned an invalid upload response');
  }

  return result.secure_url;
}
