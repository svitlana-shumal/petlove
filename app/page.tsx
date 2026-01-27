import Container from "@/components/Container/page";
import css from "./page.module.css";

export default function Home() {
  return (
    <main>
      <Container>
        <div className={css.pageCont}>
          <h1 className={css.title}>
            Take good <span className={css.spanCare}>care </span>of your small
            pets
          </h1>
          <p className={css.desc}>
            Choosing a pet for your home is a choice that is meant to enrich
            your life with immeasurable joy and tenderness.
          </p>
        </div>
        <picture className={css.photo}>
          <source
            srcSet="/desktop1x.webp 1x,
          /desktop1x.webp 2x"
            media="(min-width:1280px)"
          />
          <source
            srcSet="/tablet1x.webp 1x,
          /tablet1x.webp 2x"
            media="(min-width:768px)"
          />
          <source
            srcSet="/mobile1x.webp 1x,
          /mobile1x.webp 2x"
          />
          <img
            src="/tablet1x.webp"
            alt="Woman and a dog"
            className={css.mainPhoto}
          />
        </picture>
      </Container>
    </main>
  );
}
