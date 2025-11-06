const API_BASE = '/jokebook';

async function loadRandomJoke() {
    try {
        const response = await fetch(API_BASE + '/random');
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const joke = await response.json();
        displayRandomJoke(joke);
    } catch (error) {
        console.error("Error:", error);
    }
}

function displayRandomJoke(joke) {
    const setupElement = document.getElementById('random-joke-setup');
    const deliveryElement = document.getElementById('random-joke-delivery');
    setupElement.textContent = joke.setup;
    deliveryElement.textContent = joke.delivery;
}

async function loadCategories() {
    try {
        const response = await fetch(API_BASE + '/categories');
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const categories = await response.json();
        displayCategories(categories);
    } catch (error) {
        console.error("Error:", error);
    }
}

function displayCategories(categories) {
    const container = document.getElementById('categories-container');
    container.innerHTML = '';
    categories.forEach(category => {
        const button = document.createElement('button');
        button.textContent = category;
        button.addEventListener('click', () => searchJokesByCategory(category));
        container.appendChild(button);
    });
}

async function searchJokesByCategory(category) {
    try {
        const limitInput = document.getElementById('joke-limit').value;
        let url = API_BASE + '/category/' + category;
        if (limitInput) {
            url += '?limit=' + limitInput;
        }
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const jokes = await response.json();
        displaySearchResults(jokes, category);
    } catch (error) {
        console.error("Error:", error);
    }
}

function displaySearchResults(jokes, category) {
    const container = document.getElementById('search-results');
    container.innerHTML = '';
    jokes.forEach(joke => {
        const jokeElement = document.createElement('div');
        jokeElement.innerHTML = '<p><strong>' + joke.setup + '</strong></p><p>' + joke.delivery + '</p>';
        container.appendChild(jokeElement);
    });
}

async function handleAddJoke(event) {
    event.preventDefault();
    const category = document.getElementById('joke-category').value;
    const setup = document.getElementById('joke-setup').value;
    const delivery = document.getElementById('joke-delivery').value;
    
    try {
        const response = await fetch(API_BASE + '/joke/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ category: category, setup: setup, delivery: delivery })
        });
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const updatedJokes = await response.json();
        displayAddJokeResults(updatedJokes, category);
        document.getElementById('add-joke-form').reset();
    } catch (error) {
        console.error("Error:", error);
    }
}

function displayAddJokeResults(jokes, category) {
    const container = document.getElementById('add-joke-results');
    container.innerHTML = '<p>Joke added to ' + category + '</p>';
    jokes.forEach(joke => {
        const jokeElement = document.createElement('div');
        jokeElement.innerHTML = '<p><strong>' + joke.setup + '</strong></p><p>' + joke.delivery + '</p>';
        container.appendChild(jokeElement);
    });
}

function init() {
    document.getElementById('refresh-random-joke').addEventListener('click', loadRandomJoke);
    document.getElementById('load-categories').addEventListener('click', loadCategories);
    document.getElementById('search-jokes').addEventListener('click', () => {
        const category = document.getElementById('category-search').value;
        searchJokesByCategory(category);
    });
    document.getElementById('add-joke-form').addEventListener('submit', handleAddJoke);
    loadRandomJoke();
}

window.addEventListener('load', init);