import { stringify } from 'csv-stringify/sync';
import fs from 'node:fs';

export interface RedditComment {
  id: string;
  body: string;
  author: string;
  score: number;
  created: number;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

const REDDIT_CLIENT_ID = 'vanpv5Jb8hzPQyzOaprQVg';
const REDDIT_USER_AGENT = 'script by u/Apprehensive-Fee4041';

export const fetchRedditComments = async (policyName: string): Promise<RedditComment[]> => {
  const comments = mockRedditComments(policyName);
  
  // Add sentiment analysis to comments
  const commentsWithSentiment = comments.map(comment => ({
    ...comment,
    sentiment: analyzeSentiment(comment.body)
  }));

  // Save to CSV
  const csvData = stringify(commentsWithSentiment, {
    header: true,
    columns: ['id', 'body', 'author', 'score', 'created', 'sentiment']
  });

  // Save in a temporary location since we're in a browser environment
  const blob = new Blob([csvData], { type: 'text/csv' });
  localStorage.setItem(`reddit_comments_${policyName.replace(/\s+/g, '_')}`, URL.createObjectURL(blob));

  return commentsWithSentiment;
};

export const analyzeSentiment = (text: string): 'positive' | 'neutral' | 'negative' => {
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'helpful', 'benefit', 'success', 'easy', 'support', 'happy'];
  const negativeWords = ['bad', 'terrible', 'awful', 'difficult', 'problem', 'issue', 'corrupt', 'delay', 'complicated', 'poor'];
  
  let positiveScore = 0;
  let negativeScore = 0;
  
  const words = text.toLowerCase().split(/\s+/);
  
  for (const word of words) {
    if (positiveWords.includes(word)) positiveScore++;
    if (negativeWords.includes(word)) negativeScore++;
  }
  
  if (positiveScore > negativeScore) return 'positive';
  if (negativeScore > positiveScore) return 'negative';
  return 'neutral';
};

const mockRedditComments = (policyName: string): RedditComment[] => {
  const baseComments = [
    {
      id: '1',
      body: `${policyName} has been very helpful for my family. The application process was straightforward.`,
      author: 'citizen123',
      score: 15,
      created: Date.now() - 1000000
    },
    {
      id: '2',
      body: `I applied for ${policyName} three months ago and still waiting for approval. The process is too bureaucratic.`,
      author: 'concerned_voter',
      score: 8,
      created: Date.now() - 500000
    },
    {
      id: '3',
      body: `Does anyone know the eligibility criteria for ${policyName}? The website doesn't provide clear information.`,
      author: 'info_seeker',
      score: 5,
      created: Date.now() - 300000
    },
    {
      id: '4',
      body: `My grandmother received benefits from ${policyName} and it made a huge difference in her healthcare access.`,
      author: 'grateful_grandchild',
      score: 22,
      created: Date.now() - 100000
    },
    {
      id: '5',
      body: `The implementation of ${policyName} varies greatly from state to state. Some states are doing much better than others.`,
      author: 'policy_analyst',
      score: 17,
      created: Date.now() - 200000
    }
  ];
  
  const numComments = Math.floor(Math.random() * 3) + 3;
  const shuffled = [...baseComments].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numComments);
};