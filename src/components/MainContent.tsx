import React, { useState } from 'react';
import InputSection from './InputSection';
import ResultsSection from './ResultsSection';
import { PolicyData, BeneficiaryPersona, SentimentData } from '../types';
import { findPolicyMatch, findSimilarPolicies } from '../utils/policyUtils';
import policySearchKeywords from '../utils/policySearchKeywords';
import policies from '../utils/policiesData';

const MainContent: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [policyData, setPolicyData] = useState<PolicyData | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handlePolicySearch = async (policyName: string, isVoiceInput: boolean = false) => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const matchedPolicy = findPolicyMatch(policyName);
      
      if (matchedPolicy) {
        const personaData = generatePersonaData(matchedPolicy);
        const sentimentData = await fetchRedditSentiment(matchedPolicy);
        
        setPolicyData({
          name: matchedPolicy,
          description: `${matchedPolicy} is a welfare scheme by the Indian government designed to help citizens.`,
          beneficiaryPersona: personaData,
          sentimentData: sentimentData
        });
        setSuggestions([]);
      } else {
        setPolicyData(null);
        const similarPolicies = findSimilarPolicies(policyName);
        setSuggestions(similarPolicies);
        
        if (similarPolicies.length > 0) {
          setError(`We couldn't find "${policyName}". Did you mean one of these?`);
        } else {
          setError(`We couldn't find any policy matching "${policyName}".`);
        }
      }
    } catch (err) {
      setError('An error occurred while searching for the policy. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generatePersonaData = (policyName: string): BeneficiaryPersona => {
    if (policyName.includes("Matru")) {
      return {
        ageRange: "18-45",
        gender: "Female",
        occupation: "Various",
        location: "All India",
        income: "Any",
        additionalDetails: "Pregnant women and lactating mothers"
      };
    } else if (policyName.includes("Kisan")) {
      return {
        ageRange: "18-65",
        gender: "Any",
        occupation: "Farmer",
        location: "Rural India",
        income: "Small & marginal farmers",
        additionalDetails: "Landholding farmers"
      };
    } else {
      return {
        ageRange: "18-65",
        gender: "Any",
        occupation: "Various",
        location: "All India",
        income: "Below Poverty Line",
        additionalDetails: "Economically weaker sections"
      };
    }
  };

  const fetchRedditCommentsFromAPI = async (policyName: string) => {
    const response = await fetch(
      `http://localhost:5000/api/reddit_comments?policy=${encodeURIComponent(policyName)}`
    );
    if (!response.ok) throw new Error('Failed to fetch Reddit comments');
    return await response.json();
  };

  const analyzeSentiment = (text: string): 'positive' | 'neutral' | 'negative' => {
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'helpful', 'benefit', 'success', 'easy', 'support', 'happy'];
    const negativeWords = ['bad', 'terrible', 'awful', 'difficult', 'problem', 'issue', 'corrupt', 'delay', 'complicated', 'poor'];
    let positiveScore = 0, negativeScore = 0;
    const words = text.toLowerCase().split(/\s+/);
    for (const word of words) {
      if (positiveWords.includes(word)) positiveScore++;
      if (negativeWords.includes(word)) negativeScore++;
    }
    if (positiveScore > negativeScore) return 'positive';
    if (negativeScore > positiveScore) return 'negative';
    return 'neutral';
  };

  const getRedditSearchKeyword = (policyName: string) => {
    return policySearchKeywords[policyName] || policyName;
  };

  const fetchRedditSentiment = async (policyName: string): Promise<SentimentData> => {
    const keyword = getRedditSearchKeyword(policyName);
    const comments = await fetchRedditCommentsFromAPI(keyword);
    let positive = 0, neutral = 0, negative = 0;
    const analyzedComments = comments.map((comment: any) => {
      const sentiment = analyzeSentiment(comment.body);
      if (sentiment === 'positive') positive++;
      else if (sentiment === 'negative') negative++;
      else neutral++;
      return { text: comment.body, sentiment };
    });
    const total = positive + neutral + negative || 1;
    return {
      positive: (positive / total) * 100,
      neutral: (neutral / total) * 100,
      negative: (negative / total) * 100,
      comments: analyzedComments
    };
  };

  const handleSelectSuggestion = (suggestion: string) => {
    handlePolicySearch(suggestion);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <section className="max-w-4xl mx-auto mb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">
          Discover Government Welfare Schemes
        </h2>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
          Your AI assistant to navigate Indian government policies and find the right benefits for you
        </p>
      </section>

      <InputSection onSearch={handlePolicySearch} isLoading={loading} />
      
      {error && (
        <div className="max-w-3xl mx-auto mt-6 p-4 bg-orange-50 dark:bg-gray-700 rounded-lg shadow">
          <p className="text-orange-700 dark:text-orange-300 mb-2">{error}</p>
          {suggestions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className="px-3 py-1 bg-white dark:bg-gray-600 rounded-full text-sm border border-orange-200 dark:border-gray-500 hover:bg-orange-100 dark:hover:bg-gray-500 transition-colors duration-200"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      
      {policyData && <ResultsSection policyData={policyData} />}
    </main>
  );
};

export default MainContent;