import React from 'react';
import { Github, Twitter, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-20 bg-gray-100 dark:bg-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">
                <span className="font-bold text-sm">पव</span>
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Public Voice</h2>
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 max-w-md">
              Bridging the gap between citizens and government welfare schemes through accessible information.
            </p>
          </div>
          
          <div className="flex flex-col space-y-4">
            <div className="flex space-x-4">
              <a href="https://github.com/tanmay1217/Public-Voice" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Github size={20} />
              </a>
              <div className="flex gap-6">
                {/* Contributor 1 */}
                <div className="relative group">
                  <a href="mailto:Tanmayparashar05@gmail.com" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <Mail size={20} />
                  </a>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Tanmay Parashar<br />
                    Tanmayparashar05@gmail.com
                  </div>
                </div>
                {/* Contributor 2 */}
                <div className="relative group">
                  <a href="niteshchaurasia30@gmail.com" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <Mail size={20} />
                  </a>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Nitesh Kumar Chaurasia<br />
                    niteshchaurasia30@gmail.com
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-sm text-gray-500 dark:text-gray-400 text-center md:text-right">
              © {new Date().getFullYear()} Public Voice. All rights reserved.
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 text-center">
          {/* <p>Disclaimer: This application is for informational purposes only. Always verify information with official government sources.</p> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
