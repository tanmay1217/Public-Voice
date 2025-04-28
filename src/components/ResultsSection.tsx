import React, { useState, useEffect } from 'react';
import { PolicyData } from '../types';
import { User, TrendingUp, Volume2, ThumbsUp, ThumbsDown, ChevronDown, ChevronUp, FileDown } from 'lucide-react';
import { generatePolicyReport, generatePolicySummary } from '../utils/geminiUtils';
import { generatePDF } from '../utils/pdfUtils';

interface ResultsSectionProps {
  policyData: PolicyData;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ policyData }) => {
  const [isReading, setIsReading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [policySummary, setPolicySummary] = useState<string>('');
  const speechSynthesis = window.speechSynthesis;

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const summary = await generatePolicySummary(policyData.name);
        setPolicySummary(summary);
      } catch (error) {
        console.error('Error fetching policy summary:', error);
      }
    };
    fetchSummary();
  }, [policyData.name]);
  
  const handleTextToSpeech = () => {
    if (isReading) {
      speechSynthesis.cancel();
      setIsReading(false);
      return;
    }
    
    const description = `${policyData.name}. ${policySummary}`;
    const utterance = new SpeechSynthesisUtterance(description);
    utterance.onend = () => setIsReading(false);
    
    setIsReading(true);
    speechSynthesis.speak(utterance);
  };

  const getSentimentSummary = () => {
    const { positive, negative, neutral, comments } = policyData.sentimentData;
    let dominantSentiment = 'neutral';
    if (positive > negative && positive > neutral) dominantSentiment = 'positive';
    else if (negative > positive && negative > neutral) dominantSentiment = 'negative';

    // Filter comments for the dominant sentiment, ignore very short/long ones
    const filtered = comments
      .filter(c => c.sentiment === dominantSentiment && c.text.length > 30 && c.text.length < 400);
    // Take up to 3 comments
    const topComments = filtered.slice(0, 3);
    // Extract the first sentence of each comment
    const summarySentences = topComments.map(c => {
      const match = c.text.match(/[^.!?\n]+[.!?\n]/);
      return match ? match[0].trim() : c.text.slice(0, 120).trim();
    });
    const summaryText = summarySentences.join(' ');

    return {
      text: `This policy has received ${dominantSentiment} feedback from beneficiaries`,
      comment: summaryText || 'No representative comment available.'
    };
  };

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    try {
      const reportContent = await generatePolicyReport(policyData);
      const doc = generatePDF(policyData, reportContent);
      doc.save(`${policyData.name.replace(/[^a-zA-Z0-9]/g, '_')}_report.pdf`);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const summary = getSentimentSummary();

  return (
    <section className="max-w-3xl mx-auto mt-10 space-y-6 opacity-0 animate-fadeIn animation-delay-300 results-section" style={{ animationFillMode: 'forwards' }}>
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md">
        {/* Policy Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-400 font-serif">
              {policyData.name}
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={handleTextToSpeech}
                className={`p-2 rounded-full ${
                  isReading 
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 animate-pulse' 
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                }`}
                aria-label={isReading ? "Stop reading" : "Read aloud"}
              >
                <Volume2 size={20} />
              </button>
              <button
                onClick={handleGenerateReport}
                disabled={isGeneratingReport}
                className={`p-2 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors duration-200 ${
                  isGeneratingReport ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                aria-label="Generate PDF Report"
              >
                <FileDown size={20} />
              </button>
            </div>
          </div>
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            {policySummary}
          </p>
        </div>

        {/* Beneficiary Profile */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-gray-750">
          <h4 className="flex items-center text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
            <User size={20} className="mr-2 text-blue-600 dark:text-blue-400" />
            Potential Beneficiary Profile
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm">
              <div className="mb-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Age Range</span>
                <p className="font-medium">{policyData.beneficiaryPersona.ageRange}</p>
              </div>
              <div className="mb-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Gender</span>
                <p className="font-medium">{policyData.beneficiaryPersona.gender}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Occupation</span>
                <p className="font-medium">{policyData.beneficiaryPersona.occupation}</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm">
              <div className="mb-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Location</span>
                <p className="font-medium">{policyData.beneficiaryPersona.location}</p>
              </div>
              <div className="mb-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Income Level</span>
                <p className="font-medium">{policyData.beneficiaryPersona.income}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Additional Details</span>
                <p className="font-medium">{policyData.beneficiaryPersona.additionalDetails}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sentiment Summary */}
        <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-750 dark:to-gray-700">
          <div className="space-y-3">
            <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
              {summary.text}
            </p>
            <p className="text-gray-600 dark:text-gray-300 italic border-l-4 border-blue-500 pl-3">
              "{summary.comment}"
            </p>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="mt-4 flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            {showDetails ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            <span className="ml-2">{showDetails ? 'Hide Details' : 'View Detailed Feedback'}</span>
          </button>
        </div>

        {/* Detailed Sentiment Analysis */}
        {showDetails && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <h4 className="flex items-center text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
              <TrendingUp size={20} className="mr-2 text-blue-600 dark:text-blue-400" />
              Public Sentiment Analysis
            </h4>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Positive</span>
                  <span>{policyData.sentimentData.positive.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-green-500 h-2.5 rounded-full" 
                    style={{ width: `${policyData.sentimentData.positive}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Neutral</span>
                  <span>{policyData.sentimentData.neutral.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-gray-500 h-2.5 rounded-full" 
                    style={{ width: `${policyData.sentimentData.neutral}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Negative</span>
                  <span>{policyData.sentimentData.negative.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-red-500 h-2.5 rounded-full" 
                    style={{ width: `${policyData.sentimentData.negative}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <h5 className="text-md font-medium mt-6 mb-3">Public Comments</h5>
            <div className="space-y-3">
              {['positive', 'neutral', 'negative'].map(sentiment => {
                const filteredComments = policyData.sentimentData.comments.filter(
                  c => !c.text.includes('Please [contact the moderators of this subreddit](/message/compose/?to=/r/india) if you have any questions or concerns.')
                );
                const comment = filteredComments.find(c => c.sentiment === sentiment);
                if (!comment) return null;
                return (
                  <div
                    key={sentiment}
                    className={`p-3 rounded-lg ${
                      sentiment === 'positive'
                        ? 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500'
                        : sentiment === 'negative'
                          ? 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500'
                          : 'bg-gray-50 dark:bg-gray-700 border-l-4 border-gray-400'
                    }`}
                  >
                    <div className="flex items-start">
                      {sentiment === 'positive' ? (
                        <ThumbsUp size={16} className="mr-2 text-green-600 dark:text-green-400 mt-1" />
                      ) : sentiment === 'negative' ? (
                        <ThumbsDown size={16} className="mr-2 text-red-600 dark:text-red-400 mt-1" />
                      ) : null}
                      <p className="text-gray-600 dark:text-gray-300">
                        {comment.text.length > 400 
                          ? `${comment.text.substring(0, 400)}...` 
                          : comment.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ResultsSection;