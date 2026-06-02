import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminLayout from '@/components/layouts/admin-layout';
import PharmaceuticalsClient from '@/components/admin/pharmaceuticals-client';

export default async function PharmaceuticalsPage() {
  const session = await getSession();
  
  if (!session || session.role !== 'admin') {
    redirect('/unauthorized');
  }

  return (
    <AdminLayout user={session}>
      <PharmaceuticalsClient />
    </AdminLayout>
  );
}
