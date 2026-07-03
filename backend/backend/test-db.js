const db = require('./config/database');

async function showColumns() {
  try {
    await db.authenticate();
    const [results, metadata] = await db.query("DESCRIBE bai_viet");
    console.log("Columns in bai_viet:", results);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
showColumns();
