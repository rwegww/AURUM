import fs from 'fs';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase credentials.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// --- Helpers ---
const shuffle = (array) => array.sort(() => Math.random() - 0.5);

let generatedQuestions = [];

function addQuestion(grade_level, difficulty, questionText, correctAnswer, wrongAnswersArr, points) {
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

// --- SUPER DIFFICULTY ALGORITHMS ---

// 1. Nồng độ Mol (150 câu)
// Hòa tan m gam chất X (M mol) vào nước tạo thành V ml dung dịch. Nồng độ mol CM = (m/M) / (V/1000).
const salts = [
    { formula: 'NaCl', M: 58.5 }, { formula: 'CaCO3', M: 100 }, { formula: 'CuSO4', M: 160 },
    { formula: 'BaCl2', M: 208 }, { formula: 'KNO3', M: 101 }, { formula: 'AgNO3', M: 170 }
];

for(let i=0; i<150; i++) {
    let sub = salts[Math.floor(Math.random() * salts.length)];
    let n = parseFloat((Math.random() * 0.5 + 0.1).toFixed(2)); // mol từ 0.1 tới 0.6
    let m = (n * sub.M).toFixed(1);
    let v_ml = Math.floor(Math.random() * 4 + 1) * 100 + 100; // 200, 300, 400, 500 ml
    let v_lit = v_ml / 1000;
    
    let CM = (n / v_lit).toFixed(2);
    let wrong1 = ((n / v_lit) + 0.5).toFixed(2);
    let wrong2 = ((n / v_lit) - 0.1).toFixed(2);
    let wrong3 = ((n / v_lit) * 2).toFixed(2);

    addQuestion(11, 'super', `Hòa tan hoàn toàn ${m} gam ${sub.formula} vào nước để thu được ${v_ml} ml dung dịch. Xác định nồng độ mol của dung dịch này?`, 
        `${CM} M`, [`${wrong1} M`, `${wrong2} M`, `${wrong3} M`], 50);
}

// 2. Định luật bảo toàn khối lượng - Đốt cháy (150 câu)
// Đốt m gam KL trong O2 thu được m2 gam Oxit. Hỏi thể tích O2 (đktc)?
// m_O2 = m2 - m -> n_O2 = m_O2 / 32 -> V_O2 = n_O2 * 22.4
const metals = ['Mg', 'Fe', 'Cu', 'Zn', 'Al'];
for(let i=0; i<150; i++) {
    let metal = metals[Math.floor(Math.random() * metals.length)];
    let n_o2 = parseFloat((Math.random() * 0.2 + 0.05).toFixed(3)); 
    let mass_o2 = n_o2 * 32;
    let v_o2 = (n_o2 * 22.4).toFixed(3);
    
    let m_metal = parseFloat((Math.random() * 10 + 2).toFixed(1));
    let m_oxit = (m_metal + mass_o2).toFixed(2);

    let wrong1 = ((n_o2 + 0.1) * 22.4).toFixed(3);
    let wrong2 = ((n_o2 - 0.02) * 22.4).toFixed(3);
    let wrong3 = ((n_o2 * 2) * 22.4).toFixed(3);

    addQuestion(10, 'super', `Đốt cháy hoàn toàn ${m_metal} gam kim loại ${metal} trong không khí, thu được ${m_oxit} gam oxit. Xác định thể tích khí Oxi (đktc) đã tham gia phản ứng?`, 
        `${v_o2} lít`, [`${wrong1} lít`, `${wrong2} lít`, `${wrong3} lít`], 50);
}

// 3. Pha trộn dung dịch (100 câu)
// Trộn V1 ml AgNO3 C1(M) với V2 ml AgNO3 C2(M). C_new = (C1V1 + C2V2)/(V1+V2)
for(let i=0; i<100; i++) {
    let v1 = Math.floor(Math.random()*4 + 1) * 100; // 100-400
    let v2 = Math.floor(Math.random()*4 + 1) * 100; // 100-400
    let c1 = parseFloat((Math.random() * 2 + 0.5).toFixed(1));
    let c2 = parseFloat((Math.random() * 2 + 0.5).toFixed(1));
    if(c1 === c2) c2 += 0.5;

    let c_new = ((c1*v1 + c2*v2) / (v1 + v2)).toFixed(2);
    
    let wrong1 = (parseFloat(c_new) + 0.4).toFixed(2);
    let wrong2 = (parseFloat(c_new) - 0.2).toFixed(2);
    let wrong3 = ((c1+c2)/2).toFixed(2); // Lừa cộng chia đôi nhưng sai thể tích tỉ lệ

    addQuestion(12, 'super', `Trộn lẫn ${v1} ml dung dịch HNO3 ${c1}M với ${v2} ml dung dịch HNO3 ${c2}M. Tính nồng độ mol của dung dịch mới thu được?`, 
        `${c_new} M`, [`${wrong1} M`, `${wrong2} M`, `${wrong3} M`], 50);
}

// 4. Bài toán hiệu suất (100 câu)
// Nung m gam CaCO3 (M=100) -> CaO + CO2. Đáng lẽ ra V_CO2 nhưng thực tế thu được V_thuc. Hiệu suất H = V_thuc / V_lt * 100.
for(let i=0; i<100; i++) {
    let m = Math.floor(Math.random()*40 + 10); // 10-50g
    let n = m / 100; // mol CaCO3
    let v_lt = n * 22.4; 
    let h = Math.floor(Math.random()*30 + 50); // H từ 50% đến 80%
    let v_thuc = (v_lt * (h / 100)).toFixed(2);

    let wrong1 = (h + 10).toFixed(0);
    let wrong2 = (h - 15).toFixed(0);
    let wrong3 = (100 - h).toFixed(0);

    addQuestion(11, 'super', `Nung nóng ${m} gam đá vôi (CaCO3), sau một thời gian thu được ${v_thuc} lít khí CO2 (đktc). Hiệu suất của chuỗi phản ứng nhiệt phân này là bao nhiêu?`, 
        `${h}%`, [`${wrong1}%`, `${wrong2}%`, `${wrong3}%`], 50);
}

// Tổng: 150 + 150 + 100 + 100 = 500

console.log(`Đã tạo ra tổng số: ${generatedQuestions.length} câu hỏi siêu khó (Vận dụng cao).`);

async function execute() {
    console.log('Bắt đầu bơm lên Supabase theo Batch 100 câu (Không xóa câu cũ)...');
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
    
    console.log('\n✅ Hoàn thành bơm thêm 500 câu hỏi Vận Dụng Cao (Super)!');
    process.exit(0);
}

execute();
