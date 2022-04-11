import { Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime, delay, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { SearchResult } from '../core/model/search-result';
import { SearchState } from '../core/model/search-state';
import { University } from '../core/model/university';
import { HttpService } from '../core/service/http.service';
import { SortColumn, SortDirection } from './sortable.directive';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private _masterUniversities: University[] = [];
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _universities$ = new BehaviorSubject<University[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: SearchState = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  constructor(public httpService: HttpService) {
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(500),
      switchMap(() => this._search()),
      delay(500),
      tap(() => this._loading$.next(false))
    ).subscribe((result: any) => {
      this._universities$.next(result.universities);
      this._total$.next(result.total);
    });
  }

  get universities$() { return this._universities$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }

  set page(page: number) { this._set({page}); }
  set pageSize(pageSize: number) { this._set({pageSize}); }
  set searchTerm(searchTerm: string) { console.log('ST bounce'); this._set({searchTerm}); }
  set sortColumn(sortColumn: SortColumn) { this._set({sortColumn}); }
  set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); }

  private _set(patch: Partial<SearchState>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;

    // sort
    let universities = this._sort(this._masterUniversities, sortColumn, sortDirection);

    // filter
    universities = universities.filter(uni => this._matches(uni, searchTerm));
    const total = universities.length;

    // paginate
    universities = universities.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({universities, total});
  }
  
  private _sort(universities: University[], column: SortColumn, direction: string): University[] {
    if (direction === '' || column === '') {
      return universities;
    } else {
      return [...universities].sort((a, b) => {
        const res = this._compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  private _matches(university: University, term: string) {
    return university.name.toLowerCase().includes(term.toLowerCase())
      || university.alphaTwoCode.toLowerCase().includes(term.toLowerCase())
      || university.country.toLowerCase().includes(term.toLowerCase());
  }

  private _compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  
  getUniversities(): void {
    try {
      this._loading$.next(true);
      const req = { country: 'United States' };
      const obs = this.httpService.httpClientGet('http://universities.hipolabs.com/search', req);
      obs.subscribe((resp: any) => {
        // receive raw data
        this.dataMapper(resp);
      })
    } catch (error) {
      throw error;
    }
  }

  dataMapper(resp: any) {
    // map raw data into the specific format
    // store the master data in Services
    // trigger search subject to respond the data to table component
    if (resp?.length) {
      resp.forEach((uni: any) => {
        const obj: University = {
          alphaTwoCode: uni.alpha_two_code,
          country: uni.country,
          domains: uni.domains,
          name: uni.name,
          stateProvince: uni['state-province'] || null,
          webPages: uni.web_pages
        };
        this._masterUniversities.push(obj);
      });
      this._search$.next();
    }
  }
}
