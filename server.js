require('dotenv').config();
const express = require('express');
const app = express();
const jokeRoutes = require('./routes/jokes');

app.use(express.json());
app.use(express.static('public'));
app.use('/jokebook', jokeRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});