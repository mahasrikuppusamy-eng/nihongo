import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './server/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || 'sakura2025';

app.use(express.json());

// Initialize Database connection (Dual-mode: MongoDB or zero-config fast storage)
db.connectMongo().catch((err) => {
  console.log('[App] MongoDB info:', err.message);
});

// Middleware for Admin validation
const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const passcode = req.headers['x-admin-passcode'] || req.query.passcode;
  if (!passcode || passcode !== ADMIN_PASSCODE) {
    return res.status(401).json({ error: 'Unauthorized: Invalid Admin Passcode' });
  }
  next();
};

// ==========================================
// REST API ROUTES
// ==========================================

// 1. STATS
app.get('/api/stats', async (req: Request, res: Response) => {
  try {
    const stats = await db.getStats();
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 2. PLAYERS
app.post('/api/players', async (req: Request, res: Response) => {
  try {
    const { nickname, avatar } = req.body;
    if (!nickname || typeof nickname !== 'string' || !nickname.trim()) {
      return res.status(400).json({ error: 'Valid player nickname is required' });
    }
    const player = await db.createOrGetPlayer(nickname.trim(), avatar);
    res.status(201).json(player);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/players/:id', async (req: Request, res: Response) => {
  try {
    const player = await db.getPlayer(req.params.id);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    const visited = await db.getPlayerVisitedDestinations(player.id);
    res.json({ ...player, visitedDestinations: visited });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/players/:id/visited', async (req: Request, res: Response) => {
  try {
    const visited = await db.getPlayerVisitedDestinations(req.params.id);
    res.json({ visited });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 3. LEADERBOARD
app.get('/api/leaderboard', async (req: Request, res: Response) => {
  try {
    const period = (req.query.period as 'all' | 'today' | 'week') || 'all';
    const leaders = await db.getLeaderboard(period);
    res.json(leaders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 4. QUESTIONS
app.get('/api/questions/:gameType', async (req: Request, res: Response) => {
  try {
    const { gameType } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;
    const questions = await db.getQuestions(gameType, limit);
    res.json(questions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 5. GAME SUBMISSION
app.post('/api/games/submit', async (req: Request, res: Response) => {
  try {
    const { playerId, gameType, score, accuracy, streak } = req.body;
    if (!playerId || !gameType || typeof score !== 'number') {
      return res.status(400).json({ error: 'Missing required game submission parameters' });
    }

    const result = await db.submitGameResult({
      playerId,
      gameType,
      score: Math.max(0, Math.floor(score)),
      accuracy: Math.min(100, Math.max(0, Math.round(accuracy || 100))),
      streak: Math.max(0, Math.floor(streak || 0)),
    });

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 6. JAPAN EXPLORER DESTINATIONS
app.get('/api/destinations', async (req: Request, res: Response) => {
  try {
    const destinations = await db.getDestinations();
    res.json(destinations);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/destinations/explore', async (req: Request, res: Response) => {
  try {
    const { playerId, destinationId } = req.body;
    if (!playerId || !destinationId) {
      return res.status(400).json({ error: 'playerId and destinationId are required' });
    }
    const outcome = await db.recordDestinationVisit(playerId, destinationId);
    res.json(outcome);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 7. MYSTERY DECODER CLUES
app.get('/api/mystery/clues', async (req: Request, res: Response) => {
  try {
    const clues = await db.getMysteryClues();
    res.json(clues);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 8. ADMIN DASHBOARD APIS
app.post('/api/admin/verify', (req: Request, res: Response) => {
  const { passcode } = req.body;
  if (passcode === ADMIN_PASSCODE) {
    return res.json({ success: true, message: 'Admin verified' });
  }
  return res.status(401).json({ success: false, error: 'Invalid Passcode' });
});

app.get('/api/admin/players', requireAdmin, async (req: Request, res: Response) => {
  try {
    const players = await db.getAllPlayers();
    res.json(players);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/admin/players/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const success = await db.deletePlayer(req.params.id);
    res.json({ success, message: 'Player removed successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/reset-leaderboard', requireAdmin, async (req: Request, res: Response) => {
  try {
    await db.resetLeaderboard();
    res.json({ success: true, message: 'Leaderboard and game history have been reset' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/seed', requireAdmin, async (req: Request, res: Response) => {
  try {
    await db.reseedDemoData();
    res.json({ success: true, message: 'Demonstration data and questions re-seeded successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// VITE MIDDLEWARE / STATIC ASSETS
// ==========================================
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`🇯🇵 NIHONGO AI LAB server running on port ${PORT} [Mode: ${isProd ? 'production' : 'development'}]`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
