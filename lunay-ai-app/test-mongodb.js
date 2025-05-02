const mongoose = require('mongoose');

const uri = 'mongodb+srv://luna64:Luna%401234@companion-db.g5suray.mongodb.net/?retryWrites=true&w=majority&appName=companion-db';

async function testConnection() {
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    console.log('Successfully connected to MongoDB!');
    
    // List all databases
    const admin = mongoose.connection.db.admin();
    const dbList = await admin.listDatabases();
    console.log('\nAvailable databases:');
    dbList.databases.forEach(db => {
      console.log(`- ${db.name}`);
    });

  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

testConnection();
