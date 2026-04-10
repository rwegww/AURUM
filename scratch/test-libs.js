import fs from 'fs';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';

async function testExtraction() {
  console.log('Testing extraction...');
  // This is a placeholder as I don't have actual user files yet.
  // But I can check if the libraries are loaded correctly.
  console.log('pdf-parse loaded:', typeof pdf === 'function');
  console.log('mammoth loaded:', typeof mammoth === 'object');
}

testExtraction();
