import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { execute } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || session.role !== 'patient' || !session.patientNumber) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { password, patientNumber } = await request.json();

    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    if (patientNumber !== session.patientNumber) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Update password in database (plain text for class project)
    // In production, use bcrypt to hash the password
    const result = await execute(
      `UPDATE HIS_PATIENTS 
       SET PAT_PWD = :1, UPDATED_AT = SYSTIMESTAMP 
       WHERE PAT_NUMBER = :2`,
      [password, patientNumber]
    );

    if (result && result.rowsAffected && result.rowsAffected > 0) {
      return NextResponse.json({ success: true, message: 'Password updated successfully' });
    } else {
      return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
    }
  } catch (error) {
    console.error('Password update error:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating password' },
      { status: 500 }
    );
  }
}
