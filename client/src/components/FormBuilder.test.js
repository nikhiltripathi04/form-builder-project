import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import FormBuilder from './FormBuilder';

// Mock axios to prevent actual network requests during tests
jest.mock('axios');

describe('FormBuilder Component', () => {
  // Test 1: Initial Render
  test('renders the initial form builder UI correctly', () => {
    render(<FormBuilder />);
    
    // Checks for the default title
    expect(screen.getByDisplayValue('Untitled Form')).toBeInTheDocument();
    
    // Checks for the main action buttons
    expect(screen.getByRole('button', { name: /save form/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /categorize/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cloze/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /comprehension/i })).toBeInTheDocument();
  });

  // Test 2: Adding a Question
  test('adds a new question when an "add question" button is clicked', async () => {
    const user = userEvent.setup();
    render(<FormBuilder />);
    
    // Click the "Categorize" button
    const categorizeButton = screen.getByRole('button', { name: /categorize/i });
    await user.click(categorizeButton);
    
    // Verify that a new question input appears with a default title
    expect(screen.getByDisplayValue(/untitled question/i)).toBeInTheDocument();
    // Verify that the specific editor for that question type is rendered
    expect(screen.getByText(/categories/i)).toBeInTheDocument();
  });

  // Test 3: Updating a Question's Title
  test('allows the user to update a question title', async () => {
    const user = userEvent.setup();
    render(<FormBuilder />);
    
    // Add a question first
    await user.click(screen.getByRole('button', { name: /cloze/i }));
    
    const questionTitleInput = screen.getByDisplayValue(/untitled question/i);
    // Clear the input and type a new title
    await user.clear(questionTitleInput);
    await user.type(questionTitleInput, 'My New Cloze Question');
    
    // Check if the value has been updated
    expect(screen.getByDisplayValue('My New Cloze Question')).toBeInTheDocument();
  });

  // Test 4: Deleting a Question
  test('removes a question when the delete button is clicked', async () => {
    const user = userEvent.setup();
    render(<FormBuilder />);
    
    // Add a question
    await user.click(screen.getByRole('button', { name: /comprehension/i }));
    let questionTitleInput = screen.getByDisplayValue(/untitled question/i);
    expect(questionTitleInput).toBeInTheDocument(); // Ensure it's there first
    
    // Click the delete button for that question
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);
    
    // The question input should no longer be in the document
    expect(questionTitleInput).not.toBeInTheDocument();
  });

  // Test 5: Saving the Form (API Mock)
  test('calls the save API when the "Save Form" button is clicked', async () => {
    const user = userEvent.setup();
    // Mock the post request to return a successful response
    axios.post.mockResolvedValue({
      data: { _id: '12345', url: '/form/12345' }
    });
    
    render(<FormBuilder />);
    
    // Add a question to be saved
    await user.click(screen.getByRole('button', { name: /categorize/i }));
    
    // Click the save button
    const saveButton = screen.getByRole('button', { name: /save form/i });
    await user.click(saveButton);
    
    // Verify that axios.post was called exactly once
    expect(axios.post).toHaveBeenCalledTimes(1);
    // Verify it was called with the correct endpoint
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/api/forms'),
      expect.any(Object)
    );
    
    // Check for the success screen
    expect(await screen.findByText(/form saved successfully!/i)).toBeInTheDocument();
  });
});
