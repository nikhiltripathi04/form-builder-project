import React, { useState } from 'react'
import axios from 'axios'

// Reusable components for UI consistency
const ActionButton = ({ onClick, children, className }) => (
  <button onClick={onClick} className={`text-sm font-medium ${className}`}>
    {children}
  </button>
)

const FileInput = ({ onChange, children }) => (
  <label className="block text-sm font-medium text-blue-600 hover:underline cursor-pointer">
    {children}
    <input
      type="file"
      onChange={onChange}
      className="hidden"
      accept="image/*"
    />
  </label>
)

// #region --- Question Editor Components ---

const CategorizeEditor = ({ question, updateQuestion }) => {
  const handleCategoryChange = (index, value) => {
    const newCategories = [...question.categories]
    newCategories[index] = value
    updateQuestion(question.id, { categories: newCategories })
  }

  const handleItemChange = (itemIndex, value) => {
    const newItems = [...question.items]
    newItems[itemIndex].name = value
    updateQuestion(question.id, { items: newItems })
  }

  const addCategory = () => {
    updateQuestion(question.id, {
      categories: [...question.categories, 'New Category'],
    })
  }

  const addItem = () => {
    updateQuestion(question.id, {
      items: [...question.items, { name: 'New Item', category: '' }],
    })
  }

  const removeItem = (index) => {
    const newItems = question.items.filter((_, i) => i !== index)
    updateQuestion(question.id, { items: newItems })
  }

  const removeCategory = (index) => {
    const newCategories = question.categories.filter((_, i) => i !== index)
    updateQuestion(question.id, { categories: newCategories })
  }

  return (
    <div className="mt-4 space-y-4">
      <div>
        <h4 className="font-semibold mb-2 text-gray-700">Categories</h4>
        {question.categories.map((cat, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              value={cat}
              onChange={(e) => handleCategoryChange(index, e.target.value)}
              className="w-full p-2 border rounded-md"
            />
            <ActionButton
              onClick={() => removeCategory(index)}
              className="text-red-500"
            >
              Remove
            </ActionButton>
          </div>
        ))}
        <ActionButton onClick={addCategory} className="text-blue-600">
          + Add Category
        </ActionButton>
      </div>
      <div>
        <h4 className="font-semibold mb-2 text-gray-700">Items</h4>
        {question.items.map((item, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              placeholder="Item Name"
              value={item.name}
              onChange={(e) => handleItemChange(index, e.target.value)}
              className="w-full p-2 border rounded-md"
            />
            <ActionButton
              onClick={() => removeItem(index)}
              className="text-red-500"
            >
              Remove
            </ActionButton>
          </div>
        ))}
        <ActionButton onClick={addItem} className="text-blue-600">
          + Add Item
        </ActionButton>
      </div>
    </div>
  )
}

const ClozeEditor = ({ question, updateQuestion }) => (
  <div className="mt-4">
    <h4 className="font-semibold mb-2 text-gray-700">Cloze Passage</h4>
    <p className="text-sm text-gray-500 mb-2">
      Create blanks by surrounding the correct word with two underscores (e.g.,
      The quick __brown__ fox).
    </p>
    <textarea
      value={question.clozeText}
      onChange={(e) => updateQuestion(question.id, { clozeText: e.target.value })}
      className="w-full p-2 border rounded-md"
      rows="4"
      placeholder="Example: The solar system has __eight__ planets."
    />
  </div>
)

