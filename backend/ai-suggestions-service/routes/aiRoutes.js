import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/ai-suggestion", async (req, res) => {
    try {
        const { documentText } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

        const response = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: documentText }] }]
        });
        
        const suggestion = await response.response.text();


        res.json({ suggestion });
    } catch (error) {
        console.error("Error generating AI suggestion:", error);
        res.status(500).json({ error: "Failed to get AI suggestion" });
    }
});

export default router;
