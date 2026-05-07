// utils/seedAdmin.js
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_LOGIN_EMAIL || 'admin@gmail.com';
    const adminPassword = process.env.ADMIN_LOGIN_PASSWORD || '12345678';

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('✅ Admin account already exists.');
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    // Create admin
    await Admin.create({
      email: adminEmail,
      password: hashedPassword,
    });

    console.log('✅ Admin account seeded successfully.');
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
  }
};

module.exports = seedAdmin;
