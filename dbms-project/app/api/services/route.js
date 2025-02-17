import { NextResponse } from 'next/server';
const db = require('../../../lib/db');

// GET /api/services - Get all services
export async function GET() {
  try {
    const result = await db.execute(
      'SELECT * FROM Service ORDER BY Category, ServiceName'
    );
    return NextResponse.json({ 
      services: result.rows,
      success: true 
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ 
      error: error.message,
      success: false 
    }, { status: 500 });
  }
}

// POST /api/services - Create a new service
export async function POST(req) {
  try {
    const { serviceName, description, price, duration, category } = await req.json();
    
    // Input validation
    if (!serviceName || !price || !duration || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await db.execute(
      `INSERT INTO Service (ServiceName, Description, Price, Duration, Category) 
       VALUES (:1, :2, :3, :4, :5)
       RETURNING Service_ID INTO :6`,
      [serviceName, description, price, duration, category, { dir: db.BIND_OUT }]
    );

    return NextResponse.json({ 
      message: 'Service created successfully',
      serviceId: result.outBinds[0]
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/services/:id - Update a service
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const { serviceName, description, price, duration, category } = await req.json();

    const result = await db.execute(
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

    return NextResponse.json({ message: 'Service updated successfully' });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/services/:id - Delete a service
export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    const result = await db.execute(
      'DELETE FROM Service WHERE Service_ID = :1',
      [id]
    );

    if (result.rowsAffected === 0) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 