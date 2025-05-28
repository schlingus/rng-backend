import fs from 'fs';

const USERS_FILE = './users.json';

function loadUsers() {
    if (!fs.existsSync(USERS_FILE)) return {};
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
}
function saveUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ error: 'Missing fields' });
        return;
    }
    const users = loadUsers();
    if (users[username]) {
        res.status(400).json({ error: 'User exists' });
        return;
    }
    users[username] = { password, inventory: [] };
    saveUsers(users);
    res.json({ ok: true });
}
