import fs from 'fs';
import path from 'path';

const files = [
  'professional_taxonomy_database.json',
  'taxonomy-seed.json',
  'new_competencies.json'
];

for (const file of files) {
  const filePath = path.join('c:/Users/Ayush/Desktop/Sameer\'s College project/college-project-backend', file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const has6a0 = content.includes('6a0bbc');
    const has6a1 = content.includes('6a179d');
    const has6a1bc = content.includes('6a1bc');
    console.log(`${file}: has 6a0bbc=${has6a0}, has 6a179d=${has6a1}, has 6a1bc=${has6a1bc}`);
  } else {
    console.log(`${file} does not exist`);
  }
}
