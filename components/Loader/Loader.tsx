'use client';

import { useState, useEffect } from 'react';
import css from './Loader.module.css';

interface LoaderProps {
  variant?: 'fullscreen' | 'inline';
}

export default function Loader({ variant = 'fullscreen' }: LoaderProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (variant === 'inline') return;

    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 1 : 100));
    }, 40);

    return () => clearInterval(interval);
  }, [variant]);

  if (variant === 'inline') {
    return (
      <div className={css.inline} role="status" aria-label="Loading">
        <span className={css.spinner} aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className={css.wrapper}>
      <picture className={css.dogPhoto}>
        <source
          srcSet="/dog/dog-desktop1x.webp 1x,
          /dog/dog-desktop2x.webp 2x"
          media="(min-width:1280px)"
        />
        <source
          srcSet="/dog/dog-tablet1x.webp 1x,
          /dog/dog-tablet2x.webp 2x"
          media="(min-width:768px)"
        />
        <source
          srcSet="/dog/dog-mobile1x.webp 1x,
          /dog/dog-mobile2x.webp 2x"
        />

        <img src="/dog/dog-tablet1x.webp" alt="Loading background" className={css.bg} />
      </picture>
      <div className={css.overlay}>
        {progress < 100 ? (
          <p className={css.percent}>{progress}%</p>
        ) : (
          <h1 className={css.logo}>pet💛ve</h1>
        )}
      </div>
    </div>
  );
}
