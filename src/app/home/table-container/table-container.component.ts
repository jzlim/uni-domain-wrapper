import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';
import { SortEvent } from 'src/app/core/model/sort-event';
import { University } from 'src/app/core/model/university';
import { HomeService } from '../home.service';
import { SortableDirective } from '../sortable.directive';

@Component({
  selector: 'app-table-container',
  templateUrl: './table-container.component.html',
  styleUrls: ['./table-container.component.css'],
  providers: [HomeService]
})
export class TableContainerComponent implements OnInit {
  @ViewChildren(SortableDirective) headers!: QueryList<SortableDirective>;

  public universities$: Observable<University[]>;
  public total$: Observable<number>;
  // public universities: University[] = [];
  private filterPageRegex: RegExp = /[^0-9]/g;

  get loading$() { return this.homeService.loading$; }

  get searchTerm() { return this.homeService.searchTerm; }
  set searchTerm(newSearchTerm: string) { this.homeService.searchTerm = newSearchTerm; }
  get pageSize() { return this.homeService.pageSize; }
  set pageSize(newPageSize: number) { this.homeService.pageSize = newPageSize; }
  get page() { return this.homeService.page; }
  set page(newPage: number) { this.homeService.page = newPage; }

  constructor(private homeService: HomeService) { 
    this.universities$ = homeService.universities$;
    this.total$ = homeService.total$;
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    // first call to the API to get master data
    this.homeService.getUniversities();
  }

  onSort({column, direction}: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.homeService.sortColumn = column;
    this.homeService.sortDirection = direction;
  }
  
  selectPage(page: string) {
    this.page = parseInt(page, 10) || 1;
  }
  
  formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(this.filterPageRegex, '');
  }
}
