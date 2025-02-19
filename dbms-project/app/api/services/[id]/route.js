import { NextResponse } from 'next/server';
import oracledb from 'oracledb';

const dbConfig = {
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  connectString: process.env.ORACLE_CONNECT_STRING,
};

// GET /api/services/[id]
export async function GET(request, { params }) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT * FROM Service WHERE Service_ID = :1`,
      [params.id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service' },
      { status: 500 }
    );
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error('Error closing connection:', error);
      }
    }
  }
}

// PUT /api/services/[id]
export async function PUT(request, { params }) {
  let connection;
  try {
    const body = await request.json();
    const { ServiceName, Description, Price, Duration, Category } = body;

    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `UPDATE Service 
       SET ServiceName = :1, 
           Description = :2, 
           Price = :3, 
           Duration = :4, 
           Category = :5
       WHERE Service_ID = :6`,
      [ServiceName, Description, Price, Duration, Category, params.id],
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Service updated successfully' 
    });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: 500 }
    );
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error('Error closing connection:', error);
      }
    }
  }
}

// DELETE /api/services/[id]
export async function DELETE(request, { params }) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    
    // First check if service is used in any appointments
    const checkResult = await connection.execute(
      `SELECT COUNT(*) as count FROM Appointment WHERE Service_ID = :1`,
      [params.id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (checkResult.rows[0].COUNT > 0) {
      return NextResponse.json(
        { error: 'Cannot delete service as it has associated appointments' },
        { status: 400 }
      );
    }

    const result = await connection.execute(
      `DELETE FROM Service WHERE Service_ID = :1`,
      [params.id],
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Service deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    );
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error('Error closing connection:', error);
      }
    }
  }
} 