const ComprehensionEditor = ({ question, updateQuestion }) => {
  const handleMCQChange = (mcqIndex, field, value) => {
    const newMCQs = [...question.comprehensionQuestions]
    newMCQs[mcqIndex][field] = value
    updateQuestion(question.id, { comprehensionQuestions: newMCQs })
  }

  const handleOptionChange = (mcqIndex, optIndex, value) => {
    const newMCQs = [...question.comprehensionQuestions]
    newMCQs[mcqIndex].options[optIndex] = value
    updateQuestion(question.id, { comprehensionQuestions: newMCQs })
  }

  const addMCQ = () => {
    const newMCQs = [
      ...question.comprehensionQuestions,
      {
        question: 'New MCQ',
        options: ['Option 1', 'Option 2'],
        correctAnswer: 'Option 1',
      },
    ]
    updateQuestion(question.id, { comprehensionQuestions: newMCQs })
  }

  const removeMCQ = (mcqIndex) => {
    const newMCQs = question.comprehensionQuestions.filter(
      (_, i) => i !== mcqIndex
    )
    updateQuestion(question.id, { comprehensionQuestions: newMCQs })
  }

  return (
    <div className="mt-4 space-y-4">
      <div>
        <h4 className="font-semibold mb-2 text-gray-700">Passage</h4>
        <textarea
          value={question.comprehensionPassage}
          onChange={(e) =>
            updateQuestion(question.id, {
              comprehensionPassage: e.target.value,
            })
          }
          className="w-full p-2 border rounded-md"
          rows="6"
          placeholder="Enter the comprehension passage here..."
        />
      </div>
      <div>
        <h4 className="font-semibold mb-2 text-gray-700">
          Multiple Choice Questions
        </h4>
        {question.comprehensionQuestions.map((mcq, index) => (
          <div key={index} className="p-3 border rounded-md mb-2 bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <input
                type="text"
                placeholder="MCQ Question"
                value={mcq.question}
                onChange={(e) =>
                  handleMCQChange(index, 'question', e.target.value)
                }
                className="w-full p-2 border rounded-md"
              />
              <ActionButton
                onClick={() => removeMCQ(index)}
                className="text-red-500 ml-2"
              >
                Remove
              </ActionButton>
            </div>
            <div className="pl-4">
              {mcq.options.map((opt, optIndex) => (
                <input
                  key={optIndex}
                  type="text"
                  value={opt}
                  onChange={(e) =>
                    handleOptionChange(index, optIndex, e.target.value)
                  }
                  className="w-full p-1 border-b my-1"
                />
              ))}
            </div>
          </div>
        ))}
        <ActionButton onClick={addMCQ} className="text-blue-600">
          + Add MCQ
        </ActionButton>
      </div>
    </div>
  )
}
// #endregion

