// Min backend-server.
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('.'));

const db = new sqlite3.Database('./database.db');

// Skapar tabell
db.run(`CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    author TEXT,
    pages INTEGER,
    genre TEXT
)`);

// GET - Hämta alla böcker (R i CRUD)
app.get('/books', (req, res) => {
    db.all('SELECT * FROM books', (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// POST - Skapa en ny bok (C i CRUD)
app.post('/books', (req, res) => {
    const { title, author, pages, genre } = req.body;
    db.run('INSERT INTO books (title, author, pages, genre) VALUES (?, ?, ?, ?)', 
    [title, author, pages, genre], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Boken sparades!', id: this.lastID });
    });
});

// PUT - Uppdatera en befintlig bok (U i CRUD)
app.put('/books', (req, res) => {
    const { id, title, author, pages, genre } = req.body;
    db.run('UPDATE books SET title = ?, author = ?, pages = ?, genre = ? WHERE id = ?',
    [title, author, pages, genre, id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Boken uppdaterades!' });
    });
});

// DELETE - Ta bort en bok (D i CRUD)
app.delete('/books/:id', (req, res) => {
    db.run('DELETE FROM books WHERE id = ?', req.params.id, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Boken borttagen!' });
    });
});

app.listen(PORT, () => console.log(`Server körs på http://localhost:${PORT}`));