async function seed() {
  try {
    // 1. Login
    const loginRes = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'Omrutam@1306' })
    });
    
    if (!loginRes.ok) throw new Error('Login failed');
    const { token } = await loginRes.json();

    const mediaItems = [
      { type: 'video', title: 'Community Outreach 2025', url: 'https://youtu.be/ut7Nfd8Pq3s?si=id3g2T4HCDOP3-lu', year: '2025', month: 'January' },
      { type: 'video', title: 'Education Program 2025', url: 'https://youtu.be/mY78VWPhyw8?si=nLmyCoWDQqd1AZos', year: '2025', month: 'March' },
      { type: 'photo', title: 'Food Distribution', url: 'https://images.unsplash.com/photo-1593113589914-07599c18fda7?auto=format&fit=crop&w=800&q=80', year: '2025', month: 'January' },
      { type: 'photo', title: 'School Supplies', url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80', year: '2025', month: 'March' },
      { type: 'photo', title: 'Medical Camp 2026', url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80', year: '2026', month: 'August' },
      { type: 'video', title: 'Annual Gala 2026', url: 'https://youtu.be/ut7Nfd8Pq3s?si=id3g2T4HCDOP3-lu', year: '2026', month: 'August' },
      { type: 'photo', title: 'Volunteer Training', url: 'https://images.unsplash.com/photo-1559027615-cd4628ce02df?auto=format&fit=crop&w=800&q=80', year: '2026', month: 'September' },
    ];

    for (const item of mediaItems) {
      const res = await fetch('http://localhost:3000/api/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(item)
      });
      const data = await res.json();
      console.log(`Added: ${item.title}`, data);
    }
    
    console.log("Seeding complete!");
  } catch (error) {
    console.error("Seeding error:", error);
  }
}

seed();
