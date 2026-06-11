// One-off migration: add the PAT_PWD column the app expects to HIS_PATIENTS.
// Safe to run multiple times. Usage (from the Codespace terminal):
//   node scripts/migrate-add-pat-pwd.mjs
import oracledb from 'oracledb';

const connection = await oracledb.getConnection({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECTION_STRING,
});

try {
  await connection.execute('ALTER TABLE HIS_PATIENTS ADD (PAT_PWD VARCHAR2(255))');
  console.log('✓ Added PAT_PWD column to HIS_PATIENTS.');
} catch (err) {
  // ORA-01430: column being added already exists in table
  if (err.errorNum === 1430) {
    console.log('✓ PAT_PWD already exists — nothing to do.');
  } else {
    console.error('Migration failed:', err.message);
    process.exitCode = 1;
  }
} finally {
  await connection.close();
}
