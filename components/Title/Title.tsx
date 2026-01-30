type TitleProps = { text: string };
import css from "./Title.module.css";

export default function Title({ text }: TitleProps) {
  return <h1 className={css.title}>{text}</h1>;
}
