async function ping() {
  try {
    const res = await fetch("https://chem-aurum.vercel.app/api/ai/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: "Hi" })
    });
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Response:", data);
  } catch(e) {
    console.error("Error:", e);
  }
}
ping();
