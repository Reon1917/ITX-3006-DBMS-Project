import { NextResponse } from 'next/server';
import { execute } from '@/lib/db';
import oracledb from 'oracledb';

// GET /api/services
export async function GET() {
  try {
    const result = await execute(
      `SELECT * FROM Service ORDER BY Service_ID`,
      []
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

// POST /api/services
export async function POST(request) {
  try {
    const body = await request.json();
    const { ServiceName, Description, Price, Duration, Category } = body;

    const result = await execute(
      `INSERT INTO Service (Service_ID, ServiceName, Description, Price, Duration, Category) 
       VALUES (Service_Seq.NEXTVAL, :1, :2, :3, :4, :5)
       RETURNING Service_ID INTO :6`,
      [ServiceName, Description, Price, Duration, Category, { dir: oracledb.BIND_OUT }]
    );

    return NextResponse.json({ 
      message: 'Service created successfully',
      Service_ID: result.outBinds[0][0]
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  }
}

// PUT /api/services/[id]
export async function PUT(request, { params }) {
  try {
    const body = await request.json();
    const { ServiceName, Description, Price, Duration, Category } = body;

    await execute(
      `UPDATE Service 
       SET ServiceName = :1, 
           Description = :2, 
           Price = :3, 
           Duration = :4, 
           Category = :5
       WHERE Service_ID = :6`,
      [ServiceName, Description, Price, Duration, Category, params.id]
    );

    return NextResponse.json({ 
      message: 'Service updated successfully' 
    });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: 500 }
    );
  }
}

// DELETE /api/services/[id]
export async function DELETE(request, { params }) {
  try {
    // First check if service is used in any appointments
    const checkResult = await execute(
      `SELECT COUNT(*) as count FROM Appointment WHERE Service_ID = :1`,
      [params.id]
    );

    if (checkResult.rows[0].COUNT > 0) {
      return NextResponse.json(
        { error: 'Cannot delete service as it has associated appointments' },
        { status: 400 }
      );
    }

    await execute(
      `DELETE FROM Service WHERE Service_ID = :1`,
      [params.id]
    );

    return NextResponse.json({ 
      message: 'Service deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    );
  }
} 