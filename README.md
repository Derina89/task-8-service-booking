# Task 8 - Service Booking System

A full-stack service booking application built using React, TypeScript, Node.js, Express.js, PostgreSQL, and session-based authentication.

## 📌 Project Overview

BookEase allows users to:

- Register an account
- Login securely
- View available services
- Select a service
- Choose a booking date and time
- Add optional notes/review
- Review booking details before confirmation
- Confirm a booking
- Store booking information in PostgreSQL

The project follows a React frontend + Express REST API + PostgreSQL database architecture.

---

## 🛠️ Technologies Used

### Frontend
- React
- TypeScript
- React Router
- Vite
- HTML
- CSS

### Backend
- Node.js
- Express.js
- REST API
- bcrypt
- express-session
- CORS
- dotenv

### Database
- PostgreSQL

---

## 📁 Project Structure

### Backend

```text
task-8-service-booking/
├── public/
├── server.js
├── package.json
├── package-lock.json
├── schema.sql
├── .env
├── .env.example
├── .gitignore
└── README.md

## Database

Database name:`task8_booking`

Tables:

- users
- services
- bookings

## API Endpoints

### Health Check

`GET /api/health`

### Get Services

`GET /api/services`

### Register

`POST /api/register`

### Login

`POST /api/login`

### Create Booking

`POST /api/bookings`

The booking endpoint requires the user to be logged in.

## How to Run

Install dependencies:

```bash
npm install

Start the server:

node server.js

Backend URL:

http://localhost:3000

Security

The .env file contains private database and session information and must not be uploaded to GitHub.

Task Status

Task 8 Backend - Completed