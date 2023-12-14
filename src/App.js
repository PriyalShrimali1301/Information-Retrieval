import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DataVisualization from './Visual'; // Import your DataVisualization component
import Chatbot from './Chatbot';
import Visual from './Visual'; // Import your Visual component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Chatbot />} />
        <Route path="/visualisation" element={<DataVisualization />} />
      </Routes>
    </Router>
  );
};

export default App;
