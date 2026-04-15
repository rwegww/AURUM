import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

async function test() {
    const models = ['gemini-1.5-flash-latest', 'gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash-exp'];
    for (const m of models) {
        console.log(`Checking ${m}...`);
        try {
            const model = genAI.getGenerativeModel({ model: m }, { apiVersion: 'v1' });
            const result = await model.generateContent("Hi");
            console.log(`✅ ${m} works!`);
        } catch (e) {
            console.log(`❌ ${m} failed: ${e.message}`);
        }
    }
}
test();
