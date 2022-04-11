import { SortColumn, SortDirection } from "src/app/home/sortable.directive";

export interface SearchState {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}
