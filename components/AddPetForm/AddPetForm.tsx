'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Title from '../Title/Title';
import css from './AddPetForm.module.css';
import Image from 'next/image';
import { addPet } from '@/lib/clientApi';
import { useAuthStore } from '@/lib/store/auth';
import toast from 'react-hot-toast';
import { getImageFileError, uploadImageToCloudinary } from '@/lib/cloudinary';
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
  const refreshUser = useAuthStore((state) => state.refreshUser);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<PetFormValues>({ resolver: yupResolver(schema) });
  const enteredImageUrl = useWatch({ control, name: 'imgURL' })?.trim();
  const isImageUrlValid = enteredImageUrl
    ? /^https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|webp)$/i.test(enteredImageUrl)
    : false;
  const imagePreview = localPreview || (isImageUrlValid ? enteredImageUrl : '/addPet-default.png');

  useEffect(() => {
    if (!localPreview) return;
    return () => URL.revokeObjectURL(localPreview);
  }, [localPreview]);

  const handleImageFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;

    const fileError = getImageFileError(file);
    if (fileError) {
      toast.error(fileError);
      input.value = '';
      return;
    }

    setLocalPreview(URL.createObjectURL(file));
    setIsUploading(true);
    const toastId = toast.loading('Uploading photo...');

    try {
      const uploadedUrl = await uploadImageToCloudinary(file);
      setValue('imgURL', uploadedUrl, { shouldDirty: true, shouldValidate: true });
      setLocalPreview(null);
      toast.success('Photo uploaded', { id: toastId });
    } catch (error) {
      setLocalPreview(null);
      toast.error(error instanceof Error ? error.message : 'Photo upload failed', { id: toastId });
    } finally {
      setIsUploading(false);
      input.value = '';
    }
  };

  const onSubmit = async (data: PetFormValues) => {
    if (isUploading) return;

    try {
      await addPet(data);
      try {
        await refreshUser();
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to refresh your profile.';
        toast.error(`Pet was added, but profile refresh failed: ${message}`);
      }
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
            <input type="radio" value="female" aria-label="Female" {...register('sex')} />
            <svg width="20" height="20">
              <use href="/symbol-defs.svg#icon-female" />
            </svg>
          </label>

          <label className={css.radio}>
            <input type="radio" value="male" aria-label="Male" {...register('sex')} />
            <svg width="20" height="20">
              <use href="/symbol-defs.svg#icon-male" />
            </svg>
          </label>

          <label className={css.radio}>
            <input type="radio" value="multiple" aria-label="Multiple" {...register('sex')} />
            <svg width="20" height="20">
              <use href="/symbol-defs.svg#icon-sexuale" />
            </svg>
          </label>
          {errors.sex && <p className={css.error}>{errors.sex.message}</p>}
        </div>
        <div className={css.fields}>
          <div className={css.imageAvatar}>
            <Image
              src={imagePreview}
              alt="Pet photo preview"
              width={68}
              height={68}
              className={css.avatar}
              unoptimized
            />
          </div>
          <div className={css.imageField}>
            <div className={css.imageUrlRow}>
              <input
                className={css.input}
                type="text"
                {...register('imgURL')}
                placeholder="Enter URL"
                aria-label="Pet photo URL"
                disabled={isUploading}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className={css.fileInput}
                aria-label="Choose pet photo"
                onChange={handleImageFileChange}
              />
              <button
                type="button"
                className={css.uploadBtn}
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
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
            {errors.imgURL && <p className={css.error}>{errors.imgURL.message}</p>}
          </div>

          <label className={css.field}>
            <input className={css.input} type="text" {...register('title')} placeholder="Title" />
            {errors.title && <p className={css.error}>{errors.title.message}</p>}
          </label>

          <label className={css.field}>
            <input
              className={css.input}
              type="text"
              {...register('name')}
              placeholder="Pet’s Name"
            />
            {errors.name && <p className={css.error}>{errors.name.message}</p>}
          </label>

          <div className={css.fieldRow}>
            <label className={css.field}>
              <input
                className={css.input}
                type="date"
                {...register('birthday')}
                aria-label="Pet's birthday"
              />
              {errors.birthday && <p className={css.error}>{errors.birthday.message}</p>}
            </label>

            <label className={`${css.field} ${css.speciesField}`}>
              <select className={`${css.input} ${css.species}`} {...register('species')}>
                <option value="">Type of pet</option>
                {speciesOptions.map((item) => (
                  <option key={item} value={item}>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </option>
                ))}
              </select>
              {errors.species && <p className={css.error}>{errors.species.message}</p>}
            </label>
          </div>

          <div className={css.buttons}>
            <button type="button" className={css.back} onClick={handleBack}>
              Back
            </button>
            <button type="submit" className={css.submit} disabled={isUploading}>
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
