// "use client";

// import { PawPrint } from "lucide-react";
// import css from "./page.module.css";

// export default function Loading() {
//   return (
//     <div className={css.loading}>
//       <PawPrint className={css.print} />
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import css from "./page.module.css";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 1 : 100));
    }, 40);

    return () => clearInterval(interval);
  }, []);

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
          /dog/dog-tablet1x.webp 2x"
          media="(min-width:768px)"
        />
        <source
          srcSet="/dog/dog-mobile1x.webp 1x,
          /dog/dog-mobile1x.webp 2x"
        />

        <img
          src="/dog/dog-tablet1x.webp"
          alt="Loading background"
          className={css.bg}
        />
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
