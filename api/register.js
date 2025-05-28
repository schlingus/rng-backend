import fs from 'fs';

const USERS_FILE = './users.json';

function loadUsers() {
    if (!fs.existsSync(USERS_FILE)) return {};
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
}
function saveUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
    const users = loadUsers();
    if (users[username]) return res.status(400).json({ error: 'User exists' });
    users[username] = { password, inventory: [] };
    saveUsers(users);
    res.json({ ok: true });
}
