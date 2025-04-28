export interface BeneficiaryPersona {
  ageRange: string;
  gender: string;
  occupation: string;
  location: string;
  income: string;
  additionalDetails: string;
}

export interface SentimentComment {
  text: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface SentimentData {
  positive: number;
  neutral: number;
  negative: number;
  comments: SentimentComment[];
}

export interface PolicyData {
  name: string;
  description: string;
  beneficiaryPersona: BeneficiaryPersona;
  sentimentData: SentimentData;
}