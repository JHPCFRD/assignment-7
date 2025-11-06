const express = require('express');
const router = express.Router();
const {
    getCategories,
    getJokesByCategory,
    getRandomJoke,
    addJoke
} = require('../controllers/jokeController');

router.get('/categories', getCategories);
router.get('/category/:category', getJokesByCategory);
router.get('/random', getRandomJoke);
router.post('/joke/add', addJoke);

module.exports = router;