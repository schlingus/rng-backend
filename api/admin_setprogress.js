import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// For security, consider moving this to an environment variable instead of hardcoding!
const ADMIN_PASS = 'andrew s. is short';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { adminpass, username, inventory } = req.body;

    if (adminpass !== ADMIN_PASS) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (!username || !Array.isArray(inventory)) {
      return res.status(400).json({ error: 'Missing or invalid fields' });
    }

    const user = await redis.get(`user:${username}`);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.inventory = inventory;
    await redis.set(`user:${username}`, user);

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Admin set progress error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}
