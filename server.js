// Min backend-server.
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(express.json());
app.use(express.static('public')); // Om ni lägger HTML i en public-mapp

const db = new sqlite3.Database('./database.db');

// Skapa tabellen om den inte finns
db.run(`CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    author TEXT,
    pages INTEGER,
    genre TEXT
)`);

// GET - Hämta alla böcker
app.get('/books', (req, res) => {
    db.all('SELECT * FROM books', (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// POST - Lägg till ny bok
app.post('/books', (req, res) => {
    const { title, author, pages, genre } = req.body;
    db.run('INSERT INTO books (title, author, pages, genre) VALUES (?, ?, ?, ?)', 
    [title, author, pages, genre], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Boken sparades!', id: this.lastID });
    });
});

// DELETE - Ta bort bok
app.delete('/books/:id', (req, res) => {
    db.run('DELETE FROM books WHERE id = ?', req.params.id, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Boken borttagen!' });
    });
});

app.listen(3000, () => console.log('Server körs på port 3000'));