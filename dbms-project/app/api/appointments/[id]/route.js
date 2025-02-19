import { NextResponse } from 'next/server';
import { execute } from '@/lib/db';

// GET /api/appointments/[id]
export async function GET(request, { params }) {
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
       WHERE a.Appointment_ID = :1`,
      [params.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointment' },
      { status: 500 }
    );
  }
}

// PUT /api/appointments/[id]
export async function PUT(request, { params }) {
  try {
    const body = await request.json();
    const { Status } = body;

    const result = await execute(
      `UPDATE Appointment 
       SET Status = :1
       WHERE Appointment_ID = :2`,
      [Status, params.id]
    );

    if (result.rowsAffected === 0) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Appointment updated successfully' 
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    );
  }
}

// DELETE /api/appointments/[id]
export async function DELETE(request, { params }) {
  try {
    const result = await execute(
      `UPDATE Appointment 
       SET Status = 'CANCELLED'
       WHERE Appointment_ID = :1`,
      [params.id]
    );

    if (result.rowsAffected === 0) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Appointment cancelled successfully' 
    });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    return NextResponse.json(
      { error: 'Failed to cancel appointment' },
      { status: 500 }
    );
  }
} 