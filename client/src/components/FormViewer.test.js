import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import FormViewer from './FormViewer';

// Mock axios to control API responses in tests
jest.mock('axios');

// Sample form data that mimics our API response
const mockFormData = {
  title: 'Sample Test Form',
  questions: [
    {
      _id: 'q1',
      questionTitle: 'What is the capital of France?',
      questionType: 'Cloze',
      clozeText: 'The capital is __Paris__.',
    },
    {
      _id: 'q2',
      questionTitle: 'Select the frontend framework.',
      questionType: 'Comprehension',
      comprehensionPassage: 'A popular frontend framework is React.',
      comprehensionQuestions: [
        { _id: 'mcq1', question: 'Which one?', options: ['React', 'Node'] }
      ]
    },
  ],
};

const renderWithRouter = (formId) => {
  return render(
    <MemoryRouter initialEntries={[`/form/${formId}`]}>
      <Routes>
        <Route path="/form/:formId" element={<FormViewer />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('FormViewer Component', () => {
  // Test 1: Loading State
  test('shows a loading message while fetching the form', () => {
    axios.get.mockResolvedValue({ data: mockFormData });
    renderWithRouter('123');
    expect(screen.getByText(/loading form.../i)).toBeInTheDocument();
  });

  // Test 2: Error State
  test('shows an error message if the form fails to load', async () => {
    axios.get.mockRejectedValue(new Error('Failed to fetch'));
    renderWithRouter('123');
    expect(await screen.findByText(/failed to load the form/i)).toBeInTheDocument();
  });

  // Test 3: Successful Data Rendering
  test('renders the form title and questions after successful fetch', async () => {
    axios.get.mockResolvedValue({ data: mockFormData });
    renderWithRouter('123');
    
    // Wait for the form title to appear
    expect(await screen.findByText('Sample Test Form')).toBeInTheDocument();
    
    // Check for question titles
    expect(screen.getByText(/what is the capital of france?/i)).toBeInTheDocument();
    expect(screen.getByText(/select the frontend framework/i)).toBeInTheDocument();
  });

  // Test 4: Form Submission
  test('submits the form data when the submit button is clicked', async () => {
    const user = userEvent.setup();
    axios.get.mockResolvedValue({ data: mockFormData });
    axios.post.mockResolvedValue({ data: { message: 'Success' } });
    
    // Mock window.alert
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    renderWithRouter('123');
    
    // Wait for the form to render
    const submitButton = await screen.findByRole('button', { name: /submit response/i });
    
    // Simulate user filling out the form
    const clozeInput = screen.getByRole('textbox'); // There's only one text input
    await user.type(clozeInput, 'Paris');
    
    const radioOption = screen.getByLabelText('React');
    await user.click(radioOption);
    
    // Click submit
    await user.click(submitButton);
    
    // Verify that the submission API was called
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/api/responses'),
        expect.objectContaining({
          formId: '123',
          answers: expect.any(Array),
        })
      );
    });
    
    // Verify success alert was shown
    expect(alertMock).toHaveBeenCalledWith('Your response has been submitted successfully!');
    
    // Clean up the mock
    alertMock.mockRestore();
  });
});
