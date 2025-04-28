import React, { useState } from 'react';
import { ListChecks, Search } from 'lucide-react';

interface PolicyFinderProps {
  onPolicySelect: (policy: string) => void;
}

const PolicyFinder: React.FC<PolicyFinderProps> = ({ onPolicySelect }) => {
  const [userProfile, setUserProfile] = useState({
    age: '',
    gender: '',
    qualification: '',
    economicStatus: ''
  });

  const getRecommendedPolicies = () => {
    const recommendations = [
      "Pradhan Mantri Jan Dhan Yojana (PMJDY)",
      "Skill India Mission",
      "Pradhan Mantri Awas Yojana (PMAY)",
      "Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (AB-PMJAY)",
      "National Apprenticeship Promotion Scheme (NAPS)"
    ];
    return recommendations;
  };

  const handlePolicySelect = (policy: string) => {
    onPolicySelect(policy);
    // Scroll to results after a short delay to allow for rendering
    setTimeout(() => {
      const resultsSection = document.querySelector('.results-section');
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <section className="max-w-3xl mx-auto mt-16 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
          <ListChecks size={24} className="mr-2 text-blue-600 dark:text-blue-400" />
          Find Policies for You
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Age
            </label>
            <input
              type="number"
              value={userProfile.age}
              onChange={(e) => setUserProfile({...userProfile, age: e.target.value})}
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              placeholder="Enter your age"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Gender
            </label>
            <select
              value={userProfile.gender}
              onChange={(e) => setUserProfile({...userProfile, gender: e.target.value})}
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Qualification
            </label>
            <select
              value={userProfile.qualification}
              onChange={(e) => setUserProfile({...userProfile, qualification: e.target.value})}
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            >
              <option value="">Select qualification</option>
              <option value="below10">Below 10th</option>
              <option value="10th">10th Pass</option>
              <option value="12th">12th Pass</option>
              <option value="graduate">Graduate</option>
              <option value="postgraduate">Post Graduate</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Economic Status
            </label>
            <select
              value={userProfile.economicStatus}
              onChange={(e) => setUserProfile({...userProfile, economicStatus: e.target.value})}
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            >
              <option value="">Select status</option>
              <option value="bpl">Below Poverty Line</option>
              <option value="lowerMiddle">Lower Middle Class</option>
              <option value="middleClass">Middle Class</option>
              <option value="upperMiddle">Upper Middle Class</option>
            </select>
          </div>
        </div>

        {(userProfile.age || userProfile.gender || userProfile.qualification || userProfile.economicStatus) && (
          <div className="mt-6">
            <h4 className="text-lg font-medium mb-3">Recommended Policies for You</h4>
            <div className="space-y-2">
              {getRecommendedPolicies().map((policy, index) => (
                <div 
                  key={index}
                  className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500 flex justify-between items-center"
                >
                  <p className="text-gray-800 dark:text-gray-200">{policy}</p>
                  <button
                    onClick={() => handlePolicySelect(policy)}
                    className="ml-2 p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors duration-200"
                    title="Search this policy"
                  >
                    <Search size={18} className="text-blue-600 dark:text-blue-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PolicyFinder;