import { Redis } from '@upstash/redis';


const ADMIN_PASS = 'iHATEpickles1'; // Change this to your real admin password

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { adminpass, username, inventory } = req.body;
    if (adminpass !== ADMIN_PASS) return res.status(403).json({ error: 'Forbidden' });

    const user = await Redis.get(`user:${username}`);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.inventory = inventory;
    await Redis.set(`user:${username}`, user);
    res.json({ ok: true });
}