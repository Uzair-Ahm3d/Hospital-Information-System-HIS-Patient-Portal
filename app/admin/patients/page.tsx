import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminLayout from '@/components/layouts/admin-layout';
import PatientsClient from '@/components/admin/patients-client';

export default async function PatientsPage() {
  const session = await getSession();
  
  if (!session || session.role !== 'admin') {
    redirect('/login');
  }

  return (
    <AdminLayout user={session}>
      <PatientsClient />
    </AdminLayout>
  );
}
