'use client';

import { useRouter } from 'next/navigation';
import css from './LoginForm.module.css';
import * as Yup from 'yup';
import { useForm, useWatch } from 'react-hook-form';
import { LoginValue } from '@/types/users';
import { yupResolver } from '@hookform/resolvers/yup';
import { signIn } from '@/lib/clientApi';
import toast from 'react-hot-toast';
import { useState } from 'react';
import Title from '../Title/Title';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/auth';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .matches(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, 'Enter a valid Email')
    .required('Email is a required field.'),
  password: Yup.string()
    .trim()
    .min(7, 'Password must be at least 7 characters')
    .required('Password is a required field.'),
});

export default function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<LoginValue>({ resolver: yupResolver(validationSchema) });

  const emailValue = useWatch({ control, name: 'email' });
  const passwordValue = useWatch({ control, name: 'password' });
  const [showPassword, setShowPassword] = useState(false);

  const { setUser } = useAuthStore();

  const onSubmit = async (data: LoginValue) => {
    try {
      const result = await signIn(data);
      if (result.token) {
        toast.success('Login successful 🎉');
        setUser({ _id: result.email, name: result.name, email: result.email, avatar: null });
        router.push('/profile');
      }
    } catch (error) {
      if (error instanceof Error) toast.error(error.message || 'Login failed');
    }
  };

  return (
    <div className={css.loginForm}>
      <Title text="Log in" />
      <p className={css.text}>Welcome! Please enter your credentials to login to the platform:</p>
      <form className={css.form} noValidate onSubmit={handleSubmit(onSubmit)}>
        <div className={css.emailField}>
          <input
            type="email"
            placeholder="Email"
            {...register('email')}
            //   className={`${css.email}
            //   ${errors.email ? css.error : ''}
            //   ${!errors.email && emailValue ? css.valid : ''}
            // `}
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

        <button type="submit" className={css.btn}>
          Log in
        </button>
        <p className={css.desc}>
          Don’t have an account?
          <Link href="/register" className={css.login}>
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
