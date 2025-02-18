import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET(request, { params }) {
  let connection;
  try {
    const { id } = params;
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT * FROM Employee WHERE Employee_ID = :1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching employee:', error);
    return NextResponse.json({ error: 'Failed to fetch employee' }, { status: 500 });
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
    const updates = [];
    const values = [];
    let counter = 1;

    Object.entries(body).forEach(([key, value]) => {
      if (value !== undefined) {
        updates.push(`${key} = :${counter}`);
        values.push(value);
        counter++;
      }
    });

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    values.push(id);

    connection = await getConnection();
    const result = await connection.execute(
      `UPDATE Employee 
       SET ${updates.join(', ')}
       WHERE Employee_ID = :${counter}`,
      values
    );

    await connection.commit();

    if (result.rowsAffected === 0) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Employee updated successfully' });
  } catch (error) {
    console.error('Error updating employee:', error);
    return NextResponse.json({ error: 'Failed to update employee' }, { status: 500 });
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
      'DELETE FROM Employee WHERE Employee_ID = :1',
      [id]
    );

    await connection.commit();

    if (result.rowsAffected === 0) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    return NextResponse.json({ error: 'Failed to delete employee' }, { status: 500 });
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