import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Program from '../src/models/Program.js';
import { Competency } from '../src/models/Competency.js'; // Import registers the schema

dotenv.config();

async function testPopulate() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const programs = await Program.find({ isActive: true, status: 'published' })
      .populate('competencies', 'name')
      .limit(5);

    console.log('--- POPULATED PROGRAMS ---');
    for (const p of programs) {
      console.log(`Program: ${p.title}`);
      console.log(`Type: ${p.type}`);
      console.log(`Competencies:`, p.competencies);
      console.log('---------------------------');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testPopulate();
