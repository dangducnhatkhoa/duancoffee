const db = require('./config/database');
const User = require('./models/User');

async function activateUsers() {
  try {
    await db.authenticate();
    const [updated] = await User.update(
      { status: 'active', email_verified: new Date() },
      { where: { status: 'suspended' } }
    );
    console.log(`Đã kích hoạt thành công ${updated} tài khoản.`);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
activateUsers();
