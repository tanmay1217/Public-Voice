import React, { useState, useRef, useEffect } from 'react';
import { Search, Mic, MicOff, Loader2, ListChecks } from 'lucide-react';
import { getPredictions } from '../utils/policyUtils';

interface InputSectionProps {
  onSearch: (policyName: string, isVoiceInput?: boolean) => void;
  isLoading: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({ onSearch, isLoading }) => {
  const [activeTab, setActiveTab] = useState<'search' | 'finder'>('search');
  const [policyName, setPolicyName] = useState('');
  const [predictions, setPredictions] = useState<string[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState({
    age: '',
    gender: '',
    qualification: '',
    economicStatus: ''
  });
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const predictionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (predictionsRef.current && !predictionsRef.current.contains(event.target as Node)) {
        setShowPredictions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (policyName.trim().length >= 2) {
      const newPredictions = getPredictions(policyName);
      setPredictions(newPredictions);
      setShowPredictions(true);
    } else {
      setPredictions([]);
      setShowPredictions(false);
    }
  }, [policyName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (policyName.trim() && !isLoading) {
      onSearch(policyName.trim());
      setShowPredictions(false);
    }
  };

  const handlePredictionClick = (prediction: string) => {
    setPolicyName(prediction);
    setShowPredictions(false);
    onSearch(prediction);
  };

  const toggleRecording = async () => {
    if (isRecording) {
      stopRecording();
      return;
    }

    setRecordingError(null);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        simulateSpeechToText(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setRecordingError('Could not access your microphone. Please check permissions.');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  
  const simulateSpeechToText = (audioBlob: Blob) => {
    const randomPolicies = [
      "Ayushman Bharat",
      "Pradhan Mantri Awas Yojana",
      "National Health Mission",
      "Pradhan Mantri Kisan Samman Nidhi"
    ];
    
    setTimeout(() => {
      const randomPolicy = randomPolicies[Math.floor(Math.random() * randomPolicies.length)];
      setPolicyName(randomPolicy);
      onSearch(randomPolicy, true);
    }, 1500);
  };

  const getRecommendedPolicies = () => {
    if (!userProfile.age || !userProfile.gender || !userProfile.qualification || !userProfile.economicStatus) {
      return [];
    }

    return [
      "Pradhan Mantri Jan Dhan Yojana (PMJDY)",
      "Skill India Mission",
      "Pradhan Mantri Awas Yojana (PMAY)",
      "Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (AB-PMJAY)",
      "National Apprenticeship Promotion Scheme (NAPS)"
    ];
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const recommendations = getRecommendedPolicies();
    if (recommendations.length > 0) {
      onSearch(recommendations[0]);
    }
  };

  return (
    <section className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transform transition-all duration-300 hover:shadow-lg">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4 text-center">Search for a policy</h3>
        {recordingError && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-sm">
            {recordingError}
          </div>
        )}
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex">
            <div className="relative flex-grow">
              <input
                ref={inputRef}
                type="text"
                value={policyName}
                onChange={(e) => setPolicyName(e.target.value)}
                onFocus={() => setShowPredictions(true)}
                placeholder="Enter a government scheme name..."
                className="w-full px-4 py-3 pr-10 rounded-l-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                disabled={isLoading || isRecording}
              />
              {isLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader2 size={20} className="animate-spin text-gray-400" />
                </div>
              )}
              {showPredictions && predictions.length > 0 && (
                <div 
                  ref={predictionsRef}
                  className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600"
                >
                  {predictions.map((prediction, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handlePredictionClick(prediction)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {prediction}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button
              type="submit"
              disabled={isLoading || !policyName.trim() || isRecording}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-r-lg transition-colors duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Search size={20} />
              <span className="ml-2 hidden sm:inline"></span>
            </button>
          </div>
          
          <button
            type="button"
            onClick={toggleRecording}
            disabled={isLoading}
            className={`mt-4 w-full px-4 py-3 rounded-lg border flex items-center justify-center transition-colors duration-200 ${
              isRecording 
                ? 'bg-red-600 text-white border-red-600 hover:bg-red-700' 
                : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
          >
            {isRecording ? (
              <>
                <MicOff size={20} className="mr-2" />
                <span>Stop Recording</span>
                <span className="ml-2 w-4 h-4 rounded-full bg-red-500 animate-pulse"></span>
              </>
            ) : (
              <>
                <Mic size={20} className="mr-2" />
                <span>Voice Search</span>
              </>
            )}
          </button>
        </form>
        
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
          Speak clearly or type the name of an Indian government welfare scheme
        </p>
      </div>
    </section>
  );
};

export default InputSection;