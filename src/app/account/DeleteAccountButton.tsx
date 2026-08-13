import React from 'react';
import { deleteCurrentUser } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function DeleteAccountButton() {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
    try {
      await deleteCurrentUser();
      toast.success('Account deleted successfully');
      router.push('/');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete account');
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
    >
      Delete Account
    </button>
  );
}
