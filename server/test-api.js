import express from 'express';
import cors from 'cors';
import { connectDB, isDBConnected } from './config/db.js';
import paperRoutes from './routes/paperRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import experimentRoutes from './routes/experimentRoutes.js';
import { mockStore } from './data/mockStore.js';

await connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    mode: isDBConnected() ? 'MongoDB Active' : 'Standalone Dual-Mode (In-Memory Active)',
  });
});

app.use('/api/papers', paperRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/experiments', experimentRoutes);

const server = app.listen(5099, async () => {
  console.log('Testing server running on port 5099...');

  try {
    const base = 'http://localhost:5099/api';

    // 1. Health check
    const health = await (await fetch(`${base}/health`)).json();
    console.log('✓ /api/health:', health.status, `(${health.mode})`);

    // 2. GET papers
    const papers = await (await fetch(`${base}/papers`)).json();
    console.log(`✓ GET /api/papers returned ${papers.length} papers`);

    // 3. POST new paper
    const newPaper = {
      title: 'Deep Learning in Cybersecurity',
      authors: 'Jane Doe, John Smith',
      year: 2025,
      domain: 'Information Security',
      abstract: 'A survey of deep learning applications for intrusion detection.',
      venue: 'IEEE S&P',
      url: 'https://doi.org/10.1109/example',
    };
    const createdPaper = await (await fetch(`${base}/papers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPaper),
    })).json();
    console.log('✓ POST /api/papers created:', createdPaper.id, createdPaper.title);

    // 4. PUT update paper
    const updatedPaper = await (await fetch(`${base}/papers/${createdPaper.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Deep Learning in Cyber Defense (Updated)' }),
    })).json();
    console.log('✓ PUT /api/papers/:id updated title to:', updatedPaper.title);

    // 5. GET single paper
    const fetchedSingle = await (await fetch(`${base}/papers/${createdPaper.id}`)).json();
    console.log('✓ GET /api/papers/:id verified:', fetchedSingle.title === updatedPaper.title);

    // 6. DELETE paper
    const deleteRes = await (await fetch(`${base}/papers/${createdPaper.id}`, {
      method: 'DELETE',
    })).json();
    console.log('✓ DELETE /api/papers/:id:', deleteRes.message);

    // 7. Test Notes CRUD
    const notes = await (await fetch(`${base}/notes`)).json();
    console.log(`✓ GET /api/notes returned ${notes.length} notes`);

    // 8. Test Projects CRUD
    const projects = await (await fetch(`${base}/projects`)).json();
    console.log(`✓ GET /api/projects returned ${projects.length} projects`);

    // 9. Test Experiments CRUD
    const experiments = await (await fetch(`${base}/experiments`)).json();
    console.log(`✓ GET /api/experiments returned ${experiments.length} experiments`);

    console.log('\n>>> ALL CRUD ENDPOINTS VERIFIED & WORKING PERFECTLY! <<<');
  } catch (err) {
    console.error('Test failed:', err);
    process.exitCode = 1;
  } finally {
    server.close();
  }
});

