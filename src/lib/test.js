fetch("https://ai-cursor-full-4.onrender.com/members")
  .then(res => res.json())
  .then(console.log)
  .catch(console.error)