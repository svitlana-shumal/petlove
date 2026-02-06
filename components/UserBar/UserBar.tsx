import Image from 'next/image';
import Link from 'next/link';
import LogOutBtn from '../LogOutBtn/LogOutBtn';
import css from './UserBar.module.css';
import { User } from '@/types/users';

interface UserBarProp {
  user: User;
  onClose: () => void;
}

export default function UserBar({ user, onClose }: UserBarProp) {
  return (
    <div className={css.userBar}>
      <Link href="/profile" className={css.user} onClick={onClose}>
        <Image
          src={user?.avatar || '/user-default.png'}
          alt="avatar"
          width={40}
          height={40}
          className={css.avatar}
        />
        <span className={css.name}>{user.name}</span>
      </Link>
      <LogOutBtn />
    </div>
  );
}
