import oracledb from 'oracledb';

// Initialize Oracle client in Thick mode
try {
  // Enable Thick mode
  oracledb.initOracleClient({
    libDir: process.env.ORACLE_CLIENT_PATH // Path to Oracle Instant Client
  });
} catch (err) {
  console.error('Oracle Client library initialization error:', err);
  console.error('Please ensure Oracle Instant Client is installed and ORACLE_CLIENT_PATH is set correctly');
}

// Set autoCommit to true for simple queries
oracledb.autoCommit = true;

let pool;

async function initialize() {
  try {
    await oracledb.createPool({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectString: process.env.ORACLE_CONNECT_STRING,
      poolMin: 2,
      poolMax: 10,
      poolIncrement: 1
    });
    console.log('Connection pool created');
  } catch (err) {
    console.error('Error creating pool: ' + err.message);
    throw err;
  }
}

export async function getConnection() {
  if (!pool) {
    await initialize();
  }
  return await oracledb.getConnection();
}

export async function closePool() {
  try {
    await oracledb.getPool().close(10);
    console.log('Pool closed');
  } catch (err) {
    console.error(err);
  }
}

export async function execute(sql, binds = [], opts = {}) {
  let connection;
  try {
    if (!pool) {
      await initialize();
    }
    connection = await oracledb.getConnection();
    const options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      autoCommit: true,
      ...opts
    };
    const result = await connection.execute(sql, binds, options);
    return result;
  } catch (err) {
    console.error('Error executing query:', err);
    throw err;
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

export { initialize }; 