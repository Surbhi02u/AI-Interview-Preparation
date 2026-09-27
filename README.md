# AI Interview Preparation Platform

An AI-powered interview preparation platform that analyzes a candidate's resume, self-description, and job description to generate a personalized interview strategy.

## Features

- User authentication and protected routes
- Resume upload and analysis
- Job description based interview preparation
- AI-generated technical interview questions
- AI-generated behavioral interview questions
- Resume and job description match score
- Skill-gap analysis
- Personalized preparation roadmap
- Interview report history
- Downloadable AI-generated resume PDF
- Responsive and user-friendly interface

## Tech Stack

### Frontend
- React.js
- JavaScript
- SCSS
- Axios
- Vite

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- REST APIs

### AI
- Google Gemini API
- Zod for structured AI responses

## Project Structure

```text
AI-Interview-Preparation/
│
├── Backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   ├── package.json
│   └── server.js
│
├── Frontend/
│   ├── src/
│   │   ├── features/
│   │   ├── assets/
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
│
└── .gitignore
