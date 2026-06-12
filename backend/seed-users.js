async function seedUsers() {
  try {
    // Register Admin
    const adminRes = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Admin User',
        email: 'admin@admin.com',
        password: 'admin123',
        role: 'Admin'
      })
    });
    const adminData = await adminRes.json();
    console.log('Admin user result:', adminData.message);
  } catch (error) {
    console.log('Admin user error:', error.message);
  }

  try {
    // Register Normal User
    const userRes = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'user@user.com',
        password: 'user123',
        role: 'User'
      })
    });
    const userData = await userRes.json();
    console.log('Normal user result:', userData.message);
  } catch (error) {
    console.log('Normal user error:', error.message);
  }
}

seedUsers();
