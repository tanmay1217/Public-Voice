import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import MainContent from './components/MainContent';
import Footer from './components/Footer';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100 transition-colors duration-200">
        <Header />
        <MainContent />
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;