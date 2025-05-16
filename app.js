// User and blog management with localStorage
const loginSection = document.getElementById('login-section');
const registerSection = document.getElementById('register-section');
const dashboard = document.getElementById('dashboard');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const loginSubmit = document.getElementById('loginSubmit');
const registerSubmit = document.getElementById('registerSubmit');
const showRegister = document.getElementById('showRegister');
const showLogin = document.getElementById('showLogin');
const loginError = document.getElementById('loginError');
const registerError = document.getElementById('registerError');
const userDisplay = document.getElementById('userDisplay');
const addBlogBtn = document.getElementById('addBlogBtn');
const blogList = document.getElementById('blogList');

function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}
function setUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}
function getBlogs() {
    return JSON.parse(localStorage.getItem('blogs') || '[]');
}
function setBlogs(blogs) {
    localStorage.setItem('blogs', JSON.stringify(blogs));
}
function getCurrentUser() {
    return localStorage.getItem('currentUser');
}
function setCurrentUser(username) {
    if (username) localStorage.setItem('currentUser', username);
    else localStorage.removeItem('currentUser');
}

function showSection(section) {
    loginSection.style.display = 'none';
    registerSection.style.display = 'none';
    dashboard.style.display = 'none';
    section.style.display = 'block';
}

function renderBlogs() {
    const blogs = getBlogs();
    blogList.innerHTML = '';
    if (blogs.length === 0) {
        blogList.innerHTML = '<p>No sports blogs yet.</p>';
        return;
    }
    const currentUser = getCurrentUser();
    blogs.slice().reverse().forEach((blog, idx) => {
        const div = document.createElement('div');
        div.className = 'blog';
        let html = `<div class="blog-title">${blog.title}</div>
            <div>${blog.content}</div>
            <div class="blog-author">By: ${blog.author}</div>`;
        // Only show delete button for the author
        if (currentUser === blog.author) {
            html += `<button class="deleteBlogBtn" data-index="${blogs.length - 1 - idx}">Delete</button>`;
        }
        div.innerHTML = html;
        blogList.appendChild(div);
    });
    // Add event listeners for delete buttons
    document.querySelectorAll('.deleteBlogBtn').forEach(btn => {
        btn.onclick = function() {
            const index = parseInt(this.getAttribute('data-index'));
            const blogsArr = getBlogs();
            blogsArr.splice(index, 1);
            setBlogs(blogsArr);
            renderBlogs();
        };
    });
}

function updateUI() {
    const user = getCurrentUser();
    if (user) {
        userDisplay.textContent = user;
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
        showSection(dashboard);
        renderBlogs();
    } else {
        loginBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'none';
        showSection(loginSection);
    }
}

loginBtn.onclick = () => updateUI();
logoutBtn.onclick = () => {
    setCurrentUser(null);
    updateUI();
};
showRegister.onclick = (e) => {
    e.preventDefault();
    showSection(registerSection);
};
showLogin.onclick = (e) => {
    e.preventDefault();
    showSection(loginSection);
};

loginSubmit.onclick = () => {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        setCurrentUser(username);
        loginError.textContent = '';
        updateUI();
    } else {
        loginError.textContent = 'Invalid username or password.';
    }
};

registerSubmit.onclick = () => {
    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value;
    if (!username || !password) {
        registerError.textContent = 'Please fill all fields.';
        return;
    }
    let users = getUsers();
    if (users.some(u => u.username === username)) {
        registerError.textContent = 'Username already exists.';
        return;
    }
    users.push({username, password});
    setUsers(users);
    registerError.textContent = '';
    showSection(loginSection);
};

addBlogBtn.onclick = () => {
    const title = document.getElementById('blogTitle').value.trim();
    const content = document.getElementById('blogContent').value.trim();
    if (!title || !content) return;
    const blogs = getBlogs();
    blogs.push({
        title,
        content,
        author: getCurrentUser()
    });
    setBlogs(blogs);
    document.getElementById('blogTitle').value = '';
    document.getElementById('blogContent').value = '';
    renderBlogs();
};

window.onload = updateUI;


async function apiRegister(username, password) {
  const res = await fetch('http://localhost:4000/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return res.json();
}
async function apiLogin(username, password) {
  const res = await fetch('http://localhost:4000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return res.json();
}
async function apiGetBlogs() {
  const res = await fetch('http://localhost:4000/api/blogs');
  return res.json();
}
async function apiAddBlog(title, content, author) {
  const res = await fetch('http://localhost:4000/api/blogs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content, author })
  });
  return res.json();
}
async function apiDeleteBlog(id) {
  const res = await fetch(`http://localhost:4000/api/blogs/${id}`, { method: 'DELETE' });
  return res.json();
}