// EXAMPLE: Laboratory API with Normalization
// File: app/api/laboratory/route.ts (NORMALIZED VERSION)

import { NextResponse } from 'next/server';
import { query, execute } from '@/lib/db';
import { getSession } from '@/lib/auth';

// GET all laboratory records - Using VIEW for normalized data
export async function GET() {
  try {
    // OPTION 1: Use View (Recommended - easiest)
    const sql = `
      SELECT * FROM V_LABORATORY
      ORDER BY LAB_ID DESC
    `;
    
    /* OPTION 2: Direct JOIN (if you prefer explicit queries)
    const sql = `
      SELECT 
        l.LAB_ID,
        l.LAB_PAT_NUMBER,
        l.LAB_DOC_NUMBER,
        l.LAB_PAT_TESTS,
        l.LAB_PAT_RESULTS,
        l.LAB_NUMBER,
        l.LAB_STATUS,
        l.LAB_DATE_REC,
        l.LAB_COMPLETED_DATE,
        p.PAT_FNAME || ' ' || p.PAT_LNAME AS LAB_PAT_NAME,
        p.PAT_AILMENT AS LAB_PAT_AILMENT,
        p.PAT_EMAIL AS LAB_PAT_EMAIL,
        d.DOC_FNAME || ' ' || d.DOC_LNAME AS LAB_DOC_NAME
      FROM HIS_LABORATORY l
      LEFT JOIN HIS_PATIENTS p ON l.LAB_PAT_NUMBER = p.PAT_NUMBER
      LEFT JOIN HIS_DOCS d ON l.LAB_DOC_NUMBER = d.DOC_NUMBER
      ORDER BY l.LAB_ID DESC
    `;
    */
    
    const labs = await query(sql);
    
    // Handle both uppercase and lowercase from Oracle
    const transformed = labs.map((l: Record<string, unknown>) => ({
      LAB_ID: l.LAB_ID || l.lab_id,
      LAB_PAT_NAME: l.LAB_PAT_NAME || l.lab_pat_name, // From JOIN/View
      LAB_PAT_AILMENT: l.LAB_PAT_AILMENT || l.lab_pat_ailment, // From JOIN/View
      LAB_PAT_NUMBER: l.LAB_PAT_NUMBER || l.lab_pat_number,
      LAB_DOC_NUMBER: l.LAB_DOC_NUMBER || l.lab_doc_number,
      LAB_PAT_TESTS: l.LAB_PAT_TESTS || l.lab_pat_tests,
      LAB_PAT_RESULTS: l.LAB_PAT_RESULTS || l.lab_pat_results,
      LAB_NUMBER: l.LAB_NUMBER || l.lab_number,
      LAB_STATUS: l.LAB_STATUS || l.lab_status,
      LAB_DATE_REC: l.LAB_DATE_REC || l.lab_date_rec,
      LAB_COMPLETED_DATE: l.LAB_COMPLETED_DATE || l.lab_completed_date,
    }));
    
    return NextResponse.json(transformed);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// POST - Create new lab record (NORMALIZED - no redundant data)
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Generate unique lab number
    const numberSql = `SELECT 'LAB' || LPAD(NVL(MAX(TO_NUMBER(SUBSTR(LAB_NUMBER, 4))), 0) + 1, 4, '0') AS next_number FROM HIS_LABORATORY WHERE LAB_NUMBER LIKE 'LAB%'`;
    const numberResult = await query(numberSql);
    const labNumber = numberResult[0]?.NEXT_NUMBER || numberResult[0]?.next_number || 'LAB0001';
    
    // NORMALIZED: Only store PAT_NUMBER, not PAT_NAME or PAT_AILMENT
    // Those will be retrieved via JOIN when needed
    const sql = `
      INSERT INTO HIS_LABORATORY (
        LAB_PAT_NUMBER, LAB_DOC_NUMBER, LAB_PAT_TESTS, 
        LAB_PAT_RESULTS, LAB_NUMBER, LAB_STATUS
      ) VALUES (
        :1, :2, :3, :4, :5, :6
      )
    `;
    
    await execute(sql, [
      body.patientNumber,      // Only store FK, not name/ailment
      body.doctorNumber || null,
      body.tests,
      body.results || null,
      labNumber,
      body.status || 'Pending',
    ]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// PUT - Update lab record
export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // No need to update patient name/ailment - they come from JOIN
    const sql = `
      UPDATE HIS_LABORATORY SET
        LAB_PAT_TESTS = :1,
        LAB_PAT_RESULTS = :2,
        LAB_STATUS = :3,
        LAB_DOC_NUMBER = :4,
        LAB_COMPLETED_DATE = :5
      WHERE LAB_ID = :6
    `;
    
    await execute(sql, [
      body.tests,
      body.results,
      body.status || 'Pending',
      body.doctorNumber || null,
      body.completedDate ? new Date(body.completedDate) : null,
      body.id,
    ]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// DELETE
export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Lab ID required' }, { status: 400 });
    }
    
    await execute('DELETE FROM HIS_LABORATORY WHERE LAB_ID = :1', [id]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
