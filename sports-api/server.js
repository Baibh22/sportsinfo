const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

let users = [];
let blogs = [];

// Register
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ error: 'Username already exists' });
  }
  users.push({ username, password });
  res.json({ success: true });
});

// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ success: true, username });
});

// Get all blogs
app.get('/api/blogs', (req, res) => {
  res.json(blogs);
});

// Add a blog
app.post('/api/blogs', (req, res) => {
  const { title, content, author } = req.body;
  const id = Date.now().toString();
  blogs.push({ id, title, content, author });
  res.json({ success: true });
});

// Delete a blog
app.delete('/api/blogs/:id', (req, res) => {
  const { id } = req.params;
  blogs = blogs.filter(blog => blog.id !== id);
  res.json({ success: true });
});

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));