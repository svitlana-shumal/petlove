import Link from 'next/link';
import css from './AuthNav.module.css';

interface AuthNavProp {
  onClose: () => void;
}

export default function AuthNav({ onClose }: AuthNavProp) {
  return (
    <div className={css.auth}>
      <Link href="/login" className={css.login} onClick={onClose}>
        Log in
      </Link>
      <Link href="/register" className={css.register} onClick={onClose}>
        Registration
      </Link>
    </div>
  );
}
