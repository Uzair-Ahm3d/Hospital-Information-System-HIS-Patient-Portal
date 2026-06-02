import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import DoctorLayout from '@/components/layouts/doctor-layout';
import DoctorPatientsClient from '@/components/doctor/patients-client';

export default async function DoctorPatientsPage() {
  const session = await getSession();
  
  if (!session || session.role !== 'doctor') {
    redirect('/login');
  }

  return (
    <DoctorLayout user={session}>
      <DoctorPatientsClient />
    </DoctorLayout>
  );
}
