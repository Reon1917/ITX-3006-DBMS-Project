import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import oracledb from 'oracledb';

export async function GET() {
  let connection;
  try {
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
       ORDER BY a.AppointmentDate DESC, a.StartTime DESC`
    );
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
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

export async function POST(request) {
  let connection;
  try {
    const body = await request.json();
    const { Customer_ID, Employee_ID, Service_ID, AppointmentDate, StartTime, EndTime } = body;

    // Validate employee availability
    connection = await getConnection();
    const availabilityCheck = await connection.execute(
      `SELECT COUNT(*) as conflict_count
       FROM Appointment
       WHERE Employee_ID = :1
       AND AppointmentDate = :2
       AND Status != 'Cancelled'
       AND (
         (StartTime BETWEEN :3 AND :4)
         OR (EndTime BETWEEN :3 AND :4)
         OR (:3 BETWEEN StartTime AND EndTime)
       )`,
      [Employee_ID, AppointmentDate, StartTime, EndTime]
    );

    if (availabilityCheck.rows[0].CONFLICT_COUNT > 0) {
      return NextResponse.json(
        { error: 'Employee is not available at the selected time' },
        { status: 400 }
      );
    }

    const result = await connection.execute(
      `INSERT INTO Appointment (
        Customer_ID, Employee_ID, Service_ID, 
        AppointmentDate, StartTime, EndTime, Status
      ) VALUES (
        :1, :2, :3, :4, :5, :6, 'Pending'
      ) RETURNING Appointment_ID INTO :7`,
      [
        Customer_ID,
        Employee_ID,
        Service_ID,
        AppointmentDate,
        StartTime,
        EndTime,
        { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      ]
    );

    await connection.commit();
    return NextResponse.json({ 
      message: 'Appointment created successfully',
      appointmentId: result.outBinds[0]
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
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