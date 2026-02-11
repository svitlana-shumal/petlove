'use client';

// import Container from '@/components/Container/Container';
import LogOutBtn from '@/components/LogOutBtn/LogOutBtn';
import UserBar from '@/components/UserBar/UserBar';
import css from './UserNav.module.css';
import { useAuthStore } from '@/lib/store/auth';
import { usePathname } from 'next/navigation';

interface UserNavProps {
  onClose: () => void;
}

export default function UserNav({ onClose }: UserNavProps) {
  const pathname = usePathname();
  const isHome = pathname === '/home';
  const { isAuthenticated, user } = useAuthStore();
  console.log(isAuthenticated, user);
  if (!isAuthenticated || !user) return null;

  return (
    <section className={isHome ? css.userNavHome : css.userNav}>
      {/* <Container> */}
      <UserBar user={user} onClose={onClose} />
      <LogOutBtn />
      {/* </Container> */}
    </section>
  );
}
