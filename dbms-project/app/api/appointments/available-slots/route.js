import { NextResponse } from 'next/server';
import { execute } from '@/lib/db';

// GET /api/appointments/available-slots
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const employeeId = searchParams.get('employeeId');

    if (!date || !employeeId) {
      return NextResponse.json(
        { error: 'Date and employeeId are required' },
        { status: 400 }
      );
    }

    const result = await execute(
      `SELECT 
         TO_CHAR(slot_time, 'HH24:MI') as time_slot,
         CASE 
           WHEN EXISTS (
             SELECT 1 
             FROM Appointment 
             WHERE Employee_ID = :1
             AND TRUNC(Appointment_Date) = TO_DATE(:2, 'YYYY-MM-DD')
             AND TO_CHAR(Appointment_Date, 'HH24:MI') = TO_CHAR(slot_time, 'HH24:MI')
             AND Status != 'CANCELLED'
           ) THEN 0
           ELSE 1
         END as is_available
       FROM (
         SELECT TO_DATE(:2, 'YYYY-MM-DD') + NUMTODSINTERVAL(level-1, 'HOUR') as slot_time
         FROM dual
         CONNECT BY level <= 8
         START WITH 1 = 1
       ) slots
       WHERE TO_CHAR(slot_time, 'HH24:MI') BETWEEN '09:00' AND '17:00'
       ORDER BY slot_time`,
      [employeeId, date]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching available slots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch available slots' },
      { status: 500 }
    );
  }
} 