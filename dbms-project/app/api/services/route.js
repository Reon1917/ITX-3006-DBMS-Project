import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import oracledb from 'oracledb';

// GET /api/services - Get all services
export async function GET() {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT s.*, 
        (SELECT COUNT(*) FROM Employee e 
         WHERE e.Specialization = s.Category 
         AND e.WorkStatus = 'Active') as AvailableEmployees
       FROM Service s`
    );
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
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

// POST /api/services - Create a new service
export async function POST(request) {
  let connection;
  try {
    const body = await request.json();
    const { ServiceName, Description, Price, Duration, Category, RequiredEmployees } = body;

    connection = await getConnection();
    const result = await connection.execute(
      `INSERT INTO Service (
        ServiceName, Description, Price, Duration, Category
      ) VALUES (
        :1, :2, :3, :4, :5
      ) RETURNING Service_ID INTO :6`,
      [ServiceName, Description, Price, Duration, Category, { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }]
    );

    await connection.commit();
    return NextResponse.json({ 
      message: 'Service created successfully',
      serviceId: result.outBinds[0]
    });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
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

// PUT /api/services/:id - Update a service
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const { serviceName, description, price, duration, category } = await req.json();

    const connection = await getConnection();
    const result = await connection.execute(
      `UPDATE Service 
       SET ServiceName = :1, 
           Description = :2, 
           Price = :3, 
           Duration = :4, 
           Category = :5
       WHERE Service_ID = :6`,
      [serviceName, description, price, duration, category, id]
    );

    if (result.rowsAffected === 0) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    await connection.commit();
    await connection.close();

    return NextResponse.json({ message: 'Service updated successfully' });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/services/:id - Delete a service
export async function DELETE(request) {
  let connection;
  try {
    const url = new URL(request.url);
    const serviceId = url.pathname.split('/').pop();

    connection = await getConnection();
    await connection.execute(
      'DELETE FROM Service WHERE Service_ID = :1',
      [serviceId]
    );

    await connection.commit();
    return NextResponse.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
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