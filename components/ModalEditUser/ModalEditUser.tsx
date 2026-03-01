'use client';

import Image from 'next/image';
import Container from '../Container/Container';
import css from './ModalEditUser.module.css';
import { useEffect } from 'react';
import * as Yup from 'yup';
import { useAuthStore } from '@/lib/store/auth';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import { currentEdit } from '@/lib/clientApi';
import { EditUser, User } from '@/types/users';

interface ModalEditUserProp {
  onClose: () => void;
}

// const validationSchema = Yup.object().shape({
//   name: Yup.string().trim().required('Name is required'),
//   email: Yup.string()
//     .trim()
//     .matches(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, 'Invalid email')
//     .required('Email is required'),
//   avatar: Yup.string()
//     .matches(/^https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|webp)$/, 'Invalid avatar URL')
//     .required('Avatar URL is required'),
//   phone: Yup.string()
//     .trim()
//     .matches(/^\+38\d{10}$/, 'Phone must be in format +38XXXXXXXXXX')
//     .required('Phone is required'),
// });

const validationSchema = Yup.object().shape({
  name: Yup.string().trim(),
  email: Yup.string()
    .trim()
    .matches(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, 'Invalid email'),
  avatar: Yup.string().matches(
    /^https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|webp)$/,
    'Invalid avatar URL'
  ),
  phone: Yup.string()
    .trim()
    .matches(/^\+38\d{10}$/, 'Phone must be in format +38XXXXXXXXXX'),
});

export default function ModalEditUser({ onClose }: ModalEditUserProp) {
  const { user, setUser } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      avatar: user?.avatar || '',
      phone: user?.phone || '',
    },
  });

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
      const updatedUser: User = await currentEdit(data);
      setUser(updatedUser);
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
                src={user?.avatar || '/user-default.png'}
                alt={user?.name || 'User avatar'}
                width={80}
                height={80}
                className={css.avatar}
              />
            </div>
            <div className={css.infoAvatar}>
              <input
                type="text"
                placeholder="Avatar URL"
                {...register('avatar')}
                className={css.avatarUrl}
              />
              <button type="button" className={css.uploadBtn}>
                Upload photo
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
              />

              {errors.name && <span className={css.error}>{errors.name.message}</span>}

              <input
                type="email"
                placeholder="Email"
                {...register('email')}
                className={css.email}
                aria-label="Email user"
              ></input>

              {errors.email && <span className={css.error}>{errors.email.message}</span>}

              <input
                type="tel"
                placeholder="Phone"
                {...register('phone')}
                className={css.phone}
                aria-label="Phone user"
              ></input>
              {errors.phone && <span className={css.error}>{errors.phone.message}</span>}
            </div>
            <button type="submit" className={css.btn}>
              Save
            </button>
          </form>
        </div>
      </div>
    </Container>
  );
}
