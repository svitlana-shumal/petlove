'use client';

import Image from 'next/image';
import Container from '../Container/Container';
import css from './ModalEditUser.module.css';
import { useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import { useAuthStore } from '@/lib/store/auth';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import { currentEdit } from '@/lib/clientApi';
import { EditUser } from '@/types/users';

interface ModalEditUserProp {
  onClose: () => void;
}
const validationSchema = Yup.object().shape({
  name: Yup.string().trim().defined(),
  email: Yup.string()
    .trim()
    .matches(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, {
      message: 'Invalid email',
      excludeEmptyString: true,
    })
    .defined(),
  avatar: Yup.string()
    .trim()
    .test('http-url', 'Invalid avatar URL', (value) => {
      if (!value) return true;
      try {
        const url = new URL(value);
        return (url.protocol === 'http:' || url.protocol === 'https:') && !!url.hostname;
      } catch {
        return false;
      }
    })
    .defined(),
  phone: Yup.string()
    .trim()
    .matches(/^\+38\d{10}$/, {
      message: 'Phone must be in format +38XXXXXXXXXX',
      excludeEmptyString: true,
    })
    .defined(),
});

type EditUserFormValues = {
  name: string;
  email: string;
  avatar: string;
  phone: string;
};

export default function ModalEditUser({ onClose }: ModalEditUserProp) {
  const { user, updateUser } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '/user-default.png');
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<EditUserFormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      avatar: user?.avatar || '',
      phone: user?.phone || '',
    },
  });
  const enteredAvatarUrl = useWatch({ control, name: 'avatar' })?.trim();

  useEffect(() => {
    if (!enteredAvatarUrl) {
      setAvatarPreview(user?.avatar || '/user-default.png');
      return;
    }

    try {
      const url = new URL(enteredAvatarUrl);
      if ((url.protocol === 'http:' || url.protocol === 'https:') && url.hostname) {
        setAvatarPreview(enteredAvatarUrl);
      }
    } catch {}
  }, [enteredAvatarUrl, user?.avatar]);

  useEffect(() => {
    if (!avatarPreview.startsWith('blob:')) return;
    return () => URL.revokeObjectURL(avatarPreview);
  }, [avatarPreview]);

  const handleAvatarFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Choose an image file');
      input.value = '';
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be 10 MB or smaller');
      input.value = '';
      return;
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) {
      toast.error('Avatar upload is not configured');
      input.value = '';
      return;
    }

    const previousPreview = avatarPreview;
    setAvatarPreview(URL.createObjectURL(file));
    setIsUploading(true);
    const toastId = toast.loading('Uploading photo...');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
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
            : `Photo upload failed (${response.status})`;
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

      setValue('avatar', result.secure_url, { shouldDirty: true, shouldValidate: true });
      setAvatarPreview(result.secure_url);
      toast.success('Photo uploaded', { id: toastId });
    } catch (error) {
      setAvatarPreview(previousPreview);
      toast.error(error instanceof Error ? error.message : 'Photo upload failed', { id: toastId });
    } finally {
      setIsUploading(false);
      input.value = '';
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const onSubmit = async (data: EditUser) => {
    try {
      const payload = { ...data };
      if (payload.avatar?.trim()) {
        payload.avatar = payload.avatar.trim();
      } else {
        delete payload.avatar;
      }

      const updatedUser = await currentEdit(payload);
      if (user) updateUser({ ...user, ...updatedUser });
      toast.success('Profile updated successfully');
      onClose();
    } catch (error) {
      if (error instanceof Error) toast.error(error.message || 'Update failed');
    }
  };

  return (
    <Container>
      <div className={css.backdrop} onClick={handleBackdropClick} role="dialog" aria-modal="true">
        <div className={css.modal}>
          <button className={css.close} onClick={onClose} aria-label="Close modal">
            <svg width={24} height={24}>
              <use href={'/symbol-defs.svg#icon-x'} />
            </svg>
          </button>
          <h3 className={css.title}>Edit information</h3>

          <form onSubmit={handleSubmit(onSubmit)} className={css.form}>
            <div className={css.imageAvatar}>
              <Image
                src={avatarPreview}
                alt={user?.name || 'User avatar'}
                width={80}
                height={80}
                className={css.avatar}
                unoptimized
              />
            </div>
            <div className={css.infoAvatar}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className={css.fileInput}
                aria-label="Choose avatar image"
                onChange={handleAvatarFileChange}
              />
              <input
                type="text"
                placeholder="Avatar URL"
                {...register('avatar')}
                className={css.avatarUrl}
                aria-label="Avatar URL"
                aria-invalid={!!errors.avatar}
              />
              <button
                type="button"
                className={css.uploadBtn}
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
              >
                {isUploading ? 'Uploading...' : 'Upload photo'}
                <svg
                  width={16}
                  height={16}
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.25}
                  aria-hidden="true"
                >
                  <path d="M4.5 11.25H3.75a2.25 2.25 0 0 1-.34-4.47A4.75 4.75 0 0 1 12.6 6a2.65 2.65 0 0 1-.35 5.25h-.75" />
                  <path d="M8 13.25V7.5m0 0L5.75 9.75M8 7.5l2.25 2.25" />
                </svg>
              </button>
            </div>
            {errors.avatar && <span className={css.error}>{errors.avatar.message}</span>}

            <div className={css.infoField}>
              <input
                type="text"
                placeholder="Name"
                className={css.name}
                {...register('name')}
                aria-label="Name user"
                aria-invalid={!!errors.name}
              />

              {errors.name && <span className={css.error}>{errors.name.message}</span>}

              <input
                type="email"
                placeholder="Email"
                {...register('email')}
                className={css.email}
                aria-label="Email user"
                aria-invalid={!!errors.email}
              ></input>

              {errors.email && <span className={css.error}>{errors.email.message}</span>}

              <input
                type="tel"
                placeholder="Phone"
                {...register('phone')}
                className={css.phone}
                aria-label="Phone user"
                aria-invalid={!!errors.phone}
              ></input>
              {errors.phone && <span className={css.error}>{errors.phone.message}</span>}
            </div>
            <button type="submit" className={css.btn} disabled={isUploading}>
              Save
            </button>
          </form>
        </div>
      </div>
    </Container>
  );
}
