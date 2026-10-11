const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL connection
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 60 * 60 * 1000
    }
}));

// Serve frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Test database connection
pool.connect()
    .then(client => {
        console.log('PostgreSQL connected successfully');
        client.release();
    })
    .catch(error => {
        console.error('PostgreSQL connection failed:', error.message);
    });

// Basic test route
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Task 8 API is running'
    });
});

// Get all services
app.get('/api/services', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM services ORDER BY id'
        );

        res.json({
            success: true,
            services: result.rows
        });
    } catch (error) {
        console.error('Error loading services:', error.message);

        res.status(500).json({
            success: false,
            message: 'Unable to load services.'
        });
    }
});
// Register a new user
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and password are required.'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters.'
            });
        }

        const existingUser = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'An account with this email already exists.'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users (name, email, password)
             VALUES ($1, $2, $3)
             RETURNING id, name, email`,
            [name, email, hashedPassword]
        );

        res.status(201).json({
            success: true,
            message: 'Registration successful.',
            user: result.rows[0]
        });

    } catch (error) {
        console.error('Registration error:', error.message);

        res.status(500).json({
            success: false,
            message: 'Unable to register user.'
        });
    }
});

// Login user
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required.'
            });
        }

        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }

        const user = result.rows[0];

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }

        req.session.userId = user.id;

        res.json({
            success: true,
            message: 'Login successful.',
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error.message);

        res.status(500).json({
            success: false,
            message: 'Unable to login.'
        });
    }
});

// Protect routes that require login
function requireAuth(req, res, next) {
    if (!req.session.userId) {
        return res.status(401).json({
            success: false,
            message: 'Please login to continue.'
        });
    }

    next();
}

// Create a booking
app.post('/api/bookings', requireAuth, async (req, res) => {
    try {
        const { service_id, booking_date, booking_time, review } = req.body;

        if (!service_id || !booking_date || !booking_time) {
            return res.status(400).json({
                success: false,
                message: 'Service, date, and time are required.'
            });
        }

        const service = await pool.query(
            'SELECT id FROM services WHERE id = $1',
            [service_id]
        );

        if (service.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Service not found.'
            });
        }

        const result = await pool.query(
            `INSERT INTO bookings
             (user_id, service_id, booking_date, booking_time, review)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [
                req.session.userId,
                service_id,
                booking_date,
                booking_time,
                review || null
            ]
        );

        res.status(201).json({
            success: true,
            message: 'Booking created successfully.',
            booking: result.rows[0]
        });

    } catch (error) {
        console.error('Booking error:', error.message);

        res.status(500).json({
            success: false,
            message: 'Unable to create booking.'
        });
    }
});

// Start server


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});