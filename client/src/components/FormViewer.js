import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// --- STYLED: Viewer component for Categorize questions ---
const CategorizeViewer = ({ question, onAnswerChange }) => {
    const [selections, setSelections] = useState({});
    const handleSelect = (itemName, category) => {
        const newSelections = { ...selections, [itemName]: category };
        setSelections(newSelections);
        onAnswerChange(question._id, newSelections);
    };
    return (
        <div className="border-t pt-4 mt-4">
            <p className="text-gray-600 mb-4">Match each item to the correct category.</p>
            <ul className="space-y-3">
                {question.items.map((item) => (
                    <li key={item._id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
                        <span className="font-medium text-gray-800">{item.name}</span>
                        <select
                            onChange={(e) => handleSelect(item.name, e.target.value)}
                            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            defaultValue=""
                        >
                            <option value="" disabled>Select category...</option>
                            {question.categories.map((cat, index) => (
                                <option key={index} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </li>
                ))}
            </ul>
        </div>
    );
};

// --- STYLED: Viewer component for Cloze questions ---
const ClozeViewer = ({ question, onAnswerChange }) => {
    const parts = useMemo(() => {
        if (!question.clozeText) return [];
        return question.clozeText.split(/(__.*?__)/g).filter(part => part.length > 0);
    }, [question.clozeText]);

    const [answers, setAnswers] = useState([]);

    const handleInputChange = (index, value) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
        onAnswerChange(question._id, newAnswers);
    };

    return (
        <div className="text-lg leading-loose bg-gray-50 p-4 rounded-md border">
            {parts.map((part, index) =>
                part.startsWith('__') && part.endsWith('__') ? (
                    <input
                        key={index}
                        type="text"
                        className="inline-block w-36 p-1 border-b-2 border-gray-400 focus:border-blue-500 bg-gray-100 outline-none mx-2 text-center font-semibold"
                        onChange={(e) => handleInputChange(Math.floor(index / 2), e.target.value)}
                    />
                ) : (
                    <span key={index}>{part}</span>
                )
            )}
        </div>
    );
};

// --- STYLED: Viewer component for Comprehension questions ---
const ComprehensionViewer = ({ question, onAnswerChange }) => {
    const [selections, setSelections] = useState({});
    const handleSelect = (mcqId, option) => {
        const newSelections = { ...selections, [mcqId]: option };
        setSelections(newSelections);
        onAnswerChange(question._id, newSelections);
    };
    return (
        <div className="space-y-6">
            <div className="p-5 bg-gray-50 rounded-lg border prose max-w-none">
                <p className="font-serif leading-relaxed text-gray-800">{question.comprehensionPassage}</p>
            </div>
            <div className="space-y-4">
                {question.comprehensionQuestions.map((mcq, index) => (
                    <div key={mcq._id}>
                        <p className="font-semibold text-gray-800 mb-2">{`${index + 1}. ${mcq.question}`}</p>
                        <div className="space-y-2">
                            {mcq.options.map((option, optIndex) => (
                                <label key={optIndex} className="flex items-center p-3 rounded-lg hover:bg-blue-50 cursor-pointer border">
                                    <input
                                        type="radio"
                                        name={mcq._id}
                                        value={option}
                                        onChange={() => handleSelect(mcq._id, option)}
                                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 mr-3"
                                    />
                                    <span className="text-gray-700">{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


const FormViewer = () => {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await axios.get(`https://form-builder-api-nikhil.onrender.com/api/forms/${formId}`);
        setForm(response.data);
      } catch (err) {
        setError('Failed to load the form. Please check the URL.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchForm();
  }, [formId]);
  
  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const responsePayload = {
        formId,
        answers: Object.entries(answers).map(([questionId, answer]) => {
          const question = form.questions.find(q => q._id === questionId);
          return {
            questionId,
            questionType: question ? question.questionType : '',
            answer, 
          };
        }),
      };
      await axios.post('https://form-builder-api-nikhil.onrender.com/api/responses', responsePayload);
      alert('Your response has been submitted successfully!');
    } catch (err) {
      console.error("Submission Error:", err.response ? err.response.data : err);
      alert('There was an error submitting your response.');
    }
  };

  const renderQuestionInput = (question) => {
    switch (question.questionType) {
      case 'Categorize':
        return <CategorizeViewer question={question} onAnswerChange={handleAnswerChange} />;
      case 'Cloze':
        return <ClozeViewer question={question} onAnswerChange={handleAnswerChange} />;
      case 'Comprehension':
        return <ComprehensionViewer question={question} onAnswerChange={handleAnswerChange} />;
      default:
        return <p className="text-red-500">Unsupported question type.</p>;
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen bg-gray-100"><div className="text-xl font-semibold">Loading form...</div></div>;
  if (error) return <div className="flex justify-center items-center h-screen bg-gray-100"><div className="text-xl font-semibold text-red-500">{error}</div></div>;

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        {form.headerImage && <img src={form.headerImage} alt="Form Header" className="w-full h-56 object-cover rounded-xl mb-8" />}
        <h1 className="text-4xl font-bold text-gray-800 mb-2">{form.title}</h1>
        <p className="text-gray-500 mb-8 border-b pb-8">Please fill out the form below.</p>
        
        <div className="space-y-10">
          {form.questions.map((q, index) => (
            <div key={q._id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <label className="text-xl font-semibold text-gray-800 mb-4 block">
                <span className="text-blue-600 font-bold mr-2">{index + 1}.</span>{q.questionTitle}
              </label>
              {q.image && <img src={q.image} alt="Question" className="w-full h-auto object-cover rounded-lg my-4 border" />}
              {renderQuestionInput(q)}
            </div>
          ))}
        </div>
        <button type="submit" className="mt-10 w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-300 shadow-md">
          Submit Response
        </button>
      </form>
    </div>
  );
};

export default FormViewer;
