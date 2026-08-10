async function testApi() {
  const fetch = (await import('node-fetch')).default;
  console.log("Testing POST to create dummy news...");
  const postRes = await fetch('http://localhost:3000/api/news', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Test API Script', content: 'Initial Content' })
  });
  if (!postRes.ok) {
    console.log("POST failed", await postRes.text());
    return;
  }
  const newsItem = await postRes.json();
  console.log("Created:", newsItem);

  console.log("Testing PUT to update content...");
  const putRes = await fetch(`http://localhost:3000/api/news/${newsItem.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: 'Updated test test tes' })
  });
  if (!putRes.ok) {
    console.log("PUT failed", await putRes.text());
    return;
  }
  const updatedItem = await putRes.json();
  console.log("Updated:", updatedItem);
}
testApi().catch(console.error);
