const resourceForm = document.getElementById('resourceForm');
const resourceList = document.getElementById('resourceList');

async function fetchBooks() {
    const res = await fetch('/books');
    const books = await res.json();
    resourceList.innerHTML = ''; 

    books.forEach(book => {
        // En egenskap (genre) styr färgen (Krav från instruktioner)
        const genreColors = {
            'Fantasy': 'bg-success',      // grön
            'Deckare': 'bg-dark',       // mörk
            'Roman': 'bg-danger',        // röd
            'Facklitteratur': 'bg-primary' // blå
        };
        const badgeColor = genreColors[book.genre] || 'bg-secondary';

        const div = document.createElement('div');
        div.className = "col-md-6 mb-3";
        div.innerHTML = `
            <div class="card p-3 shadow-sm border-2">
                <h6 class="fw-bold">${book.title.toUpperCase()}</h6>
                <p class="mb-1 small"><strong>Författare:</strong> ${book.author}</p>
                <p class="mb-1 small"><strong>Sidor:</strong> ${book.pages}</p> 
                <p class="mb-2"><span class="badge ${badgeColor}">${book.genre}</span></p>
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-warning" id="edit-${book.id}">Ändra</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteBook(${book.id})">Ta bort</button>
                </div>
            </div>`;
        resourceList.appendChild(div);
        
        // Säkrare sätt att hantera ändra-knappen för att undvika JSON-fel
        document.getElementById(`edit-${book.id}`).addEventListener('click', () => editBook(book));
    });
}

// Hantera formuläret (Spara och Uppdatera)
resourceForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('bookId').value;
    const bookData = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        pages: document.getElementById('pages').value, // Hämtar från HTML input
        genre: document.getElementById('genre').value   // Hämtar från HTML select
    };

    if (id) { bookData.id = parseInt(id); }

    await fetch('/books', {
        method: id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData)
    });

    resourceForm.reset();
    document.getElementById('bookId').value = '';
    alert("Boken sparad!");
    fetchBooks();
});

async function deleteBook(id) {
    if (confirm("Vill du ta bort boken?")) {
        await fetch(`/books/${id}`, { method: 'DELETE' });
        fetchBooks();
    }
}

function editBook(book) {
    document.getElementById('bookId').value = book.id;
    document.getElementById('title').value = book.title;
    document.getElementById('author').value = book.author;
    document.getElementById('pages').value = book.pages;
    document.getElementById('genre').value = book.genre;
    window.scrollTo(0,0);
}

fetchBooks();