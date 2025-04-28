import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error('VITE_GEMINI_API_KEY is not defined in environment variables');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

export const generatePolicyReport = async (policyData: any) => {
  const prompt = `Generate a comprehensive report about the Indian government welfare scheme: ${policyData.name}

Key points to cover:
1. Brief overview and objectives
2. Target beneficiaries (based on this profile: ${JSON.stringify(policyData.beneficiaryPersona)})
3. Key benefits and features
4. Public sentiment analysis (based on: positive ${policyData.sentimentData.positive}%, neutral ${policyData.sentimentData.neutral}%, negative ${policyData.sentimentData.negative}%)
5. Implementation challenges and recommendations

Please provide a well-structured response with clear sections and bullet points where appropriate.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating report:', error);
    throw new Error('Failed to generate policy report');
  }
};

export const generatePolicySummary = async (policyName: string) => {
  const prompt = `Provide a concise 2-3 sentence summary of the Indian government welfare scheme: ${policyName}. Focus on its main objective and primary beneficiaries.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating summary:', error);
    throw new Error('Failed to generate policy summary');
  }
};