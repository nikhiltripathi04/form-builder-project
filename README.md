Custom Form Builder Application
This project is a full-stack web application that allows users to create, manage, and share custom forms. It features a dynamic form editor with specialized question types and a separate interface for users to view and submit their responses.

Table of Contents
Project Overview

Core Features

Technology Stack

Project Structure

Local Development Setup

API Endpoints

Deployment

Live Demonstration

Project Overview
The primary objective of this application is to provide a seamless experience for building dynamic forms. The application is architected with a clear separation between the form creation interface and the form submission view. Form structures and user responses are persisted in a MongoDB database, with communication handled by a RESTful API.

Core Features
Form Editor: An intuitive user interface for building forms, including setting a title and adding various question types.

Dynamic Question Types: Support for three unique question formats:

Categorize: Users match items to predefined categories.

Cloze: Users fill in the blank words in a passage of text.

Comprehension: Users answer multiple-choice questions based on a provided text passage.

Image Integration: Ability to upload a header image for the form and attach images to individual questions.

Form Viewer: A unique, shareable link is generated for each saved form, allowing users to view and submit their responses.

Response Management: All submitted responses are captured and stored in the backend database.

Technology Stack
The project is built using the MERN stack and other modern development tools.

Frontend:

React.js

Tailwind CSS

Axios

React Router

Backend:

Node.js

Express.js

MongoDB with Mongoose

Image Hosting:

Cloudinary

Testing:

Jest

React Testing Library

Supertest

Project Structure
The repository is organized into two primary directories:

/client: Contains the complete React.js frontend application.

/server: Contains the Node.js and Express.js backend API.

Local Development Setup
To run this project on a local machine, please follow these instructions.

Prerequisites
Node.js and npm

MongoDB instance (local or cloud-based)

A Cloudinary account for image uploads

Backend Setup
Navigate to the server directory: cd server

Install dependencies: npm install

Create a .env file in the server directory.

Add your MongoDB connection string to the .env file: MONGO_URI=your_connection_string

Start the server: npm run dev

Frontend Setup
Navigate to the client directory: cd client

Install dependencies: npm install

Start the React application: npm start

The application will be accessible at http://localhost:3000.

API Endpoints
The backend exposes the following RESTful API endpoints:

POST /api/forms: Creates and saves a new form structure.

GET /api/forms/:id: Retrieves a specific form by its unique ID.

POST /api/responses: Submits a user's responses for a specific form.

Deployment
The application is deployed with the following services:

The backend API is hosted on Render.

The frontend client is hosted on Vercel.

Live Demonstration
The live version of the application can be accessed at the following URL:

https://form-builder-project.vercel.app/