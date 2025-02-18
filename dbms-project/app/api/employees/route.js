import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import oracledb from 'oracledb';

export async function GET() {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT * FROM Employee ORDER BY LastName, FirstName`
    );
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
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
    const { FirstName, LastName, PhoneNumber, Email, Specialization, WorkStatus } = body;

    connection = await getConnection();
    const result = await connection.execute(
      `INSERT INTO Employee (
        FirstName, LastName, PhoneNumber, Email, Specialization, WorkStatus
      ) VALUES (
        :1, :2, :3, :4, :5, :6
      ) RETURNING Employee_ID INTO :7`,
      [
        FirstName, 
        LastName, 
        PhoneNumber, 
        Email, 
        Specialization, 
        WorkStatus,
        { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      ]
    );

    await connection.commit();
    return NextResponse.json({ 
      message: 'Employee created successfully',
      employeeId: result.outBinds[0]
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    return NextResponse.json({ error: 'Failed to create employee' }, { status: 500 });
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