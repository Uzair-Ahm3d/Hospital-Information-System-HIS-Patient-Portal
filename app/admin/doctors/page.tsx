import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminLayout from '@/components/layouts/admin-layout';
import DoctorsClient from '@/components/admin/doctors-client';

export default async function DoctorsPage() {
  const session = await getSession();
  
  if (!session || session.role !== 'admin') {
    redirect('/login');
  }

  return (
    <AdminLayout user={session}>
      <DoctorsClient />
    </AdminLayout>
  );
}
