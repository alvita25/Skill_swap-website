// import files
require("dotenv").config()
const express = require('express');
const bodyParser = require('body-parser');
const session = require("express-session");
const RedisStore = require("connect-redis").default;
const { createClient } = require("redis");
const router = require('./route.js');

// Create Redis client
const redisClient = createClient({
    url: process.env.REDIS_URL,
    legacyMode: true
});

// Connect to Redis
redisClient.connect()
    .then(() => console.log("Connected to Redis Cloud"))
    .catch(err => console.error("Redis Connection Error:", err));

// Create RedisStore instance
const redisStore = new RedisStore({ client: redisClient });

// create instance of express application
const app = express();

// middleware
app.use(session({
    store: redisStore,
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