const FormBuilder = () => {
  const [title, setTitle] = useState('Untitled Form')
  const [headerImage, setHeaderImage] = useState('')
  const [questions, setQuestions] = useState([])
  const [lastSavedFormUrl, setLastSavedFormUrl] = useState('');

  const handleImageUpload = async (file) => {
    const CLOUD_NAME = 'dxhslj34r'
    const UPLOAD_PRESET = 'form_builder_uploads'

    if (!file) return null
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', UPLOAD_PRESET)

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData
      )
      return response.data.secure_url
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Image upload failed. Check the console for details.')
      return null
    }
  }

  const onHeaderImageChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const imageUrl = await handleImageUpload(file)
      if (imageUrl) setHeaderImage(imageUrl)
    }
  }

  const onQuestionImageChange = async (id, e) => {
    const file = e.target.files[0]
    if (file) {
      const imageUrl = await handleImageUpload(file)
      if (imageUrl) updateQuestion(id, { image: imageUrl })
    }
  }

  const addQuestion = (type) => {
    const newQuestion = {
      id: Date.now(),
      questionTitle: 'Untitled Question',
      questionType: type,
      image: '',
    }
    if (type === 'Categorize') {
      newQuestion.categories = ['Category 1', 'Category 2']
      newQuestion.items = [{ name: 'Item 1', category: '' }]
    } else if (type === 'Cloze') {
      newQuestion.clozeText = ''
    } else if (type === 'Comprehension') {
      newQuestion.comprehensionPassage = ''
      newQuestion.comprehensionQuestions = [
        { question: 'MCQ 1', options: ['A', 'B'], correctAnswer: 'A' },
      ]
    }
    setQuestions([...questions, newQuestion])
  }

  const updateQuestion = (id, updatedFields) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, ...updatedFields } : q))
    )
  }

  const deleteQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  const handleSaveForm = async () => {
    const questionsForAPI = questions.map(({ id, ...rest }) => rest)
    const formStructure = { title, headerImage, questions: questionsForAPI }
    try {
      const response = await axios.post(
        'https://form-builder-api-nikhil.onrender.com/api/forms',
        formStructure
      )
      const formUrl = `${window.location.origin}/form/${response.data._id}`;
      setLastSavedFormUrl(formUrl);
    } catch (error) {
      console.error('Error saving form:', error)
      alert('Failed to save form.')
    }
  }
  
  const createNewForm = () => {
      setTitle('Untitled Form');
      setHeaderImage('');
      setQuestions([]);
      setLastSavedFormUrl('');
  }

  const renderQuestionEditor = (question) => {
    switch (question.questionType) {
      case 'Categorize':
        return (
          <CategorizeEditor
            question={question}
            updateQuestion={updateQuestion}
          />
        )
      case 'Cloze':
        return <ClozeEditor question={question} updateQuestion={updateQuestion} />
      case 'Comprehension':
        return (
          <ComprehensionEditor
            question={question}
            updateQuestion={updateQuestion}
          />
        )
      default:
        return null
    }
  }

  if (lastSavedFormUrl) {
    return (
      <div className="p-4 md:p-8 bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-xl text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Form Saved Successfully!</h2>
          <p className="text-gray-700 mb-6">Anyone with the link can view and respond to your form.</p>
          <div className="bg-gray-100 p-4 rounded-lg mb-6 border">
            <a href={lastSavedFormUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-mono break-all hover:underline">
              {lastSavedFormUrl}
            </a>
          </div>
          <button onClick={createNewForm} className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600">
            Create Another Form
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-xl">
        {headerImage && (
          <img
            src={headerImage}
            alt="Header"
            className="w-full h-48 object-cover rounded-t-lg mb-4"
          />
        )}
        <FileInput onChange={onHeaderImageChange}>
          {headerImage ? 'Change Header Image' : '+ Add Header Image'}
        </FileInput>

        <div className="flex justify-between items-center my-6 border-y py-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-3xl font-bold w-full outline-none"
          />
          <button
            onClick={handleSaveForm}
            className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 whitespace-nowrap"
          >
            Save Form
          </button>
        </div>

        <div className="space-y-6">
          {questions.map((q) => (
            <div key={q.id} className="p-4 border rounded-lg bg-white shadow-sm">
              <div className="flex justify-between items-center">
                <input
                  type="text"
                  value={q.questionTitle}
                  onChange={(e) =>
                    updateQuestion(q.id, { questionTitle: e.target.value })
                  }
                  className="w-full text-lg font-semibold p-2"
                />
                <ActionButton
                  onClick={() => deleteQuestion(q.id)}
                  className="text-red-500 ml-4"
                >
                  Delete
                </ActionButton>
              </div>

              {q.image && (
                <img
                  src={q.image}
                  alt="Question content"
                  className="w-full h-auto object-cover rounded-md my-4"
                />
              )}
              <FileInput onChange={(e) => onQuestionImageChange(q.id, e)}>
                {q.image ? 'Change Image' : '+ Add Image to Question'}
              </FileInput>

              {renderQuestionEditor(q)}
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t-2 border-dashed">
          <h3 className="text-lg font-semibold text-center mb-4">
            Add a new question
          </h3>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => addQuestion('Categorize')}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Categorize
            </button>
            <button
              onClick={() => addQuestion('Cloze')}
              className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600"
            >
              Cloze
            </button>
            <button
              onClick={() => addQuestion('Comprehension')}
              className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
            >
              Comprehension
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormBuilder
