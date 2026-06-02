import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import DoctorLayout from '@/components/layouts/doctor-layout';
import DoctorSurgeriesClient from '@/components/doctor/surgeries-client';

export default async function DoctorSurgeriesPage() {
  const session = await getSession();
  
  if (!session || session.role !== 'doctor') {
    redirect('/login');
  }

  return (
    <DoctorLayout user={session}>
      <DoctorSurgeriesClient />
    </DoctorLayout>
  );
}
