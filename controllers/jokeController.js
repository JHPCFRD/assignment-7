const jokeModel = require('../models/jokeModel');

async function getCategories(req, res) {
    try {
        const categories = await jokeModel.getCategories();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

async function getJokesByCategory(req, res) {
    try {
        const {
            category
        } = req.params;
        let limit = null;
        if (req.query.limit) {
            limit = parseInt(req.query.limit);
        }
        const jokes = await jokeModel.getJokesByCategory(category, limit);

        if (jokes.length === 0) {
            return res.status(404).json({ error: `No jokes found: ${category}` });
        }

        res.json(jokes);
    } catch(error) {
        res.status(500).json({ error: 'Server error' });
    }
}

async function getRandomJoke(req, res) {
    try {
        const joke = await jokeModel.getRandomJoke();
        res.json(joke);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

async function addJoke(req, res) {
    try {
        const { category, setup, delivery } = req.body;

        if (!category || !setup || !delivery) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const updatedJokes = await jokeModel.addJoke(category, setup, delivery);
        res.json(updatedJokes);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports = {
    getCategories,
    getJokesByCategory,
    getRandomJoke,
    addJoke
};