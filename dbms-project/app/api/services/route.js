const { execute, initialize } = require('@/lib/db');
const { NextResponse } = require('next/server');

// Initialize the database connection pool
initialize().catch(console.error);

async function GET() {
  try {
    const result = await execute(
      `SELECT 
        s.Service_ID,
        s.ServiceName,
        s.Description,
        s.Price,
        s.Duration,
        s.Category
      FROM Service s
      ORDER BY s.Category, s.ServiceName`
    );

    return NextResponse.json({ 
      services: result.rows,
      success: true 
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch services',
        details: error.message,
        success: false 
      },
      { status: 500 }
    );
  }
}

async function POST(request) {
  try {
    const { serviceName, description, price, duration, category } = await request.json();

    // Input validation
    if (!serviceName || !description || !price || !duration || !category) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          success: false 
        },
        { status: 400 }
      );
    }

    const result = await execute(
      `INSERT INTO Service 
        (Service_ID, ServiceName, Description, Price, Duration, Category)
      VALUES 
        (Service_Seq.NEXTVAL, :1, :2, :3, :4, :5)
      RETURNING Service_ID INTO :6`,
      [serviceName, description, price, duration, category]
    );

    return NextResponse.json({ 
      message: 'Service created successfully',
      serviceId: result.outBinds[0][0],
      success: true
    });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create service',
        details: error.message,
        success: false 
      },
      { status: 500 }
    );
  }
}

module.exports = {
  GET,
  POST
}; 