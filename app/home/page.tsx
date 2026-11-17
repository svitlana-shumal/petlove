'use client';

import Container from '@/components/Container/Container';
import css from './Home.module.css';
import Image from 'next/image';

export default function Home() {
  return (
    <section className={css.hero}>
      <div className={css.heroBg} />
      <Container className={css.containerHero}>
        <div className={css.pageCont}>
          <h1 className={css.title}>
            Take good <span className={css.spanCare}>care </span>of your small pets
          </h1>
          <p className={css.desc}>
            Choosing a pet for your home is a choice that is meant to enrich your life with
            immeasurable joy and tenderness.
          </p>
        </div>

        <div className={css.heroImgContainer}>
          <Image
            src="/tablet1x.webp"
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 600px"
            alt="Woman and a dog"
            className={css.mainPhoto}
          />
        </div>
      </Container>
    </section>
  );
}
