function parseQuestions(text) {
  const questions = [];
  const normalizedText = text.replace(/\r\n/g, '\n').replace(/\n+/g, '\n');
  const rawBlocks = normalizedText.split(/(?=(?:Câu|Bài|C|Question|Q)\s*\d+[:.-]?|\b\d+[:.-]\s+)/gi);
  
  console.log(`Found ${rawBlocks.length} potential blocks.`);

  for (let block of rawBlocks) {
    block = block.trim();
    if (!block) continue;

    const questionMatch = block.match(/^(?:(?:Câu|Bài|C|Question|Q)\s*\d+[:.-]?|\b\d+[:.-])\s*([\s\S]*?)(?=\s*[A-D][\.:)])/i);
    
    let questionText = "";
    if (!questionMatch) {
        const fallbackMatch = block.match(/^([\s\S]*?)(?=\s*[A-D][\.:)])/i);
        if (!fallbackMatch) continue;
        questionText = fallbackMatch[1].trim();
    } else {
        questionText = questionMatch[1].trim();
    }

    const options = [];
    const optionMatches = block.matchAll(/([A-D])[\.:)]\s*([\s\S]*?)(?=\s*[A-D][\.:)]|(?:(?:Câu|Bài|C|Question|Q)\s*\d+[:.-]?)|$)/gi);
    
    let optionsFound = Array.from(optionMatches);
    if (optionsFound.length > 0) {
        optionsFound.forEach(m => {
            options.push(m[2].trim());
        });
    }

    if (questionText && options.length >= 2) {
      questions.push({
        question: questionText,
        options: options.slice(0, 4), 
        correct_index: 0 
      });
    }
  }
  return questions;
}

const sampleText = `
Câu 1: Kim loại nào sau đây là kim loại kiềm?
A. Na
B. Mg
C. Al
D. Fe

Câu 2. Chất nào sau đây là axit mạnh?
A. HCl
B. CH3COOH
C. H2O
D. NH3

ĐÁP ÁN: 1:A, 2:A
`;

const result = parseQuestions(sampleText);
console.log('Result:', JSON.stringify(result, null, 2));
