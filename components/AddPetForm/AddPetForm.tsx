'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Title from '../Title/Title';
import css from './AddPetForm.module.css';
import Image from 'next/image';
import { addPet } from '@/lib/clientApi';
import toast from 'react-hot-toast';
import { PetFormValues, sexOptions, speciesOptions } from '@/types/pets';
import { Sex, Species } from '@/types/notices';

const schema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  name: Yup.string().required('Pet name is required'),
  imgURL: Yup.string()
    .matches(
      /^https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|webp)$/,
      'Image URL must be a valid link to an image'
    )
    .required('Image URL is required'),
  species: Yup.mixed<Species>().oneOf(speciesOptions).required('Species is required'),
  birthday: Yup.string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Birthday must be in format YYYY-MM-DD')
    .required('Birthday is required'),
  sex: Yup.mixed<Sex>().oneOf(sexOptions).required('Sex is required'),
});

export default function AddPetForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PetFormValues>({ resolver: yupResolver(schema) });

  const onSubmit = async (data: PetFormValues) => {
    try {
      await addPet(data);
      toast.success('Pet added successfully');
      router.push('/profile');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Something went wrong');
      }
    }
  };

  const handleBack = () => {
    router.push('/profile');
  };

  return (
    <div className={css.addPetForm}>
      <div className={css.title}>
        <Title text="Add my pet /" />
        <span className={css.spanPerson}> Personal details</span>
      </div>

      <form className={css.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={css.radioGroup}>
          <label className={css.radio}>
            <input type="radio" value="female" {...register('sex')} />
            <svg width="20" height="20">
              <use href="/symbol-defs.svg#icon-female" />
            </svg>
          </label>

          <label className={css.radio}>
            <input type="radio" value="male" {...register('sex')} />
            <svg width="20" height="20">
              <use href="/symbol-defs.svg#icon-male" />
            </svg>
          </label>

          <label className={css.radio}>
            <input type="radio" value="multiple" {...register('sex')} />
            <svg width="20" height="20">
              <use href="/symbol-defs.svg#icon-sexuale" />
            </svg>
          </label>
          {errors.sex && <p className={css.error}>{errors.sex.message}</p>}
        </div>
        <div>
          <div className={css.imageAvatar}>
            <Image
              src={'/addPet-default.png'}
              alt={'Pet avatar'}
              width={68}
              height={68}
              className={css.avatar}
            />
          </div>
          <label>
            <input type="text" {...register('imgURL')} placeholder="Enter URL" />
            {errors.imgURL && <p className={css.error}>{errors.imgURL.message}</p>}
          </label>

          <label>
            <input type="text" {...register('title')} placeholder="Title" />
            {errors.title && <p className={css.error}>{errors.title.message}</p>}
          </label>

          <label>
            <input type="text" {...register('name')} placeholder="Pet’s Name" />
            {errors.name && <p className={css.error}>{errors.name.message}</p>}
          </label>

          <label>
            <input type="date" {...register('birthday')} />
            {errors.birthday && <p className={css.error}>{errors.birthday.message}</p>}
          </label>

          <select {...register('species')}>
            <option value="">Type of pet</option>
            {speciesOptions.map((item) => (
              <option key={item} value={item}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </option>
            ))}
          </select>

          <div className={css.buttons}>
            <button type="button" className={css.back} onClick={handleBack}>
              Back
            </button>
            <button type="submit" className={css.submit}>
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
