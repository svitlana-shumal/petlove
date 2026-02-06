'use client';

import { useRouter } from 'next/navigation';
import css from './LoginForm.module.css';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { LoginValue } from '@/types/users';
import { yupResolver } from '@hookform/resolvers/yup';
import { signIn } from '@/lib/clientApi';
import toast from 'react-hot-toast';
import { useState } from 'react';
import Title from '../Title/Title';
import Link from 'next/link';

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
    formState: { errors },
  } = useForm<LoginValue>({ resolver: yupResolver(validationSchema) });

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: LoginValue) => {
    try {
      const result = await signIn(data.email, data.password);
      if (result.token) {
        router.push('/profile');
      }
    } catch (error) {
      if (error instanceof Error) toast(error.message || 'Login failed');
    }
  };

  return (
    <div className={css.loginForm}>
      <Title text="Log in" />
      <p className={css.text}>Welcome! Please enter your credentials to login to the platform:</p>
      <form className={css.form} onSubmit={handleSubmit(onSubmit)}>
        <input
          type="email"
          placeholder="Email"
          {...register('email')}
          className={css.email}
        ></input>
        {errors.email && <span className={css.error}>{errors.email.message}</span>}
        <div className={css.passwordField}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            {...register('password')}
            className={css.password}
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
        </div>
        {errors.password && <span className={css.error}>{errors.password.message}</span>}

        <button type="submit" className={css.btn}>
          Log in
        </button>
        <p className={css.desc}>
          Don`t have an account?{' '}
          <Link href="/register" className={css.login}>
            {' '}
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
