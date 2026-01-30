import Container from "@/components/Container/Container";
import css from "./page.module.css";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <Container>
        <div className={css.notFound}>
          <div className={css.notFoundCont}>
            <p className={css.notFoundTitle}>4</p>

            <Image
              src="/not-found-cat.png"
              alt="cat"
              width={109}
              height={109}
              className={css.cat}
            ></Image>
            <p className={css.notFoundTitle}>4</p>
          </div>

          <div className={css.textContent}>
            <p className={css.text}>Ooops! This page not found :(</p>
            <Link href="/" className={css.btn}>
              To home page
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}
