import { useState } from 'react';
import css from './LogOutBtn.module.css';
import ModalApproveAction from '../ModalApproveAction/ModalApproveAction';
import toast from 'react-hot-toast';
import { signOut } from '@/lib/clientApi';

export default function LogOutBtn() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      toast((err as Error).message);
    } finally {
      localStorage.clear();
      window.location.href = '/';
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
