'use client';

import { useState } from 'react';
import css from './LogOutBtn.module.css';
import ModalApproveAction from '../ModalApproveAction/ModalApproveAction';
import toast from 'react-hot-toast';
import { signOut } from '@/lib/clientApi';
import { useAuthStore } from '@/lib/store/auth';

export default function LogOutBtn() {
  const { clearIsAuthenticated } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('You have logged out successfully');
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      clearIsAuthenticated();
      localStorage.clear();
      window.location.href = '/home';
    }
  };
  return (
    <>
      <button className={css.logout} onClick={() => setIsModalOpen(true)}>
        Log out
      </button>

      {isModalOpen && (
        <ModalApproveAction onConfirm={handleLogout} onCancel={() => setIsModalOpen(false)} />
      )}
    </>
  );
}
