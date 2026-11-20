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
          <picture className={css.heroPicture}>
            <source
              srcSet="/desktop1x.webp 1x, /desktop2x.webp 2x"
              media="(min-width: 1280px)"
            />
            <source
              srcSet="/tablet1x.webp 1x, /tablet2x.webp 2x"
              media="(min-width: 768px)"
            />
            <source srcSet="/mobile1x.webp 1x, /mobile2x.webp 2x" />
            <Image
              src="/mobile1x.webp"
              fill
              priority
              sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1279px) calc(100vw - 64px), 1152px"
              alt="Woman and a dog"
              className={css.mainPhoto}
            />
          </picture>
        </div>
      </Container>
    </section>
  );
}
