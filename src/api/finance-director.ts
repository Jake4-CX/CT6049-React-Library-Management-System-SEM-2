import api from "../axios";

export function getPopularCategoryUnpaidFines() {
  return api.get(`/finance-director/popular/unpaid/category`);
}

export function getPopularAuthorUnpaidFines() {
  return api.get(`/finance-director/popular/unpaid/author`);
}

export function getAverageFinesLast30Days() {
  return api.get(`/finance-director/average/fines/30days`);
}

export function getPercentageUnpaidFines() {
  return api.get(`/finance-director/percentage/unpaid-fines`);
}

export function getTotalUnpaidFines() {
  return api.get(`/finance-director/total/unpaid-fines`);
}