document.addEventListener('DOMContentLoaded', function () {
    const bookListElement = document.getElementById('bookList');
    const searchInput = document.getElementById('search');
    const genreFilter = document.getElementById('genreFilter');
    const sortOrder = document.getElementById('sortOrder');
    const paginationElement = document.getElementById('pagination');
    const modalOverlay = document.getElementById('modalOverlay');
    const bookDetailsModal = document.getElementById('bookDetailsModal');
    const closeModalButton = document.getElementById('closeModal');
    const loadingSpinner = document.createElement('div');
    loadingSpinner.id = 'loadingSpinner';
    document.body.appendChild(loadingSpinner);

    let books = [];
    let currentPage = 1;
    const itemsPerPage = 2;

    function fetchBooks() {
        loadingSpinner.style.display = 'block';
        fetch('https://shakthivel1311.github.io/WSD---Lab-Exercise--7/books.json')
            .then(response => response.json())
            .then(data => {
                books = data;
                displayBooks();
            })
            .catch(error => {
                bookListElement.innerHTML = `<p>Error fetching data. Please try again later.</p>`;
                console.error('Error:', error);
            })
            .finally(() => {
                loadingSpinner.style.display = 'none';
            });
    }

    fetchBooks();

    function displayBooks() {
        let filteredBooks = filterBooks();
        let sortedBooks = sortBooks(filteredBooks);
        let paginatedBooks = paginateBooks(sortedBooks);

        bookListElement.innerHTML = paginatedBooks.map(book => `
                <div class="book-card" onclick="showBookDetails(${book.id})">
                    <h3>${book.title}</h3>
                    <p><strong>Author:</strong> ${book.author}</p>
                    <p><strong>Genre:</strong> ${book.genre}</p>
                    <p><strong>Published:</strong> ${new Date(book.publicationDate).toLocaleDateString()}</p>
                    <p>${book.description.substring(0, 60)}...</p>
                </div>
            `).join('');

        updatePagination(filteredBooks.length);
    }

    function showBookDetails(bookId) {
        const book = books.find(b => b.id === bookId);
        if (book) {
            document.getElementById('modalTitle').textContent = book.title;
            document.getElementById('modalAuthor').textContent = book.author;
            document.getElementById('modalGenre').textContent = book.genre;
            document.getElementById('modalPublicationDate').textContent = new Date(book.publicationDate).toLocaleDateString();
            document.getElementById('modalDescription').textContent = book.description;

            const reviews = [
                "A wonderful read!",
                "Couldn't put it down.",
                "An average book, but well-written.",
                "Amazing plot and character development."
            ];
            document.getElementById('modalReviews').innerHTML = reviews.map(review => `<p>- ${review}</p>`).join('');

            modalOverlay.style.display = 'block';
            bookDetailsModal.style.display = 'block';
        }
    }

    closeModalButton.addEventListener('click', () => {
        modalOverlay.style.display = 'none';
        bookDetailsModal.style.display = 'none';
    });


    function filterBooks() {
        const searchQuery = searchInput.value.toLowerCase();
        const genre = genreFilter.value;
        return books.filter(book => {
            const matchesSearch = book.title.toLowerCase().includes(searchQuery) || book.author.toLowerCase().includes(searchQuery);
            const matchesGenre = genre ? book.genre === genre : true;
            return matchesSearch && matchesGenre;
        });
    }

    function sortBooks(booksToSort) {
        const order = sortOrder.value;
        return booksToSort.sort((a, b) => {
            const dateA = new Date(a.publicationDate);
            const dateB = new Date(b.publicationDate);
            return order === 'asc' ? dateA - dateB : dateB - dateA;
        });
    }

    function paginateBooks(booksToPaginate) {
        const start = (currentPage - 1) * itemsPerPage;
        return booksToPaginate.slice(start, start + itemsPerPage);
    }

    function updatePagination(totalItems) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        paginationElement.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.disabled = i === currentPage;
            button.addEventListener('click', () => {
                currentPage = i;
                displayBooks();
            });
            paginationElement.appendChild(button);
        }
    }

    searchInput.addEventListener('input', displayBooks);
    genreFilter.addEventListener('change', displayBooks);
    sortOrder.addEventListener('change', displayBooks);
});
