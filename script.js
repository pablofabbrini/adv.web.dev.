$(document).ready(function() {
    const apiKey = 'YOUR_GOOGLE_BOOKS_API_KEY';
    const resultsPerPage = 10;
    let currentPage = 1;

    $('#search-button').click(function() {
        const searchTerm = $('#search-term').val();
        currentPage = 1;
        searchBooks(searchTerm, currentPage);
    });

    function searchBooks(searchTerm, page) {
        const startIndex = (page - 1) * resultsPerPage;
        const url = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&startIndex=${startIndex}&maxResults=${resultsPerPage}&key=${apiKey}`;

        $.getJSON(url, function(data) {
            displayResults(data);
            displayPagination(data.totalItems, searchTerm);
        });
    }

    function displayResults(data) {
        $('#results').empty();
        data.items.forEach(item => {
            const book = item.volumeInfo;
            const bookElement = `
                <div>
                    <img src="${book.imageLinks?.thumbnail}" alt="${book.title}">
                    <a href="book-details.html?id=${item.id}">${book.title}</a>
                </div>
            `;
            $('#results').append(bookElement);
        });
    }

    function displayPagination(totalItems, searchTerm) {
        $('#pagination').empty();
        const totalPages = Math.ceil(totalItems / resultsPerPage);
        for (let i = 1; i <= totalPages; i++) {
            const pageElement = `<button class="page-button" data-term="${searchTerm}" data-page="${i}">${i}</button>`;
            $('#pagination').append(pageElement);
        }

        $('.page-button').click(function() {
            const term = $(this).data('term');
            const page = $(this).data('page');
            currentPage = page;
            searchBooks(term, page);
        });
    }

    if (window.location.pathname.endsWith('book-details.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const bookId = urlParams.get('id');
        getBookDetails(bookId);
    }

    function getBookDetails(bookId) {
        const url = `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${apiKey}`;
        $.getJSON(url, function(data) {
            displayBookDetails(data);
        });
    }

    function displayBookDetails(data) {
        const book = data.volumeInfo;
        const bookDetails = `
            <div>
                <h2>${book.title}</h2>
                <img src="${book.imageLinks?.thumbnail}" alt="${book.title}">
                <p>Authors: ${book.authors?.join(', ')}</p>
                <p>Publisher: ${book.publisher}</p>
                <p>Published Date: ${book.publishedDate}</p>
                <p>${book.description}</p>
            </div>
        `;
        $('#book-details').append(bookDetails);
    }

    if (window.location.pathname.endsWith('bookshelf.html')) {
        getBookshelf();
    }

    function getBookshelf() {
        const bookshelfId = 'YOUR_BOOKSHELF_ID';
        const url = `https://www.googleapis.com/books/v1/users/YOUR_USER_ID/bookshelves/${bookshelfId}/volumes?key=${apiKey}`;
        $.getJSON(url, function(data) {
            displayBookshelf(data);
        });
    }

    function displayBookshelf(data) {
        $('#bookshelf').empty();
        data.items.forEach(item => {
            const book = item.volumeInfo;
            const bookElement = `
                <div>
                    <img src="${book.imageLinks?.thumbnail}" alt="${book.title}">
                    <a href="book-details.html?id=${item.id}">${book.title}</a>
                </div>
            `;
            $('#bookshelf').append(bookElement);
        });
    }
});
