// server/routes/responseRoutes.js
import express from 'express';
import { submitResponse } from '../controllers/responseController.js';

const router = express.Router();

router.post('/', submitResponse);

export default router;