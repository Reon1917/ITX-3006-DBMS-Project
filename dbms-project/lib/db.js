const oracledb = require('oracledb');

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

// Initialize connection pool
let pool;

async function initialize() {
  try {
    if (!pool) {
      pool = await oracledb.createPool({
        user: process.env.ORACLE_USER,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_CONNECT_STRING,
        poolMin: 2,
        poolMax: 10,
        poolIncrement: 1
      });
      console.log('Connection pool created');
    }
    return pool;
  } catch (err) {
    console.error('Error creating connection pool:', err);
    throw err;
  }
}

async function closePool() {
  try {
    if (pool) {
      await pool.close();
      pool = null;
      console.log('Pool closed');
    }
  } catch (err) {
    console.error('Error closing pool:', err);
    throw err;
  }
}

async function execute(sql, binds = [], opts = {}) {
  let connection;
  try {
    if (!pool) {
      await initialize();
    }
    connection = await pool.getConnection();
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

module.exports = {
  execute,
  closePool,
  initialize
}; 