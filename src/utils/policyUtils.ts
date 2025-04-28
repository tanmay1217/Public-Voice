import policies from './policiesData';

export const findPolicyMatch = (query: string): string | null => {
  if (!query || query.trim() === '') return null;
  
  const normalizedQuery = query.toLowerCase().trim();
  
  // Try exact match first
  const exactMatch = policies.find(
    policy => policy.toLowerCase() === normalizedQuery ||
    policy.match(/\((.*?)\)/)?.[1]?.toLowerCase() === normalizedQuery // Match abbreviation in parentheses
  );
  
  if (exactMatch) return exactMatch;
  
  // Try matching without parentheses
  const withoutParentheses = policies.find(
    policy => policy.split('(')[0].trim().toLowerCase() === normalizedQuery
  );
  
  if (withoutParentheses) return withoutParentheses;
  
  // Try partial match
  const partialMatch = policies.find(
    policy => policy.toLowerCase().includes(normalizedQuery)
  );
  
  return partialMatch || null;
};

export const findSimilarPolicies = (query: string, limit = 4): string[] => {
  if (!query || query.trim() === '') return [];
  
  const normalizedQuery = query.toLowerCase().trim();
  const queryWords = normalizedQuery.split(' ');
  
  // Find policies that share words with the query
  const matches = policies
    .filter(policy => {
      const policyLower = policy.toLowerCase();
      const policyWords = policyLower.split(' ');
      
      // Check if any query word matches the start of any policy word
      return queryWords.some(word => 
        word.length > 1 && policyWords.some(pWord => pWord.startsWith(word))
      );
    })
    .slice(0, limit);
  
  return matches;
};

export const getPredictions = (query: string, limit = 5): string[] => {
  if (!query || query.trim().length < 2) return [];
  
  const normalizedQuery = query.toLowerCase().trim();
  
  return policies
    .filter(policy => {
      const policyLower = policy.toLowerCase();
      const abbreviation = policy.match(/\((.*?)\)/)?.[1]?.toLowerCase();
      
      return policyLower.includes(normalizedQuery) || 
             abbreviation?.includes(normalizedQuery) ||
             policyLower.split(' ').some(word => word.startsWith(normalizedQuery));
    })
    .slice(0, limit);
};

export const parseVoiceInput = (text: string): string => {
  return text
    .trim()
    .replace(/[^\w\s]/gi, '')
    .replace(/scheme|policy|program|about/gi, '')
    .trim();
};