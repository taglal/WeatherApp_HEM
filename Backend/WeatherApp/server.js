const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
require('dotenv').config();
const sha1 = require('sha1');

const app = express();

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
    connectionLimit: process.env.CONN_LIMIT,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

pool.getConnection((err, connection) => {

    if (err) {
        console.log('Database connection failed!');
        console.log(err);
        return;
    }

    console.log('Database connected successfully!');

    connection.release();
});

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the Weather API!'
    });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

//register
app.post('/users/register', (req, res) => {

    const { name, email, passwd, confirm } = req.body;

    
    if (!name || !email || !passwd || !confirm) {
        return res.status(400).json({
            error: 'Missing required fields'
        });
    }

    
    if (passwd !== confirm) {
        return res.status(400).json({
            error: 'Passwords do not match'
        });
    }

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({
            error: 'Invalid email address'
        });
    }

    
    if (passwd.length < 6) {
        return res.status(400).json({
            error: 'Password must be at least 6 characters long'
        });
    }

    
    const checkSql = 'SELECT ID FROM users WHERE email = ?';

    pool.query(checkSql, [email], (err, results) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                error: 'Database error'
            });
        }

        if (results.length > 0) {
            return res.status(400).json({
                error: 'Email already exists'
            });
        }

        // Jelszó SHA1 hash-elése
        const hashedPassword = sha1(passwd);

        const sql = `
            INSERT INTO users
            (name, email, passwd, role, status)
            VALUES (?, ?, ?, 'user', 1)
        `;

        pool.query(
            sql,
            [name, email, hashedPassword],
            (err, result) => {

                if (err) {
                    console.log(err);

                    return res.status(500).json({
                        error: 'Registration failed'
                    });
                }

                res.status(201).json({
                    message: 'Registration successful',
                    userID: result.insertId
                });
            }
        );
    });
});
const APP_PORT = process.env.APP_PORT;

app.listen(APP_PORT, () => {
    console.log(`Server is running on port ${APP_PORT}`);
});