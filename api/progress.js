import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { username, password } = req.body;

    console.log('Checking user:', username);

    if (!username || !password) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const user = await redis.get(`user:${username}`);

    console.log('Fetched user from Redis:', user);

    if (!user || user.password !== password) {
      console.warn('Invalid login attempt:', username);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.status(200).json({ inventory: user.inventory, rollCount: user.rollCount || [] });
  } catch (err) {
    console.error('Server error in progress.js:', err);
    res.status(500).json({ error: 'Server error' });
  }
}
