const { GoogleGenAI } = require("@google/genai");
const puppeteer = require("puppeteer");

function getAiClient() {
    return new GoogleGenAI({
        apiKey: process.env.GOOGLE_GENAI_API_KEY
    })
}

const interviewReportSchema = {
    type: "OBJECT",
    properties: {
        title: { type: "STRING", description: "The title of the job for which the interview report is generated" },
        matchScore: { type: "INTEGER", description: "A score between 0 and 100 indicating match percentage" },
        technicalQuestions: {
            type: "ARRAY",
            description: "List of technical questions with intention and model answer",
            items: {
                type: "OBJECT",
                properties: {
                    question: { type: "STRING" },
                    intention: { type: "STRING" },
                    answer: { type: "STRING" }
                },
                required: ["question", "intention", "answer"]
            }
        },
        behavioralQuestions: {
            type: "ARRAY",
            description: "List of behavioral questions with intention and model answer",
            items: {
                type: "OBJECT",
                properties: {
                    question: { type: "STRING" },
                    intention: { type: "STRING" },
                    answer: { type: "STRING" }
                },
                required: ["question", "intention", "answer"]
            }
        },
        skillGaps: {
            type: "ARRAY",
            description: "Skill gaps with severity low, medium, or high",
            items: {
                type: "OBJECT",
                properties: {
                    skill: { type: "STRING" },
                    severity: { type: "STRING", enum: ["low", "medium", "high"] }
                },
                required: ["skill", "severity"]
            }
        },
        preparationPlan: {
            type: "ARRAY",
            description: "Day-wise preparation plan",
            items: {
                type: "OBJECT",
                properties: {
                    day: { type: "INTEGER" },
                    focus: { type: "STRING" },
                    tasks: {
                        type: "ARRAY",
                        items: { type: "STRING" }
                    }
                },
                required: ["day", "focus", "tasks"]
            }
        }
    },
    required: ["title", "matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan"]
}

const resumePdfSchema = {
    type: "OBJECT",
    properties: {
        html: { type: "STRING", description: "HTML content of the resume" }
    },
    required: ["html"]
}

async function callGeminiWithFallback(fn) {
    const models = ["gemini-3.5-flash", "gemini-3.8-flash", "gemini-3.6-flash", "gemini-flash-latest"];
    let lastError = null;
    for (const model of models) {
        try {
            return await fn(model);
        } catch (err) {
            console.error(`Gemini model ${model} failed:`, err.status || err.message);
            lastError = err;
        }
    }
    throw lastError;
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `Generate an interview report for a candidate with the following details:
Resume: ${resume || 'N/A'}
Self Description: ${selfDescription || 'N/A'}
Job Description: ${jobDescription || 'N/A'}
`;

    const ai = getAiClient();
    return await callGeminiWithFallback(async (model) => {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: interviewReportSchema,
            }
        });
        return JSON.parse(response.text);
    });
}

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
        format: "A4",
        margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    });

    await browser.close();
    return pdfBuffer;
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    const prompt = `Generate resume for a candidate with the following details:
Resume: ${resume || 'N/A'}
Self Description: ${selfDescription || 'N/A'}
Job Description: ${jobDescription || 'N/A'}

the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using puppeteer.
`;

    const ai = getAiClient();
    const jsonContent = await callGeminiWithFallback(async (model) => {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: resumePdfSchema,
            }
        });
        return JSON.parse(response.text);
    });

    return await generatePdfFromHtml(jsonContent.html);
}

module.exports = { generateInterviewReport, generateResumePdf };
