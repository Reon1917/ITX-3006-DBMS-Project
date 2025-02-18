import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const connection = await getConnection();
    const result = await connection.execute(
      `SELECT s.*, 
        (SELECT COUNT(*) FROM Employee e 
         WHERE e.Specialization = s.Category 
         AND e.WorkStatus = 'Active') as AvailableEmployees
       FROM Service s
       WHERE s.Service_ID = :1`,
      [id]
    );
    
    await connection.close();

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json({ error: 'Failed to fetch service' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { ServiceName, Description, Price, Duration, Category, RequiredEmployees } = body;

    const connection = await getConnection();
    const result = await connection.execute(
      `UPDATE Service 
       SET ServiceName = :1,
           Description = :2,
           Price = :3,
           Duration = :4,
           Category = :5
       WHERE Service_ID = :6`,
      [ServiceName, Description, Price, Duration, Category, id]
    );

    await connection.commit();
    await connection.close();

    if (result.rowsAffected === 0) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Service updated successfully' });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const connection = await getConnection();
    const result = await connection.execute(
      'DELETE FROM Service WHERE Service_ID = :1',
      [id]
    );

    await connection.commit();
    await connection.close();

    if (result.rowsAffected === 0) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
} 