import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

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
    const { username, password, inventory, rollCount } = req.body;

    if (!username || !password || !Array.isArray(inventory)) {
      return res.status(400).json({ error: 'Missing or invalid fields' });
    }

    const user = await redis.get(`user:${username}`);
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    user.inventory = inventory;
    user.rollCount = rollCount;
    await redis.set(`user:${username}`, user);

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Progress update error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}
