import api from "../axios";

export function getAverageBooksLoanedLastDuration(duration: number) {
  return api.get(`/librarian/average/borrowed-books/duration/${duration}`);
}

export function getMostPopularAuthorCurrentlyLoaned() {
  return api.get(`/librarian/popular/currently-loaned/author`);
}

export function getMostPopularCategoryCurrentlyLoaned() {
  return api.get(`/librarian/popular/currently-loaned/category`);
}

export function getPercentageBooksCurrentlyLoaned() {
  return api.get(`/librarian/percentage/currently-loaned/`);
}

export function getBooksPerCategory() {
  return api.get(`/librarian/books-per-category`);
}

export function getAuthorsPerCategory() {
  return api.get(`/librarian/authors-per-category`);
}