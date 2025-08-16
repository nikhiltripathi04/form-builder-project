import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import formRoutes from '../routes/formRoutes'; // Adjust path if needed
import responseRoutes from '../routes/responseRoutes'; // Adjust path if needed
import Form from '../models/Form'; // Adjust path if needed
import Response from '../models/Response'; // Adjust path if needed

// Setup a minimal Express app for testing purposes
const app = express();
app.use(express.json());
app.use('/api/forms', formRoutes);
app.use('/api/responses', responseRoutes);

let mongoServer;

// Before all tests, create and connect to a new in-memory MongoDB instance
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

// After each test, clear all data from the collections
afterEach(async () => {
  await Form.deleteMany({});
  await Response.deleteMany({});
});

// After all tests, disconnect from the database and stop the server
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// --- Test Suite for Form API Endpoints ---
describe('Form API (/api/forms)', () => {
  
  // Test 1: Successful form creation
  it('should create a new form successfully with valid data', async () => {
    const validForm = {
      title: 'My Valid Test Form',
      questions: [{ questionTitle: 'Test Question', questionType: 'Cloze' }],
    };

    const res = await request(app)
      .post('/api/forms')
      .send(validForm)
      .expect(201);

    expect(res.body).toHaveProperty('_id');
    expect(res.body.title).toBe('My Valid Test Form');
  });

  // Test 2: Form creation failure (missing title)
  it('should fail to create a form if the title is missing', async () => {
    const invalidForm = {
      questions: [{ questionTitle: 'Test Question', questionType: 'Cloze' }],
    };

    const res = await request(app)
      .post('/api/forms')
      .send(invalidForm)
      .expect(500); // Mongoose validation error results in a 500

    expect(res.body.message).toContain('Error creating form');
  });

  // Test 3: Successful form retrieval
  it('should retrieve an existing form by its ID', async () => {
    const form = await new Form({ title: 'Form to be retrieved' }).save();

    const res = await request(app)
      .get(`/api/forms/${form._id}`)
      .expect(200);

    expect(res.body.title).toBe('Form to be retrieved');
  });

  // Test 4: Form retrieval failure (invalid ID)
  it('should return a 404 error if the form ID does not exist', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    
    const res = await request(app)
      .get(`/api/forms/${nonExistentId}`)
      .expect(404);

    expect(res.body.message).toBe('Form not found');
  });
});


// --- Test Suite for Response API Endpoints ---
describe('Response API (/api/responses)', () => {

  // Test 1: Successful response submission
  it('should submit a response successfully with valid data', async () => {
    const form = await new Form({ title: 'Form for Response' }).save();
    const validResponse = {
      formId: form._id,
      answers: [{ questionId: new mongoose.Types.ObjectId(), questionType: 'Cloze', answer: 'Test' }],
    };

    const res = await request(app)
      .post('/api/responses')
      .send(validResponse)
      .expect(201);

    expect(res.body.message).toBe('Response submitted successfully!');
  });

  // Test 2: Response submission failure (missing formId)
  it('should fail to submit a response if formId is missing', async () => {
    const invalidResponse = {
      answers: [{ questionId: new mongoose.Types.ObjectId(), questionType: 'Cloze', answer: 'Test' }],
    };

    const res = await request(app)
      .post('/api/responses')
      .send(invalidResponse)
      .expect(500);

    expect(res.body.message).toContain('Error submitting response');
  });
});
