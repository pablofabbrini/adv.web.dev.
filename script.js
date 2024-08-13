$(document).ready(function() {
    const apiKey = 'YOUR_GOOGLE_BOOKS_API_KEY';
    const resultsPerPage = 10;
    let currentPage = 1;
    let currentSearchTerm = '';

    const searchResultsTemplate = $('#search-results-template').html();
    const bookDetailsTemplate = $('#book-details-template').html();

    // Event listener for search button
    $('#search-button').click(function() {
        currentSearchTerm = $('#search-term').val();
        currentPage = 1;
        searchBooks(currentSearchTerm, currentPage);
    });

    // Function to search books using Google Books API
    function searchBooks(searchTerm, page) {
        const startIndex = (page - 1) * resultsPerPage;
        const url = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&startIndex=${startIndex}&maxResults=${resultsPerPage}&key=${apiKey}`;

        $.getJSON(url, function(data) {
            displayResults(data);
            displayPagination(data.totalItems, searchTerm);
        });
    }

    // Function to display search results
    function displayResults(data) {
        const books = data.items.map(item => ({
            id: item.id,
            cover: item.volumeInfo.imageLinks?.thumbnail,
            title: item.volumeInfo.title,
            author: item.volumeInfo.authors?.join(', '),
            publisher: item.volumeInfo.publisher,
            publishedDate: item.volumeInfo.publishedDate,
            description: item.volumeInfo.description
        }));
        renderSearchResults(books);
    }

    function renderSearchResults(books) {
        const rendered = Mustache.render(searchResultsTemplate, { books });
        $('#search-results').html(rendered);
    }

    // Function to display book details
    function displayBookDetails(data) {
        const book = {
            id: data.id,
            cover: data.volumeInfo.imageLinks?.thumbnail,
            title: data.volumeInfo.title,
            author: data.volumeInfo.authors?.join(', '),
            publisher: data.volumeInfo.publisher,
            publishedDate: data.volumeInfo.publishedDate,
            description: data.volumeInfo.description
        };
        renderBookDetails(book);
    }

    function renderBookDetails(book) {
        const rendered = Mustache.render(bookDetailsTemplate, book);
        $('#search-results').html(rendered);
    }

    $('#search-results').on('click', '.book-item', function() {
        const bookId = $(this).data('id');
        getBookDetails(bookId);
    });

    function getBookDetails(bookId) {
        const url = `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${apiKey}`;
        $.getJSON(url, function(data) {
            displayBookDetails(data);
        });
    }

    // Function to display pagination
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

    // Function to render the library
    function renderLibrary(books) {
        const rendered = Mustache.render(searchResultsTemplate, { books });
        $('#library').html(rendered);
    }

    $('#toggle-view').click(function() {
        const container = $('#search-results');
        if (container.hasClass('grid-view')) {
            container.removeClass('grid-view').addClass('list-view');
            $(this).text('Switch to Grid View');
        } else {
            container.removeClass('list-view').addClass('grid-view');
            $(this).text('Switch to List View');
        }
    });

    $('#toggle-library').click(function() {
        $('#search-results').toggle();
        $('#library').toggle();
        if ($('#library').is(':visible')) {
            getBookshelf();
            $(this).text('Show Search Results');
        } else {
            $(this).text('Show Library');
        }
    });

    // Function to get the bookshelf
    function getBookshelf() {
        const bookshelfId = 'YOUR_BOOKSHELF_ID';
        const url = `https://www.googleapis.com/books/v1/users/YOUR_USER_ID/bookshelves/${bookshelfId}/volumes?key=${apiKey}`;
        $.getJSON(url, function(data) {
            displayBookshelf(data);
        });
    }

    function displayBookshelf(data) {
        const books = data.items.map(item => ({
            id: item.id,
            cover: item.volumeInfo.imageLinks?.thumbnail,
            title: item.volumeInfo.title,
            author: item.volumeInfo.authors?.join(', ')
        }));
        renderLibrary(books);
    }

    // Pagination and search integration
    $('#next-page').click(function() {
        if ((currentPage * resultsPerPage) < totalItems) {
            currentPage++;
            searchBooks(currentSearchTerm, currentPage);
        }
    });

    $('#prev-page').click(function() {
        if (currentPage > 1) {
            currentPage--;
            searchBooks(currentSearchTerm, currentPage);
        }
    });
});
