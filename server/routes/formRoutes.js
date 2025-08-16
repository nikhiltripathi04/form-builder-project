// server/routes/formRoutes.js
import express from 'express';
import { createForm, getFormById } from '../controllers/formController.js';

const router = express.Router();

// Route to create a new form
router.post('/', createForm);

// Route to get a specific form by its ID
router.get('/:id', getFormById);

export default router;