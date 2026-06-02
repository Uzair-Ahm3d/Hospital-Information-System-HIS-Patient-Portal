import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import DoctorLayout from '@/components/layouts/doctor-layout';
import DoctorPrescriptionsClient from '@/components/doctor/prescriptions-client';

export default async function DoctorPrescriptionsPage() {
  const session = await getSession();
  
  if (!session || session.role !== 'doctor') {
    redirect('/login');
  }

  return (
    <DoctorLayout user={session}>
      <DoctorPrescriptionsClient />
    </DoctorLayout>
  );
}
