import mongoose from 'mongoose';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Paper from './models/Paper.js';
import Note from './models/Note.js';
import Project from './models/Project.js';
import Experiment from './models/Experiment.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedPath = path.join(__dirname, 'data', 'seedData.json');
const rawData = fs.readFileSync(seedPath, 'utf-8');
const { papers, notes, projects, experiments } = JSON.parse(rawData);

const URI = 'mongodb://localhost:27017/margin_db';

async function seed() {
  try {
    console.log(`Connecting to ${URI}...`);
    await mongoose.connect(URI);
    console.log('Connected to MongoDB!');

    // Clear existing collections in margin_db
    await Paper.deleteMany({});
    await Note.deleteMany({});
    await Project.deleteMany({});
    await Experiment.deleteMany({});

    // Insert seeds
    await Paper.insertMany(papers);
    console.log(`Inserted ${papers.length} papers`);

    await Note.insertMany(notes);
    console.log(`Inserted ${notes.length} notes`);

    await Project.insertMany(projects);
    console.log(`Inserted ${projects.length} projects`);

    await Experiment.insertMany(experiments);
    console.log(`Inserted ${experiments.length} experiments`);

    console.log('Seeding completed successfully into margin_db!');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

seed();

