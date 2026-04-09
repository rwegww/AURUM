import fs from 'fs';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { elements } from '../elements_v2.js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase credentials.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// --- Helpers ---
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const shuffle = (array) => array.sort(() => Math.random() - 0.5);

// Lấy n phần tử ngẫu nhiên
function getRandomElements(arr, n, excludeIndex) {
    let result = [];
    while(result.length < n) {
        let el = arr[Math.floor(Math.random() * arr.length)];
        if(excludeIndex !== undefined && arr.indexOf(el) === excludeIndex) continue;
        if(!result.includes(el)) result.push(el);
    }
    return result;
}

// Generate Questions Strategy
let generatedQuestions = [];

function addQuestion(grade_level, difficulty, questionText, correctAnswer, wrongAnswersArr, points) {
    // Trộn đáp án
    let options = [correctAnswer, ...wrongAnswersArr.slice(0, 3)];
    options = shuffle(options);
    let correctIdx = options.indexOf(correctAnswer);

    generatedQuestions.push({
        grade_level,
        difficulty,
        question: questionText,
        options: options,
        correct_option_index: correctIdx,
        points
    });
}

// --- GENERATION ALGORITHMS ---

// 1. Kí hiệu hóa học (118 câu) - Dễ
elements.forEach((el, idx) => {
    let wrongs = getRandomElements(elements, 3, idx).map(e => e.symbol);
    addQuestion(8, 'easy', `Ký hiệu hóa học của nguyên tố ${el.name} là gì?`, el.symbol, wrongs, 10);
});

// 2. Tên nguyên tố từ kí hiệu (118 câu) - Dễ
elements.forEach((el, idx) => {
    let wrongs = getRandomElements(elements, 3, idx).map(e => e.name);
    addQuestion(8, 'easy', `Nguyên tố có ký hiệu hóa học "${el.symbol}" là gì?`, el.name, wrongs, 10);
});

// 3. Số hiệu nguyên tử (118 câu) - Trung bình
elements.forEach((el, idx) => {
    let wrongs = [el.number + 1, Math.max(1, el.number - 1), el.number + 2].map(n => n.toString());
    addQuestion(9, 'medium', `Số hiệu nguyên tử (Z) của ${el.name} là bao nhiêu?`, el.number.toString(), wrongs, 20);
});

// 4. Khối lượng nguyên tử (118 câu) - Khó
elements.forEach((el, idx) => {
    let weight = parseFloat(el.weight).toFixed(1);
    let wrongs = [(parseFloat(el.weight) + 1.2).toFixed(1), (parseFloat(el.weight) - 0.5).toFixed(1), (parseFloat(el.weight) + 2.1).toFixed(1)];
    addQuestion(10, 'hard', `Nguyên tử khối tinh toán gần đúng của ${el.name} là bao nhiêu?`, weight, wrongs, 30);
});

// 5. Tính toán mol khí (1000 câu) - Trung Bình/Khó
// Thể tích khí ở đktc: V = n * 22.4 -> n = V/22.4. Hỏi V từ mol ngẫu nhiên.
for(let i=0; i<1000; i++) {
    let n = parseFloat((Math.random() * 5 + 0.1).toFixed(2)); // 0.1 đến 5.0 mol
    let gases = ['O2', 'H2', 'CO2', 'N2', 'Cl2'];
    let gas = gases[Math.floor(Math.random() * gases.length)];
    
    let currentV = (n * 22.4).toFixed(2);
    let wrong1 = ((n+0.5) * 22.4).toFixed(2);
    let wrong2 = ((n-0.1) * 22.4).toFixed(2);
    let wrong3 = ((n+1) * 22.4).toFixed(2);

    addQuestion(9, 'medium', `Thể tích của ${n} mol khí ${gas} (ở đktc) là bao nhiêu lít?`, `${currentV} lít`, [`${wrong1} lít`, `${wrong2} lít`, `${wrong3} lít`], 20);
}

