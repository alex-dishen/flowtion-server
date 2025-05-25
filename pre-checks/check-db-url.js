require('dotenv').config();
const dbUrl = process.env.DATABASE_URL || '';

function checkDbUrl() {
  const isProductionDB = dbUrl.includes('55003');

  if (isProductionDB) {
    console.error('❌ Error: The database URL points to a production database');
    console.error('💡 Change it to a non-production URL\n');
    process.exit(1);
  }

  console.log('Database URL is safe ✅. Proceeding...');
}

checkDbUrl();
