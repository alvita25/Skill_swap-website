// import files
require("dotenv").config()
const express = require('express');
const bodyParser = require('body-parser');
const session = require("express-session");
const pgSession = require('connect-pg-simple')(session);
const { Pool } = require('pg');
const router = require('./route.js');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Render PostgreSQL URL
    ssl: { rejectUnauthorized: false } // Required for some Render setups
});

// create instance of express application
const app = express();

// middleware
app.use(session({
    store: new pgSession({
        pool: pool,
        tableName: 'session', // Default is 'session'
        createTableIfMissing: true 
    }),
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/', router);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('listening at port ' + port);
})
