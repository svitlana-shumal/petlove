import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getImageFileError,
  MAX_IMAGE_UPLOAD_SIZE,
  uploadImageToCloudinary,
} from '@/lib/cloudinary';

describe('Cloudinary image uploads', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
    vi.stubEnv('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME', 'test-cloud');
    vi.stubEnv('NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET', 'test-preset');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('uploads the file with the configured unsigned preset and returns its secure URL', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ secure_url: 'https://res.cloudinary.com/test/pet.jpg' }), {
        status: 200,
      })
    );
    const file = new File(['pet image'], 'pet.jpg', { type: 'image/jpeg' });

    await expect(uploadImageToCloudinary(file)).resolves.toBe(
      'https://res.cloudinary.com/test/pet.jpg'
    );

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.cloudinary.com/v1_1/test-cloud/image/upload');
    expect(options.method).toBe('POST');
    expect(options.body.get('file')).toBe(file);
    expect(options.body.get('upload_preset')).toBe('test-preset');
  });

  it('reports Cloudinary upload errors', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ error: { message: 'Upload preset is invalid' } }), {
        status: 400,
      })
    );

    await expect(
      uploadImageToCloudinary(new File(['pet image'], 'pet.jpg', { type: 'image/jpeg' }))
    ).rejects.toThrow('Upload preset is invalid');
  });

  it('rejects a response without a secure image URL', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ secure_url: 'http://example.com/pet.jpg' }), { status: 200 })
    );

    await expect(
      uploadImageToCloudinary(new File(['pet image'], 'pet.jpg', { type: 'image/jpeg' }))
    ).rejects.toThrow('Cloudinary returned an invalid upload response');
  });

  it('rejects uploads when Cloudinary configuration is missing', async () => {
    vi.stubEnv('NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET', '');

    await expect(
      uploadImageToCloudinary(new File(['pet image'], 'pet.jpg', { type: 'image/jpeg' }))
    ).rejects.toThrow('Image upload is not configured');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('validates image type and maximum file size', () => {
    expect(
      getImageFileError(new File(['document'], 'document.pdf', { type: 'application/pdf' }))
    ).toBe('Choose an image file');

    const oversizedImage = new File([new Uint8Array(MAX_IMAGE_UPLOAD_SIZE + 1)], 'large.jpg', {
      type: 'image/jpeg',
    });
    expect(getImageFileError(oversizedImage)).toBe('Image must be 10 MB or smaller');
  });
});
