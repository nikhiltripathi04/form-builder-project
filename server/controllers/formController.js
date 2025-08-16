// server/controllers/formController.js
import Form from '../models/Form.js'; // Adjust path if your model is elsewhere

// @desc    Create a new form
// @route   POST /api/forms
export const createForm = async (req, res) => {
  try {
    const formData = req.body;
    const newForm = new Form(formData);
    const savedForm = await newForm.save();
    res.status(201).json(savedForm);
  } catch (error) {
    res.status(500).json({ message: 'Error creating form', error: error.message });
  }
};

// @desc    Get a form by its ID
// @route   GET /api/forms/:id
export const getFormById = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    res.status(200).json(form);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching form', error: error.message });
  }
};