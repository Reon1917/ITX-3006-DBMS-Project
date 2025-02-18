import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET(request, { params }) {
  let connection;
  try {
    const { id } = params;
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT 
        a.*,
        c.FirstName as CustomerFirstName,
        c.LastName as CustomerLastName,
        e.FirstName as EmployeeFirstName,
        e.LastName as EmployeeLastName,
        s.ServiceName,
        s.Duration
       FROM Appointment a
       JOIN Customer c ON a.Customer_ID = c.Customer_ID
       JOIN Employee e ON a.Employee_ID = e.Employee_ID
       JOIN Service s ON a.Service_ID = s.Service_ID
       WHERE a.Appointment_ID = :1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return NextResponse.json({ error: 'Failed to fetch appointment' }, { status: 500 });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
}

export async function PUT(request, { params }) {
  let connection;
  try {
    const { id } = params;
    const body = await request.json();
    const { Status } = body;

    connection = await getConnection();
    const result = await connection.execute(
      `UPDATE Appointment 
       SET Status = :1
       WHERE Appointment_ID = :2`,
      [Status, id]
    );

    await connection.commit();

    if (result.rowsAffected === 0) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Appointment updated successfully' });
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
}

export async function DELETE(request, { params }) {
  let connection;
  try {
    const { id } = params;
    connection = await getConnection();
    const result = await connection.execute(
      `UPDATE Appointment 
       SET Status = 'Cancelled'
       WHERE Appointment_ID = :1`,
      [id]
    );

    await connection.commit();

    if (result.rowsAffected === 0) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    return NextResponse.json({ error: 'Failed to cancel appointment' }, { status: 500 });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
} 