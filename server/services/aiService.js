const { GoogleGenAI } = require('@google/genai');

// Initialize Gemini Client with API key from environment variables
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Generates an empathetic and grounded AI explanation for deterministic eligibility evaluation results.
 */
async function generateEligibilityExplanation(userProfile, scheme, evaluationResult) {
  const prompt = `
You are an official Indian Government Welfare Assistant. Explain the eligibility evaluation transparently.

User Profile:
${JSON.stringify(userProfile, null, 2)}

Scheme Details:
- Name: ${scheme.name}
- Category: ${scheme.category}
- Benefits: ${scheme.benefits.join(', ')}

Calculated Evaluation (Deterministic Engine):
- Status: ${evaluationResult.status}
- Match Score: ${evaluationResult.matchPercentage}%
- Rule Breakdown: ${JSON.stringify(evaluationResult.criteriaResults, null, 2)}

Rules:
1. State clearly why the user is ${evaluationResult.status}.
2. Keep the tone helpful, empathetic, and concise.
3. Highlight missing criteria if any.
4. DO NOT change or alter the status or score provided above.

Provide a 3-bullet summary explanation.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (err) {
    console.error('AI Explanation Error:', err.message);
    return 'Detailed eligibility explanation is temporarily unavailable. Please check the rule breakdown below.';
  }
}

/**
 * RAG AI Assistant for natural language citizen queries grounded in database schemes.
 */
async function answerCitizenQuery(userQuery, userProfile, relevantSchemes) {
  const contextData = relevantSchemes.map(s => ({
    name: s.name,
    category: s.category,
    ministry: s.ministry,
    benefits: s.benefits,
    documentsRequired: s.documentsRequired,
    officialWebsite: s.officialWebsite,
    rules: s.rules
  }));

  const systemInstruction = `
You are the official AI Government Scheme Assistant for Indian Citizens.
Your responses MUST be strictly grounded on the scheme database context provided below.

Rules:
1. ONLY reference schemes provided in the Context. Never invent new schemes or eligibility rules.
2. If the user asks in Bengali, Hindi, or English, respond politely in the SAME language.
3. For matched schemes, mention: Scheme Name, Key Benefits, Required Documents, and Official Website link.
4. If context is insufficient or scheme is missing, clearly state that manual verification on the official portal is needed.
`;

  const prompt = `
Context Schemes Database:
${JSON.stringify(contextData, null, 2)}

User Profile Context:
${JSON.stringify(userProfile || {}, null, 2)}

User Query: "${userQuery}"
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction
      }
    });
    return response.text;
  } catch (err) {
    console.error('RAG AI Error:', err.message);
    return 'I am currently unable to process your request via AI. Please check the scheme directory manually.';
  }
}

module.exports = {
  generateEligibilityExplanation,
  answerCitizenQuery
};