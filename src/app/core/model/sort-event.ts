import { SortColumn, SortDirection } from "src/app/home/sortable.directive";

export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}
