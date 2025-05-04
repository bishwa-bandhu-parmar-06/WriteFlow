const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;
const userRoutes = require('./routes/users.routes');
const postRoutes = require('./routes/post.routes');



// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // not '*'
  credentials: true                // allow cookies or headers to be sent
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Connecting with data base 
const ConnectDB = require("./database/dbConfig");
ConnectDB();
app.listen(port, () => {
  console.log(`Server is Running on Port : http://localhost:${port}`);
});