// 6. Tính khối lượng chất (1000 câu) - Khó
// m = n * M
const compounds = [
    { formula: 'H2O', M: 18 }, { formula: 'CO2', M: 44 }, { formula: 'NaCl', M: 58.5 },
    { formula: 'H2SO4', M: 98 }, { formula: 'CaCO3', M: 100 }, { formula: 'NaOH', M: 40 },
    { formula: 'HCl', M: 36.5 }, { formula: 'CuO', M: 80 }
];
for(let i=0; i<1000; i++) {
    let n = parseFloat((Math.random() * 2 + 0.1).toFixed(2)); // 0.1 đến 2.0 mol
    let comp = compounds[Math.floor(Math.random() * compounds.length)];
    
    let m = (n * comp.M).toFixed(1);
    let wrong1 = ((n+0.2) * comp.M).toFixed(1);
    let wrong2 = ((n-0.1) * comp.M).toFixed(1);
    let wrong3 = ((n+0.5) * comp.M).toFixed(1);

    addQuestion(10, 'hard', `Khối lượng của ${n} mol hợp chất ${comp.formula} là bao nhiêu gam?`, `${m} gam`, [`${wrong1} gam`, `${wrong2} gam`, `${wrong3} gam`], 30);
}

// 7. Nhận biết tính axit/bazơ (528 câu còn lại để tròn ~3000) - Dễ
const acids = ['HCl', 'H2SO4', 'HNO3', 'H3PO4', 'CH3COOH'];
const bases = ['NaOH', 'KOH', 'Ca(OH)2', 'Ba(OH)2'];
const salts = ['NaCl', 'KNO3', 'BaSO4', 'CaCO3'];

for(let i=0; i<528; i++) {
    let type = getRandomInt(0, 2);
    if(type === 0) { // Acid
        let sub = acids[Math.floor(Math.random() * acids.length)];
        addQuestion(8, 'easy', `Chất ${sub} làm quỳ tím chuyển sang màu gì?`, 'Đỏ', ['Xanh', 'Không đổi màu', 'Vàng'], 10);
    } else if (type === 1) { // Base
        let sub = bases[Math.floor(Math.random() * bases.length)];
        addQuestion(8, 'easy', `Chất ${sub} làm quỳ tím chuyển sang màu gì?`, 'Xanh', ['Đỏ', 'Không đổi màu', 'Vàng'], 10);
    } else { // Salt (Neutral)
        let sub = salts[Math.floor(Math.random() * salts.length)];
        addQuestion(8, 'easy', `Dung dịch ${sub} (trung tính) làm quỳ tím chuyển sang màu gì?`, 'Không đổi màu', ['Xanh', 'Đỏ', 'Tím than'], 10);
    }
}

// Tổng cộng: 118 + 118 + 118 + 118 + 1000 + 1000 + 528 = 3000 câu.

console.log(`Đã tạo ra tổng số: ${generatedQuestions.length} câu hỏi.`);

async function execute() {
    console.log('Bắt đầu xóa cache cũ...');
    // Xóa những câu cũ mà không phải là 'placeholder-to-delete-all' (tránh lưu rác)
    // Cho phép xóa hết nếu cần
    await supabase.from('arena_questions').delete().neq('question', 'placeholder');

    console.log('Bắt đầu bơm lên Supabase theo Batch 100 câu...');
    let batchSize = 100;
    
    for (let i = 0; i < generatedQuestions.length; i += batchSize) {
        const batch = generatedQuestions.slice(i, i + batchSize);
        const { error } = await supabase.from('arena_questions').insert(batch);
        if (error) {
            console.error(`Lỗi ở batch ${i} - ${i+batchSize}:`, error);
        } else {
            process.stdout.write(`Đã đẩy ${Math.min(i+batchSize, generatedQuestions.length)} / ${generatedQuestions.length}\r`);
        }
    }
    
    console.log('\n✅ Hoàn thành bơm 3000 câu hỏi mẫu Đấu Trường!');
    process.exit(0);
}

execute();
