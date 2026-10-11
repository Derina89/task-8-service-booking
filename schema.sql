CREATE DATABASE task8_booking;

\c task8_booking

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    duration VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_id INTEGER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    review TEXT,
    status VARCHAR(30) DEFAULT 'Confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO services (name, description, duration, price)
VALUES
('Web Development Consultation',
 'Get guidance on building modern web applications and choosing the right technology stack.',
 '60 minutes',
 500.00),

('UI/UX Design Consultation',
 'Discuss website design, user experience, layouts, and modern interface ideas.',
 '45 minutes',
 400.00),

('Career Guidance Session',
 'Get personalized guidance on technology careers, projects, and development skills.',
 '60 minutes',
 600.00),

('Project Review',
 'Review your development project and receive suggestions for improving code and design.',
 '45 minutes',
 450.00);