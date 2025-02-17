import { NextResponse } from 'next/server';
const db = require('../../../lib/db');

export async function GET() {
  try {
    const result = await db.execute('SELECT SYSDATE FROM DUAL');
    return NextResponse.json({ 
      status: 'success', 
      timestamp: result.rows[0].SYSDATE,
      message: 'Database connection successful' 
    });
  } catch (error) {
    console.error('Database connection test failed:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: error.message 
    }, { status: 500 });
  }
} 