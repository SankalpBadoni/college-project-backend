import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Program from '../src/models/Program.js';
import LiveProject from '../src/models/LiveProject.js';
import { Competency } from '../src/models/Competency.js';

dotenv.config();

async function inspect() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const programCount = await Program.countDocuments();
    console.log('Total Programs:', programCount);

    const liveProjectCount = await LiveProject.countDocuments();
    console.log('Total Live Projects:', liveProjectCount);

    const competencyCount = await Competency.countDocuments();
    console.log('Total Competencies:', competencyCount);

    const sampleProgram = await Program.findOne();
    if (sampleProgram) {
      console.log('Sample Program Competencies:', sampleProgram.competencies);
    }

    const sampleProject = await LiveProject.findOne();
    if (sampleProject) {
      console.log('Sample LiveProject skillsRequired:', sampleProject.skillsRequired);
      console.log('Sample LiveProject keys:', Object.keys(sampleProject.toObject()));
    }

    const allCompetencies = await Competency.find().limit(5);
    console.log('Sample Competencies:', allCompetencies.map(c => ({ id: c._id, name: c.name })));

    process.exit(0);
  } catch (error) {
    console.error('Error during inspection:', error);
    process.exit(1);
  }
}

inspect();
