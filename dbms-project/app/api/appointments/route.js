import { NextResponse } from 'next/server';
import { execute } from '@/lib/db';

// GET /api/appointments
export async function GET() {
  try {
    const result = await execute(
      `SELECT 
         a.Appointment_ID,
         a.Customer_ID,
         a.Service_ID,
         a.Employee_ID,
         a.Appointment_Date,
         a.Status,
         s.ServiceName,
         e.FirstName as EmployeeFirstName,
         e.LastName as EmployeeLastName
       FROM Appointment a
       JOIN Service s ON a.Service_ID = s.Service_ID
       JOIN Employee e ON a.Employee_ID = e.Employee_ID
       ORDER BY a.Appointment_Date DESC`,
      []
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

// POST /api/appointments
export async function POST(request) {
  try {
    const body = await request.json();
    const { Customer_ID, Service_ID, Employee_ID, Appointment_Date } = body;

    // First check if the time slot is available
    const checkResult = await execute(
      `SELECT COUNT(*) as count 
       FROM Appointment 
       WHERE Employee_ID = :1 
       AND Appointment_Date = :2
       AND Status != 'CANCELLED'`,
      [Employee_ID, Appointment_Date]
    );

    if (checkResult.rows[0].COUNT > 0) {
      return NextResponse.json(
        { error: 'Time slot not available' },
        { status: 400 }
      );
    }

    const result = await execute(
      `INSERT INTO Appointment (
         Appointment_ID, 
         Customer_ID, 
         Service_ID, 
         Employee_ID, 
         Appointment_Date, 
         Status
       ) VALUES (
         Appointment_Seq.NEXTVAL, 
         :1, :2, :3, :4, 'SCHEDULED'
       ) RETURNING Appointment_ID INTO :5`,
      [Customer_ID, Service_ID, Employee_ID, Appointment_Date, { dir: oracledb.BIND_OUT }]
    );

    return NextResponse.json({
      message: 'Appointment created successfully',
      Appointment_ID: result.outBinds[0][0]
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
} 