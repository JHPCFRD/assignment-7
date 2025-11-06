const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function getCategories(req, res) {
    try {
        const result = await pool.query('SELECT name FROM categories ORDER BY name');
        const categories = result.rows.map(row => row.name);
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
        return;
    }
}

async function getJokesByCategory(req, res) {
    try {
        const { category } = req.params;
        let limit = null;
        if (req.query.limit) {
            limit = parseInt(req.query.limit);
        }
        
        let queryText = 'SELECT setup, delivery FROM jokes j JOIN categories c ON j.category_id = c.id WHERE c.name = $1 ORDER BY j.id';
        let values = [category];
        if (limit) {
            queryText += ' LIMIT $2';
            values.push(limit);
        }
        
        const result = await pool.query(queryText, values);
        
        if (result.rows.length === 0) {
            res.status(404).send("No jokes found for category: " + category);
            return;
        }
        
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
        return;
    }
}

async function getRandomJoke(req, res) {
    try {
        const result = await pool.query('SELECT j.setup, j.delivery, c.name as category FROM jokes j JOIN categories c ON j.category_id = c.id ORDER BY RANDOM() LIMIT 1');
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
        return;
    }
}

async function addJoke(req, res) {
    try {
        const { category, setup, delivery } = req.body;
        
        if (!category || !setup || !delivery) {
            res.status(400).send("Missing required parameters");
            return;
        }
        
        let categoryResult = await pool.query('SELECT id FROM categories WHERE name = $1', [category]);
        if (categoryResult.rows.length === 0) {
            categoryResult = await pool.query('INSERT INTO categories (name) VALUES ($1) RETURNING id', [category]);
        }
        const categoryId = categoryResult.rows[0].id;
        
        await pool.query('INSERT INTO jokes (category_id, setup, delivery) VALUES ($1, $2, $3)', [categoryId, setup, delivery]);
        
        const updatedResult = await pool.query('SELECT setup, delivery FROM jokes j JOIN categories c ON j.category_id = c.id WHERE c.name = $1 ORDER BY j.id', [category]);
        res.json(updatedResult.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
        return;
    }
}

module.exports = {
    getCategories,
    getJokesByCategory,
    getRandomJoke,
    addJoke
};