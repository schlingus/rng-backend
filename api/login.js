res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
if (req.method === 'OPTIONS') {
  res.status(200).end();
  return;
}

import fs from 'fs';

const USERS_FILE = './users.json';

function loadUsers() {
    if (!fs.existsSync(USERS_FILE)) return {};
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
}

export default function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { username, password } = req.body;
    const users = loadUsers();
    if (!users[username] || users[username].password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json({ ok: true });
}