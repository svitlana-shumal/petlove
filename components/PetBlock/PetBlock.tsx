'use client';

import Image from 'next/image';
import css from './PetBlock.module.css';

interface PetBlockProp {
  images: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
  alt: string;
  className?: string;
}

export default function PetBlock({ images, alt, className }: PetBlockProp) {
  return (
    <div className={`${css.petBlock} ${className || ''}`}>
      <picture className={css.picture}>
        <source srcSet={images.desktop} media="(min-width: 1280px)" />
        <source srcSet={images.tablet} media="(min-width:768px)" />
        <Image src={images.mobile} alt={alt} fill className={css.image} priority />
      </picture>
    </div>
  );
}
