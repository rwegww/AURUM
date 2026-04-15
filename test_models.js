import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const checkModels = async () => {
    console.log("Checking OpenAI (gpt-4o-mini)...");
    try {
        const res = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: "Hi" }],
            max_tokens: 10
        });
        console.log("✅ OpenAI working:", res.choices[0].message.content);
    } catch (e) {
        console.error("❌ OpenAI failed:", e.message);
    }

    const geminiModels = [
        'gemini-1.5-flash',
        'gemini-2.5-flash',
        'gemini-3.1-flash-lite',
        'gemini-2.0-flash',
        'gemini-2.0-flash-lite',
        'gemini-pro'
    ];

    for (const m of geminiModels) {
        console.log(`\nChecking Gemini (${m})...`);
        try {
            const model = genAI.getGenerativeModel({ model: m }, { apiVersion: 'v1' });
            const result = await model.generateContent("Hi");
            console.log(`✅ Gemini ${m} working:`, result.response.text());
        } catch (e) {
            console.error(`❌ Gemini ${m} failed:`, e.message);
        }
    }
};

checkModels();
