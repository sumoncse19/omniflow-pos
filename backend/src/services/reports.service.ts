import * as reportsRepo from "../repositories/reports.repo";

export async function getRevenueByOutlet() {
  return reportsRepo.getRevenueByOutlet();
}

export async function getTopItems(outletId: number, limit = 5) {
  return reportsRepo.getTopItems(outletId, limit);
}
