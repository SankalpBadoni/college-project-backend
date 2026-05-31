import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Competency } from '../src/models/Competency.js';

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const comps = await Competency.find();
  console.log('Total Competencies in DB:', comps.length);
  for (const c of comps) {
    console.log(`ID: ${c._id} | Name: ${c.name} | Type: ${c.type}`);
  }

  process.exit(0);
}

run();
