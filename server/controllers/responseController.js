// server/controllers/responseController.js
import Response from '../models/Response.js';

export const submitResponse = async (req, res) => {
  try {
    const responseData = req.body;
    const newResponse = new Response(responseData);
    await newResponse.save();
    res.status(201).json({ message: 'Response submitted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting response', error: error.message });
  }
};