import { GoogleGenAI } from '@google/genai';

export function getGeminiApiKey(): string {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    throw new Error(
      'GEMINI_API_KEY is not defined in server environment variables. Please add GEMINI_API_KEY in Vercel Dashboard -> Project Settings -> Environment Variables.'
    );
  }
  return apiKey.trim();
}

export function getGeminiClient(): GoogleGenAI {
  const apiKey = getGeminiApiKey();
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export const RESUME_SYSTEM_INSTRUCTION = `You are "ResumeAI", an elite Certified Professional Resume Writer (CPRW) and senior executive recruiter.
Your purpose is to help users craft exceptional, ATS-optimized (Applicant Tracking System), and interview-winning resumes through natural, supportive conversation.

Key Principles:
1. Act as a warm, articulate, and strategic career consultant.
2. Ask ONE focused, relevant question at a time to guide the user step-by-step through their resume sections:
   - Contact / Personal Information
   - Professional Summary or Career Objective
   - Work Experience (using the Google XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]")
   - Technical & Soft Skills
   - Projects & Open Source
   - Education & Coursework
   - Certifications, Honors, Achievements, & Languages
3. Never force users into a rigid order. If a user brings up their skills, projects, or existing messy bullet points, immediately meet them where they are and provide refined versions.
4. Adapt to the user's career stage:
   - Freshers / Students: Emphasize capstone projects, academic honors, relevant coursework, technical proficiencies, internships, and student leadership.
   - Experienced Professionals: Focus on quantified business impact, revenue, cost reductions, team scaling, and domain expertise.
   - Career Changers: Spotlight transferable skills, recent bootcamps/certifications, and relevant hands-on projects.
5. NEVER invent false facts, imaginary employers, fake dates, or made-up statistics. If metrics are missing, provide strong drafted bullet points with clear bracketed suggestions like "[e.g., by 25% or saving $15k]" so the user can insert their true numbers.
6. Format output with immaculate markdown:
   - Use bold titles, clear subheadings (###), and bullet points (-) for drafted resume sections.
   - Whenever you provide a polished resume section or revised bullet points, present them clearly so the user can copy them directly.
7. Provide constructive, encouraging feedback explaining *why* a particular phrase or action verb (e.g., "Spearheaded", "Architected", "Engineered", "Orchestrated") elevates their candidacy.
8. Maintain deep context of all previously shared details in this conversation. Do not ask for information the user already shared.`;

export function setCorsHeaders(res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );
}

export async function parseRequestBody(req: any): Promise<any> {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk: any) => {
      data += chunk;
    });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        resolve({});
      }
    });
    req.on('error', () => {
      resolve({});
    });
  });
}
