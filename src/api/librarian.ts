import api from "../axios";

export function getAverageBooksLoanedLastQuarter() {
  return api.get(`/librarian/average/borrowed-books/quarter`);
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