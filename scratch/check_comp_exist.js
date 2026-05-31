import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Program from '../src/models/Program.js';
import { Competency } from '../src/models/Competency.js';

dotenv.config();

async function checkCompetencies() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const program = await Program.findOne({ title: 'Zoho for Sales — Zoho CRM' });
    if (!program) {
      console.log('Program not found');
      process.exit(1);
    }
    console.log('Program raw competencies:', program.toObject().competencies);

    for (const compId of program.toObject().competencies) {
      const doc = await Competency.findById(compId);
      console.log(`Competency ${compId}:`, doc ? doc.name : 'NOT FOUND');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkCompetencies();
