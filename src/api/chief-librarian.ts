import api from "../axios";

export function getAverageBooksPerAuthor() {
  return api.get(`/chief-librarian/average/books-author`);
}

export function getAverageBooksPerCategory() {
  return api.get(`/chief-librarian/average/books-category`);
}

export function getAverageLoanDurationLastYear() {
  return api.get(`/chief-librarian/average/loan-duration/year`);
}

export function getAverageLoanDurationLastDuration(duration: number) {
  return api.get(`/chief-librarian/average/loan-duration/duration/${duration}`);
}

export function getAverageTimeToPayFine() {
  return api.get(`/chief-librarian/average/time-pay-fine`);
}

export function getPercentageBooksCurrentlyOverdue() {
  return api.get(`/chief-librarian/percentage/books-overdue`);
}

export function getPercentageBooksReturnedLate() {
  return api.get(`/chief-librarian/percentage/books-late`);
}