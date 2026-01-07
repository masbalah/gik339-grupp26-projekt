// Min backend-server.
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(express.json());
app.use(express.static('.'));

const db = new sqlite3.Database('./database.db');

// Skapa tabell
db.run(`CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT, author TEXT, pages INTEGER, genre TEXT
)`);

app.get('/books', (req, res) => {
    db.all('SELECT * FROM books', (err, rows) => res.json(rows));
});

app.post('/books', (req, res) => {
    const { title, author, pages, genre } = req.body;
    db.run('INSERT INTO books (title, author, pages, genre) VALUES (?, ?, ?, ?)', [title, author, pages, genre], () => res.json({status: "ok"}));
});

// KOLLA DENNA: PUT måste ta emot ID för att veta vilken bok som ska ändras
app.put('/books', (req, res) => {
    const { id, title, author, pages, genre } = req.body;
    db.run('UPDATE books SET title = ?, author = ?, pages = ?, genre = ? WHERE id = ?', [title, author, pages, genre, id], () => res.json({status: "ok"}));
});

// KOLLA DENNA: DELETE använder id från URL:en
app.delete('/books/:id', (req, res) => {
    db.run('DELETE FROM books WHERE id = ?', [req.params.id], () => res.json({status: "ok"}));
});

app.listen(3000, () => console.log("Server körs på http://localhost:3000"));