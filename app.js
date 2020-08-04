// Book Class: Represents a Book
class Book {
  constructor(title, author, isbn, pageCount) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.pageCount = pageCount;
  }
}

// UI Class: Handles UI Tasks
class UI {
  static displayBooks() {
    const books = Store.getBooks();

    books.forEach((book) => UI.addBookToList(book));

    UI.updateTotalPages();
  }

  static updateTotalPages() {
    const books = Store.getBooks();
    const para = document.getElementById("total-pages");
    let totalPages = 0;

    for (let book of books) {
      totalPages += book.pageCount;
    }
    para.innerText = totalPages;
  }

  static addBookToList(book) {
    const list = document.getElementById("book-list");

    const row = document.createElement("tr");

    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td>${book.pageCount}</td>
    <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
    `;

    list.insertBefore(row, list.lastChild);
  }

  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement("div");

    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form);
    // Vanish in 6 seconds
    setTimeout(() => document.querySelector(".alert").remove(), 10000);
  }

  static clearFields() {
    document.querySelector("#title").value = "";
    // document.querySelector("#author").value = "";
    // document.querySelector("#isbn").value = "";
  }
}

// Store Class: Handles Storage
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }

    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();

    books.push(book);

    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  }
}

// Event: Display Books
document.addEventListener("DOMContentLoaded", UI.displayBooks);
// Event: Add a Book
document.querySelector("#book-form").addEventListener("submit", (e) => {
  // Prevent actual submit
  e.preventDefault();

  // Get form value
  const title = document.querySelector("#title").value;
  let found = false;
  let isbn;

  // Validate
  if (title === "") {
    UI.showAlert("Please provide a title.", "danger");
  } else {
    // Fetch book from Google Books API
    const url = `https://www.googleapis.com/books/v1/volumes?q=${title}`;

    fetch(url)
      .then((re) => {
        return re.json();
      })
      .then((data) => {
        const volume = data.items[0].volumeInfo;
        const isbnValues = volume.industryIdentifiers;
        if (!isbnValues) {
          UI.showAlert("We could not find that book", "danger");
        }

        for (let II of isbnValues) {
          // check for a valid isbn value
          console.log(II);
          if (II.type === "ISBN_13") {
            isbn = II.identifier;

            found = true;
            // Instatiate book
            const book = new Book(
              volume.title,
              volume.authors[0],
              isbn,
              volume.pageCount
            );

            //  Add Book to UI
            UI.addBookToList(book);

            // Add book to Store
            Store.addBook(book);

            // Update total pages
            UI.updateTotalPages();

            // Show success message
            UI.showAlert("Book Added", "success");

            // Clear Fields
            UI.clearFields();
          }
        }

        if (found === false) {
          isbnList = data.items[0].volumeInfo.industryIdentifiers;
          for (let II of isbnList) {
            if (II.type === "ISBN_13") {
              UI.showAlert(
                `We could not find that book. Please check the information you entered and try again. Hint: try '${II.identifier}' as your isbn`,
                "danger"
              );
            }
          }
        }
      })
      .catch((err) => {
        UI.showAlert("Something went wrong. Please try again.", "danger");
        console.log(err);
      });
  }
});

// Event: Remove a Book
document.querySelector("#book-list").addEventListener("click", (e) => {
  // Remove book from UI
  UI.deleteBook(e.target);

  // Remove book from store
  Store.removeBook(
    e.target.parentElement.previousElementSibling.previousElementSibling
      .textContent
  );

  // Update total pages
  UI.updateTotalPages();

  // show success message
  UI.showAlert("Book Removed", "success");
});
