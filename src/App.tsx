import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SurveyForm from './components/SurveyForm';
import SurveyResults from './components/SurveyResults';
import Navigation from './components/Navigation';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <main className="py-8 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<SurveyForm />} />
            <Route path="/results" element={<SurveyResults />} />
            <Route path="*" element={<Navigate to="/\" replace />} />
          </Routes>
        </main>
        <footer className="bg-white shadow-inner py-4 mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500">
              © {new Date().getFullYear()} Lifestyle Survey App
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;