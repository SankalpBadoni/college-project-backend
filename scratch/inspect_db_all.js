import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Program from '../src/models/Program.js';
import { Competency } from '../src/models/Competency.js';

dotenv.config();

async function inspect() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const programs = await Program.find().select('title type competencies');
    console.log('--- ALL PROGRAMS ---');
    for (const p of programs) {
      console.log(`Program: ${p.title} | Type: ${p.type} | Competencies:`, p.competencies);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

inspect();
