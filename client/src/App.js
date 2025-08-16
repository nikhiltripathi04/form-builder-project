// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FormBuilder from './components/FormBuilder';
import FormViewer from './components/FormViewer'; // We will create this next

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FormBuilder />} />
        <Route path="/form/:formId" element={<FormViewer />} />
      </Routes>
    </Router>
  );
}

export default App;