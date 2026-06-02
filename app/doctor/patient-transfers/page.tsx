import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import DoctorLayout from '@/components/layouts/doctor-layout';
import DoctorPatientTransfersClient from '@/components/doctor/patient-transfers-client';

export default async function DoctorPatientTransfersPage() {
  const session = await getSession();
  
  if (!session || session.role !== 'doctor') {
    redirect('/login');
  }

  return (
    <DoctorLayout user={session}>
      <DoctorPatientTransfersClient />
    </DoctorLayout>
  );
}
