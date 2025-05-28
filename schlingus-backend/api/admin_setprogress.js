res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
if (req.method === 'OPTIONS') {
  res.status(200).end();
  return;
}

res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
if (req.method === 'OPTIONS') {
  res.status(200).end();
  return;
}

import fs from 'fs';

const USERS_FILE = './users.json';
const ADMIN_PASS = 'iHATEpickles1'; // Change this to your real admin password

function loadUsers() {
    if (!fs.existsSync(USERS_FILE)) return {};
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
}
function saveUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

export default function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { adminpass, username, inventory } = req.body;
    if (adminpass !== ADMIN_PASS) return res.status(403).json({ error: 'Forbidden' });
    const users = loadUsers();
    if (!users[username]) return res.status(404).json({ error: 'User not found' });
    users[username].inventory = inventory;
    saveUsers(users);
    res.json({ ok: true });
}