'use client';

import { useRouter } from 'next/navigation';
import css from './RegistrationForm.module.css';
import * as Yup from 'yup';
import { useForm, useWatch } from 'react-hook-form';
import { Register } from '@/types/users';
import { yupResolver } from '@hookform/resolvers/yup';
import { signUp } from '@/lib/clientApi';
import toast from 'react-hot-toast';
import { useState } from 'react';
import Title from '../Title/Title';
import Link from 'next/link';

const validationSchema = Yup.object().shape({
  name: Yup.string().trim().required('Name is a required field.'),
  email: Yup.string()
    .trim()
    .matches(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, 'Enter a valid Email')
    .required('Email is a required field.'),
  password: Yup.string()
    .trim()
    .min(7, 'Password must be at least 7 characters')
    .required('Password is a required field.'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Password must match')
    .required('Confirm password is a required field.'),
});

export default function RegistrationForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<Register>({ resolver: yupResolver(validationSchema) });

  const emailValue = useWatch({ control, name: 'email' });
  const passwordValue = useWatch({ control, name: 'password' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onSubmit = async (data: Register) => {
    try {
      const result = await signUp(data.name, data.email, data.password);
      if (result.token) {
        router.push('/profile');
      }
    } catch (error) {
      if (error instanceof Error) toast.error(error.message || 'Registration failed');
    }
  };

  return (
    <section className={css.registration}>
      <Title text="Registration" />
      <p className={css.text}>Thank you for your interest in our platform.</p>
      <form className={css.form} onSubmit={handleSubmit(onSubmit)}>
        <input type="text" placeholder="Name" {...register('name')} className={css.name}></input>
        {errors.name && <span className={css.error}>{errors.name.message}</span>}
        <div className={css.emailField}>
          <input
            type="email"
            placeholder="Email"
            {...register('email')}
            className={`${css.email} ${errors.email ? css.invalid : ''}`}
            aria-invalid={!!errors.email}
          ></input>
          {errors.email && emailValue && (
            <button
              type="button"
              onClick={() => setValue('email', '')}
              aria-label="Clear email"
              className={css.clearBtn}
            >
              <svg width="18" height="18">
                <use href="/symbol-defs.svg#icon-x" />
              </svg>
            </button>
          )}
        </div>
        {errors.email && <span className={css.error}>{errors.email.message}</span>}

        <div className={css.passwordField}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            {...register('password')}
            className={`
      ${css.password}
      ${errors.password ? css.invalid : ''}
      ${passwordValue && !errors.password ? css.valid : ''}
    `}
            aria-invalid={!!errors.password}
          ></input>
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label="Toggle password visibility"
            className={css.passwordEye}
          >
            <svg width="18" height="18">
              <use
                href={showPassword ? '/symbol-defs.svg#icon-eye' : '/symbol-defs.svg#icon-eye-off'}
              />
            </svg>
          </button>

          {/* success check */}
          {passwordValue && !errors.password && (
            <span className={css.successIcon} aria-hidden="true">
              <svg width="18" height="18">
                <use href="/symbol-defs.svg#icon-check" />
              </svg>
            </span>
          )}
        </div>
        {errors.password && <span className={css.error}>{errors.password.message}</span>}
        <div className={css.passwordField}>
          <input
            type={showConfirm ? 'text' : 'password'}
            placeholder="Confirm password"
            {...register('confirmPassword')}
            className={css.confirm}
          ></input>
          <button
            type="button"
            onClick={() => setShowConfirm((prev) => !prev)}
            aria-label="Toggle password visibility"
            className={css.passwordEye}
          >
            <svg width="18" height="18">
              <use
                href={showConfirm ? '/symbol-defs.svg#icon-eye' : '/symbol-defs.svg#icon-eye-off'}
              />
            </svg>
          </button>
        </div>
        {errors.confirmPassword && (
          <span className={css.error}>{errors.confirmPassword.message}</span>
        )}
        <button type="submit" className={css.btn}>
          Registration
        </button>
        <p className={css.desc}>
          Already have an account?
          <Link href="/login" className={css.login}>
            Login
          </Link>
        </p>
      </form>
    </section>
  );
}
