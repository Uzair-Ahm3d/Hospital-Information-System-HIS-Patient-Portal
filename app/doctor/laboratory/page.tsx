import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import DoctorLayout from '@/components/layouts/doctor-layout';
import DoctorLaboratoryClient from '@/components/doctor/laboratory-client';

export default async function DoctorLaboratoryPage() {
  const session = await getSession();
  
  if (!session || session.role !== 'doctor') {
    redirect('/login');
  }

  return (
    <DoctorLayout user={session}>
      <DoctorLaboratoryClient />
    </DoctorLayout>
  );
}
